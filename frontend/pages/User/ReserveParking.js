const ReserveParkingStyles=`
.reserve-section {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(to right, #1b1b1b, #252525);
  border-radius: 10px;
  color: #eaeaea;
  box-shadow: 0 0 12px rgba(188, 19, 244, 0.15);
}

.reserve-section h3 {
  color: #d0bdf4;
  margin-bottom: 1rem;
}

.reserve-section p {
  margin: 6px 0;
  font-size: 14px;
  color: #ddd;
}

.reserve-section .receipt {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #a462c9;
  border-radius: 10px;
  background-color: #1e1e1e;
}

.reserve-section .receipt p strong {
  color: #bc13f4;
}

.custom-select {
  background-color: #f3e6fb; /* light purple background */
  color: #5a007d;            /* dark purple text */
  padding: 10px;
  border: 1px solid #bc13f4;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  appearance: none;
  transition: 0.3s ease;
}

.custom-select:hover,
.custom-select:focus {
  background-color: #252525; /* darker on hover/focus */
  border-color: #9c00d1;
  outline: none;
}

.custom-select option {
  background-color: #fff;
  color: #5a007d;
  font-weight: 500;
}

.custom-select option:checked {
  background-color: #bc13f4;
  color: white;
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

.alert-box {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: auto;
  max-width: 600px;
  padding: 10px;
}

.alert {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  box-shadow: 0 0 10px rgba(0, 128, 0, 0.3);
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}


`
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ReserveParkingStyles;
document.head.appendChild(styleSheet);
export default {
  template: `
    <div>
    <div v-if="message || error" class="alert-box">
        <div v-if="message" class="alert alert-success">
          {{ message }}
        </div>
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
      <div class="section">
            <h3>Reserve Parking Spot</h3>
            <div v-if="vehicles.length === 0" class="reserve-section">
                <p>No vehicles found. Please register a vehicle in Vehicles Section.</p>
            </div>
            <div v-if="parkingLots.length === 0" class="reserve-section">
                <p>No available parking lots found. Please check back later.</p>
            </div>

            <div class="input-row" v-else>
            <select class="input-field custom-select" v-model="selectedLotId">
                <option disabled value="">Select Parking Lot</option>
                <option v-for="lot in parkingLots" :key="lot.id" :value="lot.id">
                {{ lot.prime_location_name }} (Available: {{ lot.available_spots }} Spots)
                </option>
            </select>

          <select class="input-field custom-select" v-model="selectedVehicleId">
            <option disabled value="">Select Your Vehicle</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.name }} - {{ vehicle.number }}
            </option>
          </select>
        </div>


        <div class="button-row">
          <button class="nav-link" @click="makeReservation" :disabled="!selectedLotId || !selectedVehicleId">
            Confirm Reservation
          </button>
          <button @click="makeReservation = false" class="nav-link">Cancel</button>
        </div>
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>

      <div class="section" v-if="reservationReceipt">
        <h3><strong>Car Parking Reservation Receipt</strong></h3>
        <p><strong>Location:</strong> {{ reservationReceipt.lot }}</p>
        <p><strong>Vehicle:</strong> {{ reservationReceipt.vehicleName }} ({{ reservationReceipt.vehicleNumber }})</p>
        <p><strong>Start Time:</strong> {{ reservationReceipt.start }}</p>
        <p><strong>Spot Number:</strong> {{ reservationReceipt.spotNumber }}</p>
        <p><strong>Price/hour:</strong> ₹{{ reservationReceipt.price }}</p>
        <p><strong>User ID:</strong> {{ reservationReceipt.userId }}</p>
        <button @click="reservationReceipt = null" class="nav-link">Close</button>
      </div>
      
    </div>
  `,

  data() {
    return {
      parkingLots: [],
      vehicles: [],
      selectedLotId: '',
      selectedVehicleId: '',
      reservationReceipt: null,
      message: '', 
      error: ''   
    };
  },

  methods: {
    async fetchLots() {
      const res = await fetch('/api/parking_lots', {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      const lots = await res.json();

      // fetch spot info to get available counts
      const enriched = await Promise.all(
        lots.map(async (lot) => {
          const spotsRes = await fetch(`/api/parking_spots?lot_id=${lot.id}`, {
            headers: { 'Authentication-Token': this.$store.state.auth_token }
          });
          const spots = await spotsRes.json();
          const available = spots.filter(s => s.status === 'A').length;
          return { ...lot, available_spots: available };
        })
      );
      this.parkingLots = enriched;
    },

    async fetchVehicles() {
      const res = await fetch('/api/vehicles', {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      this.vehicles = await res.json();
    },

    async makeReservation() {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.$store.state.auth_token
        },
        body: JSON.stringify({
          lot_id: this.selectedLotId,
          vehicle_id: this.selectedVehicleId,
          
        })
      });
      if (res.ok) {
        const data = await res.json();
        this.reservationReceipt = {
          lot: data.lot_name,
          vehicleName: data.vehicle.name,
          vehicleNumber: data.vehicle.number,
          start: data.parking_timestamp,
          spotNumber: data.spot_number,
          price: data.price,
          userId: data.user_id
        };
        this.message = 'Reservation successful!';
        setTimeout(() => this.message = '', 4000);
        this.error = '';
        this.selectedLotId = '';
        this.selectedVehicleId = '';
        this.fetchLots();
      } else {
        const errText = await res.text();
        console.error("Reservation error:", errText)
        this.error = `Reservation failed: ${errText}`;
        setTimeout(() => this.error = '', 4000);
        this.message = '';
      }
    }
  },

  mounted() {
    this.fetchLots();
    this.fetchVehicles();
  }
};

