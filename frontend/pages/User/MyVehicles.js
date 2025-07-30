const VehicleStyles = `
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  color: #eaeaea;
}

.section {
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin: 20px 0;
  max-width: 1100px;
  align-items: start;
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
  justify-content: start;
}


.lot-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: start;
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
  padding: 20px 34px;
  margin: 10px auto;
  font-weight: bold;
  font-size: 14px;
  background: linear-gradient(to right, #583063, #bc13f4);
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
.lot-card {
  position: relative;
  padding: 16px;
  margin: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  min-width: 250px;        
  min-height: 200px;   
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
styleSheet.innerText = VehicleStyles;
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
        <h3>My Vehicles</h3>
        <button @click="showAddForm = true" class="nav-link" v-if="!showAddForm">
          Add Vehicle
        </button>

        <div v-if="showAddForm" class="showAddForm">
          <div class="input-row">
            <input class="input-field" v-model="newVehicle.name" placeholder="Car Name" />
            <input class="input-field" v-model="newVehicle.number" placeholder="Registration Number" />
          </div>
          <div class="button-row">
            <button @click="addVehicle" class="nav-link">Add New Vehicle</button>
            <button @click="showAddForm = false" class="nav-link">Cancel</button>
          </div>
        </div>

        <span class="sp sp-t"></span>
        <span class="sp sp-r"></span>
        <span class="sp sp-b"></span>
        <span class="sp sp-l"></span>
      </div>

      <div class="lot-cards">
        <div class="lot-card" v-for="vehicle in vehicles" :key="vehicle.id">
          <h4>Car Name: {{ vehicle.name }}</h4>
          <p><strong>Registration Number:</strong> {{ vehicle.number }}</p>
          <div class="card-buttons">
            <button @click="editVehicle(vehicle)">Edit</button>
            <button @click="deleteVehicle(vehicle.id)">Delete</button>
          </div>
        </div>
      </div>

      <div v-if="editingVehicle" class="edit-lot-form showAddForm">
        <h4>Edit Vehicle Details: {{ editingVehicle.name }}</h4>
        <div class="input-row">
        <input class="input-field" v-model="editingVehicle.name" placeholder="Vehicle Name" />
        <input class="input-field" v-model="editingVehicle.number" placeholder="Vehicle Number" /></div>
        </br>
        <div class="button-row">
          <button @click="updateVehicle" class="nav-link">Save</button>
          <button @click="editingVehicle = null" class="nav-link">Cancel</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      vehicles: [],
      showAddForm: false,
      newVehicle: {
        name: '',
        number: ''
      },
      editingVehicle: null,
      message: '',
      error: ''
    };
  },
  methods: {
    async fetchVehicles() {
      const res = await fetch('/api/vehicles', {
        headers: { 'Authentication-Token': this.$store.state.auth_token }
      });
      if (res.ok) {
        this.vehicles = await res.json();
      }

    },
    async addVehicle() {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.$store.state.auth_token
        },
        body: JSON.stringify(this.newVehicle)
      });
      if (res.ok) {
        this.message = 'Vehicle registered successfully!';
        setTimeout(() => this.message = '', 4000);
        this.newVehicle = { name: '', number: '' };
        this.showAddForm = false;
        this.fetchVehicles();
      }
      else {
        this.error = 'Failed to register vehicle.';
        setTimeout(() => this.error = '', 4000);
      }
    },
    editVehicle(vehicle) {
      this.editingVehicle = { ...vehicle };
    },
    async updateVehicle() {
      const res = await fetch(`/api/vehicles/${this.editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.$store.state.auth_token
        },
        body: JSON.stringify(this.editingVehicle)
      });
      if (res.ok) {
        this.message = 'Vehicle Details updated successfully!';
        setTimeout(() => this.message = '', 4000);
        this.editingVehicle = null;
        this.fetchVehicles();
      }
      else {
        this.error = 'Failed to update vehicle details.';
        setTimeout(() => this.error = '', 4000);
      }
    },
    async deleteVehicle(id) {
      if (confirm('Are you sure you want to delete this vehicle?')) {
        const res = await fetch(`/api/vehicles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.$store.state.auth_token
          }
        });
        if (res.ok) {
          this.message = 'Vehicle deregistered successfully!';
          setTimeout(() => this.message = '', 4000);
          this.fetchVehicles();
        }
        else {
          this.error = 'Failed to deregister vehicle. Maybe you have parking history with this vehicle.';
          setTimeout(() => this.error = '', 4000);
        }
      }
    }
  },
  mounted() {
    this.fetchVehicles();
  }
};
