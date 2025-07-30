const ParkingSummaryStyles = `
.summary-chart {
  background: #1b1b1b;
  padding: 20px;
  margin: 20px auto;
  border-radius: 12px;
  box-shadow: 0 0 25px #bc13f4;
  color: #fff;
  max-width: 1000px;
  
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
.uschart {
  max-width: 100%;
  border: 3px solid #bc13f4;
  box-shadow: 0 0 10px #bc13f4;
  transition: box-shadow 0.3s ease-in-out;
}

.uschart:hover {
  box-shadow:
    inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
    inset 4px 4px 6px -1px rgba(37,37,37,0.7),
    0 0 5px #bc13f4,
    0 0 10px #bf00ff,
    0 0 25px #bb1eea,
    0 0 50px #a462c9;
}

`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ParkingSummaryStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
      <div class="section">
        <h3>Parking Summary</h3>
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>

      <div class="summary-chart">
        <h3 style="font-size: 1.5rem">Revenue Chart</h3>
        <img v-if="revenueChartUrl" :src="revenueChartUrl" alt="Revenue Chart" class="uschart" />
      </div>
      </br>
      </br>
      </br>

      <div class="summary-chart">
        <h3 style="font-size: 1.5rem">Occupancy Chart</h3>
        <img v-if="occupancyChartUrl" :src="occupancyChartUrl" alt="Occupancy Chart" class="uschart" />
      </div>
    </div>
  `,
  data() {
    return {
      revenueChartUrl: null,
      occupancyChartUrl: null
    };
  },
  methods: {
    async fetchSummary() {
      try {
        const res = await fetch('/api/parking-summary', {
          headers: { 'Authentication-Token': this.$store.state.auth_token }
        });


        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        this.revenueChartUrl = 'data:image/png;base64,' + data.revenue_chart;
        this.occupancyChartUrl = 'data:image/png;base64,' + data.occupancy_chart;
      } catch (err) {
        console.error('Error fetching parking summary:', err);
      }
    }
  },
  mounted() {
    this.fetchSummary();
  }
};
