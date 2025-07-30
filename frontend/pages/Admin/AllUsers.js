const AllUsersStyles = `
.lot-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding: 20px;
}

.lot-card {
  padding: 20px;
  margin: 12px;
  background: #1b1b1b;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.04);
  color: #fff;
  width: 300px;
  box-sizing: border-box;
  position: relative;
}

.lot-card h4 {
  margin-top: 0;
  color: #d0bdf4;
}

.lot-card ul {
  padding-left: 20px;
  margin: 0;
}

.lot-card li {
  list-style-type: disc;
  margin: 4px 0;
  color: #d0bdf4;
}

.lot-card p {
  margin: 4px 0;
  color: #e2e2e2;
}

.sp-t {
  top: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to left, transparent, #bc13f4, #bc13f4);
  animation: anim2 2s linear infinite;
  transform: translateY(-300%);
  animation-delay: 0.8s;
}
.sp-r {
  bottom: 0;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to top, transparent, #bc13f4, #bc13f4);
  animation: anim1 2s linear infinite;
  animation-delay: 0s;
}
.sp-b {
  right: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to left, transparent, #bc13f4, #bc13f4);
  animation: anim2 2s linear infinite;
}
.sp-l {
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to top, transparent, #bc13f4, #bc13f4);
  animation: anim1 2s linear infinite;
  animation-delay: 1s;
  transform: translateX(-300%);
}

@keyframes anim1 {
  0% { transform: translateY(300%); }
  100% { transform: translateY(-300%); }
}

@keyframes anim2 {
  0% { transform: translateX(300%); }
  100% { transform: translateX(-300%); }
}


`
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = AllUsersStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
    <div class="section">
        <h3>All Registered Users</h3>
        
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
    </div>
      <div class="lot-cards">
        <div class="lot-card" v-for="user in users" :key="user.id">
          <h4>User ID: {{ user.id }}</h4>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Active:</strong> {{ user.active ? 'Yes' : 'No' }}</p>
          <div v-if="user.vehicles && user.vehicles.length">
            <h4>Vehicles:</h4>
            <ul>
              <li v-for="v in user.vehicles" :key="v.id">
                {{ v.name }} ({{ v.number }})
              </li>
            </ul>
          </div>
          <p><strong>Total Revenue:</strong> ₹{{ user.total_revenue || 0 }}</p>  
        </div>
      </div>
      </div>
  `,
  data() {
    return {
      users: []
    };
  },
  methods: {
    async fetchUsers() {
      const token = this.$store.state.auth_token;
      const res = await fetch('/api/users', {
        headers: { 'Authentication-Token': token }
      });
      const allUsers = await res.json();

      // Filter out admin (assuming ID 1 is admin or based on role logic)
      const nonAdmins = allUsers.filter(user => user.email !== 'admin@example.com');

      // For each user, fetch their payments + vehicles in parallel
      const enhancedUsers = await Promise.all(nonAdmins.map(async (user) => {
        const [revenue, vehicles] = await Promise.all([
          this.fetchRevenue(user.id),
          this.fetchVehicles(user.id)
        ]);

        return {
          ...user,
          total_revenue: revenue.total_amount || 0,
          vehicles
        };
      }));

      this.users = enhancedUsers;
    },

    async fetchRevenue(userId) {
      const res = await fetch(`/api/payment_stats?user_id=${userId}`, {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      return await res.json();
    },

    async fetchVehicles(userId) {
      // You must have this endpoint exposed in your backend:
      // e.g., /vehicles?user_id=ID (filter on backend or frontend as needed)
      const res = await fetch(`/api/vehicles?user_id=${userId}`, {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      if (!res.ok) return [];
      return await res.json();
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
