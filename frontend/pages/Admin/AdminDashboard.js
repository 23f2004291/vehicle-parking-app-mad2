import ParkingLotSection from './ParkingLot.js'
import ParkingSpotSection from './ParkingSpot.js';
import AllUsersSection from './AllUsers.js';
import PaymentRecords from './PaymentRecords.js';
import ParkingSummary from './ParkingSummary.js';
const AdminDashboardStyles = `
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  color: #eaeaea;
  overflow-x: hidden;
  overflow-y: auto;
}

.dashboard-container {
  margin-top: 60px; /* Adjust for fixed navbar */
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: linear-gradient(to left, #1b1b1b, #2b2b2b);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0,0,0,0.4);
}

.sidebar h2 {
  color: #bc13f4;
  font-size: 22px;
  margin-bottom: 30px;
  text-align: center;
}

.nav-link {
  background: transparent;
  color: #eaeaea;
  padding: 10px 15px;
  margin: 10px 0;
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

.content {
  flex: 1;
  padding: 30px;
  background: url('/static/assets/dash-bg.png') no-repeat center center/cover;
  overflow-y: auto;
}
.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-row input {
  flex: 1;
  padding: 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #1b1b1b;
  color: #fff;
}

.input-row input::placeholder {
  color: #ccc;
}

.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lot-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
}

.lot-card {
  background-color: #2f2f2f;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(188, 19, 244, 0.3);
  width: 280px;
  color: #fff;
}

.lot-card h4 {
  color: #bc13f4;
  margin-bottom: 0.5rem;
}

.card-buttons {
  margin-top: 1rem;
  display: flex;
  gap: max(0.5rem, 1vw);
}

.card-buttons button {
  padding: 6px 12px;
  background: #a462c9;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;

}

.card-buttons button:hover {
  background: #bc13f4;
}

.content h1 {
  font-size: 32px;
  font-weight: bold;
  font:family: 'Arial', sans-serif;
  margin-bottom: 20px;
  color: #d0bdf4;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(to right, #1b1b1b, #252525);
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(188,19,244, 0.2);
}

.section h3 {
  margin-top: 0;
  color: #fff;
}

.showAddForm {
  background: #1b1b1b;
  padding: 20px;
  margin: 20px 0;
  border-radius: 15px;
  box-shadow: 6px 6px 10px -1px rgba(188, 19, 244, 0.2),
              -6px -6px 10px -1px rgba(37, 37, 37, 0.7);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  color: #d0bdf4;
  animation: fadeInAddForm 0.4s ease-out;
}

.showAddForm input {
  padding: 10px;
  background: transparent;
  border: 2px solid #a462c9;
  border-radius: 8px;
  color: #eaeaea;
  font-size: 14px;
  transition: 0.3s ease;
}

.showAddForm input:focus {
  outline: none;
  box-shadow: 0 0 10px #bc13f4, 0 0 20px #a462c9;
  border-color: #bc13f4;
  background-color: #252525;
}

.showAddForm button {
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  background: linear-gradient(to right, #583063, #bc13f4, #583063);
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.showAddForm button:hover {
  background: #a462c9;
  color: #000;
  box-shadow: 0 0 10px #bc13f4, 0 0 25px #bf00ff;
}

@keyframes fadeInAddForm {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-field {
  width: 100%;
  padding: 10px 5px;
  margin: 10px 0;
  border-top: 0;
  border: 2px solid #a462c9;
  outline: none;
  background: transparent;
  color: #d0bdf4;
  font-size: 15px;
  transition: 0.5s;
}

.input-field:focus {
  box-shadow: inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
              inset 4px 4px 6px -1px rgba(37,37,37,0.7),
              0 0 5px #bc13f4,
              0 0 10px #bf00ff,
              0 0 15px #bb1eea,
              0 0 20px #a462c9;
  transform: translateY(2px);
}

.nav-link.active {
  background-color: #752a9e29;
  border-color: #bc13f4;
  color: #bc13f4;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(188, 19, 244, 0.4);
}


`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = AdminDashboardStyles;
document.head.appendChild(styleSheet);

export default {
  components: {
    ParkingLotSection,
    ParkingSpotSection,
    AllUsersSection,
    PaymentRecords,
    ParkingSummary
  },
  template: `
    <div class="dashboard-container">
      <div class="sidebar">
        <h2>Admin Panel</h2>
        <button class="nav-link" :class="{ active: section === 'lots' }" @click="section = 'lots'">Manage Parking Lots</button>
        <button class="nav-link" :class="{ active: section === 'spots' }" @click="section = 'spots'">Parking Spots Overview</button>
        <button class="nav-link" :class="{ active: section === 'users' }" @click="section = 'users'">All Users</button>
        <button class="nav-link" :class="{ active: section === 'payments' }" @click="section = 'payments'">Payment Records</button>
        <button class="nav-link" :class="{ active: section === 'charts' }" @click="section = 'charts'">Summary Charts</button>
      </div>

      <div class="content">
        <h1>Admin Dashboard</h1>

        <ParkingLotSection v-if="section === 'lots'" />
        
        <ParkingSpotSection v-if="section === 'spots'" />

        <AllUsersSection v-if="section === 'users'" />

        <PaymentRecords v-if="section === 'payments'" />          

        <ParkingSummary v-if="section === 'charts'" />
      </div>
    </div>
  `,
  data() {
    return {
      section: 'lots'
    };
  },
  
};