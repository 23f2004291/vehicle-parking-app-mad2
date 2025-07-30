const ActiveReservationStyles = `
.receipt-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.receipt-content {
  background: #1b1b1b;
  color: #d0bdf4;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 0 15px #bc13f4;
  min-width: 320px;
  max-width: 90vw;
}
.receipt-content h3 {
  color: #bc13f4;
  margin-bottom: 1rem;
}
.receipt-content p {
  margin: 6px 0;
}
.receipt-content button, .receipt-content select {
  margin-top: 1rem;
  padding: 10px 20px;
  background: linear-gradient(to right, #583063, #bc13f4);
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.receipt-content button:hover, .receipt-content select:hover {
  background: #a462c9;
  color: #000;
  box-shadow: 0 0 10px #bc13f4;
}
.section {
  position: relative; /* Needed for .sp spans */
  padding: 16px;
  margin: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 150px;         /* Ensures it doesn't collapse */
  min-height: 100px;        /* Ensures height doesn't collapse */
  overflow: hidden;         /* Keeps animated borders inside */
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
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ActiveReservationStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
        <div class="section">
            <h3>Active Reservations</h3>
            <div v-if="activeReservations.length === 0">No active reservations at the moment.</div>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
        </div>

      <div class="lot-cards">
        <div class="lot-card" v-for="res in activeReservations" :key="res.id">
          <h4>Vehicle: {{ res.vehicle.number }}</h4>
          <p><strong>Spot:</strong> {{ res.spot_id }}</p>
          <p><strong>Start:</strong> {{ formatDate(res.parking_timestamp) }}</p>
          </br>
          <button @click="endReservation(res)" class="nav-link">Unpark My Vehicle</button>
        </div>
      </div>

      <div v-if="showReceipt" class="receipt-modal">
        <div class="receipt-content">
          <h3>Payment Receipt</h3>
          <p><strong>Vehicle:</strong> {{ receipt.vehicle.number }}</p>
          <p><strong>Start Time:</strong> {{ formatDate(receipt.parking_timestamp) }}</p>
          <p><strong>End Time:</strong> {{ formatDate(receipt.leaving_timestamp) }}</p>
          <p><strong>Amount:</strong> ₹{{ receipt.parking_cost }}</p>

          <div v-if="!paid">
            <label for="method">Select Payment Method:</label><br />
            <select v-model="selectedMethod" id="method">
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
            <button @click="payNow" class="nav-link">Pay Now</button>
          </div>

          <div v-else>
            <p><strong>Payment Method:</strong> {{ selectedMethod }}</p>
            </br>
            <p style="color: lightgreen; font-weight: bold; font-size: 1.2rem">Payment Successful!</p>
            <button @click="closeReceipt" class="nav-link">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      activeReservations: [],
      receipt: {},
      showReceipt: false,
      paid: false,
      selectedMethod: 'Cash'
    };
  },
  methods: {
    async fetchActiveReservations() {
      const res = await fetch('/api/active-reservations', {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      this.activeReservations = await res.json();
    },
    async endReservation(res) {
      const r = await fetch(`/api/reservations/${res.id}`, {
        method: 'PUT',
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      
      const data = await r.json();
      this.receipt = { ...res, parking_cost: data.cost, leaving_timestamp: new Date().toISOString() };
      this.showReceipt = true;
    },
    async payNow() {
      await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.$store.state.auth_token
        },
        body: JSON.stringify({
          reservation_id: this.receipt.id,
          amount: this.receipt.parking_cost,
          method: this.selectedMethod
        })
      });
      this.paid = true;
    },
    closeReceipt() {
      this.showReceipt = false;
      this.paid = false;
      this.selectedMethod = 'Cash';
      this.receipt = {};
      this.fetchActiveReservations();
    },
    formatDate(ts) {
      return new Date(ts).toLocaleString();
    }
  },
  mounted() {
    this.fetchActiveReservations();
  }
};
