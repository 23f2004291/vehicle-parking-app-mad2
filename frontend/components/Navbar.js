export default {
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },

  methods: {
    handleLogout() {
      localStorage.removeItem('user'); // Clear from localStorage
      this.$router.push('/login'); // Redirect to login
    }
  },
  
  created() {
    this.$store.commit('setUser');
    console.log('[Navbar] User state initialized:', this.$store.state);
  },


  template: `
    <nav class="styled-navbar">
      <router-link to="/" class="nav-link left-link">Home</router-link>

      <router-link v-if="!loggedIn" to="/login" class="nav-link right-link">Login</router-link>
      <button v-if="loggedIn" @click="handleLogout" class="nav-link right-link">Logout</button>
    </nav>
  `
};


const navbarStyles = `
.styled-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
  background: linear-gradient(to right, #583063, #bc13f4, #583063);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  }
  
  .nav-link {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    margin-left: 2rem;
    padding: 0.5rem 1.2rem;
    border-radius: 30px;
    transition: 0.3s;
    background: transparent;
    border: 2px solid rgba(255,255,255,0.4);
    }
    
    .nav-link:hover {
      background: #a462c9;
      color: #000;
      border: 2px solid #000;
      box-shadow: 0 0 10px #bc13f4, 0 0 20px #a462c9;
      }
      .left-link {
        margin-left: 0;
        }
        
        .right-link {
          margin-right: 2rem;
          }
          `;
          
          const style = document.createElement("style");
          style.innerText = navbarStyles;
          document.head.appendChild(style);
          