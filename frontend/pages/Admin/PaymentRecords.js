const PaymentStyles = `
.payment-card {
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

.payment-card h4 {
  margin-bottom: 0.5rem;
  color: #d0bdf4;
}

.payment-card p {
  margin: 4px 0;
  font-size: 14px;
}

.section-title {
  color: #d0bdf4;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
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
styleSheet.innerText = PaymentStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
      <div class="section">
        <h3 class="section-title">All Payment Records</h3>
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>
      <div class="lot-cards">
        <div class="payment-card" v-for="record in paymentRecords" :key="record.id">
          <h4>Payment ID: {{ record.id }}</h4>
          <p><strong>Amount Received:</strong> ₹{{ record.amount }}</p>
          <p><strong>Method of Payment:</strong> {{ record.method }}</p>
          <p><strong>Payment Time:</strong> {{ formatDate(record.payment_time) }}</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      paymentRecords: [],
    };
  },
  methods: {
    async fetchPayments() {
      const res = await fetch('/api/payments', {
        headers: {
          'Authentication-Token': this.$store.state.auth_token
        }
      });
      if (res.ok) {
        const data = await res.json();
        this.paymentRecords = data;
      }
    },
    
    formatDate(datetimeStr) {
      if (!datetimeStr) return 'N/A';
      const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      };
      return new Date(datetimeStr).toLocaleString(undefined, options);
    },
    
  },
  mounted() {
    this.fetchPayments();
  }
};
