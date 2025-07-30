const ParkingSpotStyles = `
.lot-card {
  padding: 16px;
  margin: 12px;
  background: #1b1b1b;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(188,19,244,0.2);
  color: #fff;
}

.spot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.spot-square {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #aaa;
}

.spot-available {
  background-color: #a462c9; /* Green */
}

.spot-occupied {
  background-color: #d0bdf4; /* Red */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #252525;
  padding: 20px;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(188, 19, 244, 0.3);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
}

.modal h4 {
  margin-top: 0;
  color: #bc13f4;
}

.modal button {
  margin-top: 10px;
  background: #bc13f4;
  color: #000;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(to right, #1b1b1b, #252525);
  box-shadow: 0 0 8px rgba(188,19,244, 0.2);
  position: relative;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  max-width: 1100px;
  align-items: start;
  overflow: hidden; /* ensures borders stay inside */
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

.lot-cards-container {
  display: flex;
  flex-wrap: wrap;            
  gap: 20px;                
  justify-content: flex-start; 
  padding: 20px;
}

.lot-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 300px;               /* Set card width */
  padding: 20px;
  box-sizing: border-box;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Tinted black */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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


`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = ParkingSpotStyles;
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
        <h3>Parking Spot Overview and Reservation Details</h3>
        <div style="display: flex; gap: 16px; margin-top: 12px;">
            <div style="display: flex; align-items: center; gap: 6px;">
                <div class="spot-square spot-available"></div>
                <span>Available</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <div class="spot-square spot-occupied"></div>
                <span>Occupied</span>
            </div>
        </div>
        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>
    
      <div class="lot-cards-container">
        <div class="lot-card" v-for="lot in lots" :key="lot.id">
            <h4>{{ lot.prime_location_name }}</h4>

            <div class="spot-grid">
            <div
                v-for="spot in lot.spots"
                :key="spot.id"
                :class="['spot-square', spot.status === 'O' ? 'spot-occupied' : 'spot-available']"
                @click="spot.status === 'O' ? showReservation(spot.id) : null"
            ></div>
            </div>
        </div>
        </div>


      <div v-if="reservationModal" class="modal-overlay">
        <div class="modal">
          <h4>Reservation Details</h4>
          <p><strong>Vehicle Name:</strong> {{ reservation.vehicle.name }}</p>
          <p><strong>Vehicle Number:</strong> {{ reservation.vehicle.number }}</p>
          <p><strong>Start:</strong> {{ reservation.parking_timestamp }}</p>
          <p><strong>User ID:</strong> {{ reservation.user_id }}</p>
          <button @click="reservationModal = false">Close</button>
          <button class="delete-btn" @click="deleteReservation(reservation.id)">Delete Reservation</button>
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      lots: [],
      reservations: [],
      reservation: null,
      reservationModal: false,
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

      // Fetch all reservations first
      const reservationRes = await fetch('/api/reservations', {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      const reservations = await reservationRes.json();
      this.reservations = reservations;

      // Now fetch all spots for each lot and tag them with reservation info
      for (const lot of lots) {
        const spotRes = await fetch(`/api/parking_spots?lot_id=${lot.id}`, {
          headers: { 'Authentication-Token': this.$store.state.auth_token }
        });
        const spots = await spotRes.json();

        lot.spots = spots.map(s => {
          const match = reservations.find(r => r.spot_id === s.id);
          return match ? { ...s, reservation_id: match.id } : s;
        });
      }

      this.lots = lots;
    },

    async showReservation(spotId) {
      const reservation = this.reservations.find(r => r.spot_id === spotId);
      if (reservation) {
        this.reservation = reservation;
        this.reservationModal = true;
      }
    },

  async deleteReservation(reservationId) {
      if (confirm('Are you sure you want to delete this reservation?')) {
        const res = await fetch(`/api/reservations/${reservationId}`, {
          method: 'DELETE',
          headers: { 'Authentication-Token': this.$store.state.auth_token }
        });
        if (res.ok) {
          this.message = 'Reservation deleted successfully!';
          setTimeout(() => this.message = '', 4000);
          this.fetchLots();
        }
        else {
          this.error = 'Failed to delete reservation.';
          setTimeout(() => this.error = '', 4000);
        }
      }
    }

  },
  mounted() {
    this.fetchLots();
  }
};