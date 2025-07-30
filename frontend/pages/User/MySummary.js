const UserSummaryStyles = `
.summary-chart {
  background: #1b1b1b;
  padding: 20px;
  margin: 20px auto;
  border-radius: 12px;
  box-shadow: 0 0 25px #bc13f4;
  color: #fff;
  max-width: 1000px;
}
.uschart:hover {
  box-shadow: inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
              inset 4px 4px 6px -1px rgba(37,37,37,0.7),
              0 0 5px #bc13f4,
              0 0 10px #bf00ff,
              0 0 25px #bb1eea,
              0 0 50px #a462c9;
}
.section {
  position: relative; /* Needed for .sp spans */
  padding: 16px;
  margin: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 150px;         
  min-height: 100px;       
  overflow: hidden;  
}  
.nav-link {
  background: transparent;
  color: #eaeaea;
  padding: 12px 24px;
  border: 1px solid transparent;
  text-align: left;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-link:hover {
  background-color: #752a9e29;
  border-color: #bc13f4;
  color: #bc13f4;
}
           
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = UserSummaryStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
      <div class="section">
        <h3>User Activity Summary</h3>
        </br>
        <button @click="downloadCSV" class="nav-link">Download Parking Summary Report</button>
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>

      <div class="summary-chart">
        <h3 style="font-size: 1.5rem">Total Spend Over Time</h3>
        <img v-if="spendChartUrl" :src="spendChartUrl" alt="Spend Chart" class="uschart" style="max-width: 100%; border: 3px solid #bc13f4;" />
      </div>
      </br>

      <div class="summary-chart">
        <h3 style="font-size: 1.5rem">Reservations by Day</h3>
        <img v-if="weekdayChartUrl" :src="weekdayChartUrl" alt="Weekday Chart" class="uschart" style="max-width: 100%; border: 3px solid #bc13f4;" />
      </div>
      </br>

      <div class="summary-chart">
        <h3 style="font-size: 1.5rem">Vehicle Usage</h3>
        <img v-if="vehicleChartUrl" :src="vehicleChartUrl" alt="Vehicle Chart" class="uschart" style="max-width: 100%; border: 3px solid #bc13f4;" />
      </div>
    </div>
  `,
  data() {
    return {
      spendChartUrl: null,
      weekdayChartUrl: null,
      vehicleChartUrl: null
    };
  },
  methods: {
    async fetchUserSummary() {
      try {
        const res = await fetch('/api/user-summary', {
          headers: {
            'Authentication-Token': this.$store.state.auth_token
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();

        this.spendChartUrl = `data:image/png;base64,${data.spend_chart}`;
        this.weekdayChartUrl = `data:image/png;base64,${data.weekday_chart}`;
        this.vehicleChartUrl = `data:image/png;base64,${data.vehicle_chart}`;
      } catch (error) {
        console.error('Error loading user summary:', error);
      }
    },
    async downloadCSV(){
      const res = await fetch(`${location.origin}/create-csv`, {
        headers: {
          'Authentication-Token': this.$store.state.auth_token
        }
      });
      const task_id = (await res.json()).task_id;
      const interval = setInterval(async () => {
        const res = await fetch(`${location.origin}/get-csv/${task_id}`);
        if (res.ok) {
          console.log('CSV download started');
          window.open(`${location.origin}/get-csv/${task_id}`);
          clearInterval(interval);
        }
      }, 100); // fixed interval pulling
    }
  },
  mounted() {
    this.fetchUserSummary();
  }
};
