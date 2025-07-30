const HomeStyles = `
.hero-home {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: url('/static/assets/logo-bg.png') no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 3rem;
  box-sizing: border-box;
}

.logo-image {
  max-width: 40%;
  height: auto;
  z-index: 10;
}

.why-us-section {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  padding: 4rem 6rem;
  background-color: #fff;
}

.why-us-text {
  flex: 1;
  padding-left: 2rem;
}

.why-us-text h2 {
  font-size: 4rem;
  color: #583063;
  margin-bottom: 1rem;
}

.why-us-text ul {
  list-style: none;
  padding: 0;
}

.why-us-text li {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #444;
}
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.why-us-image {
  flex: 1;
  text-align: right;
}

.why-us-image img {
  max-width: 90%;
  height: auto;
  padding-top: 2rem;
}

.banner-section {
  width: 100%;
  padding: 0;
  margin: 0;
}

.banner-section img {
  width: 100%;
  height: auto;
  display: block;
}

.services-section {
  padding: 2rem 2rem ;
  text-align: center;
  background-color: #fff;
  margin-bottom: 2rem;
}

.services-section h2 {
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #583063;
}

.service-cards {
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
}

.card {
  background: #d0bdf4;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 480px;
  text-align: left;
  position: relative;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
              inset 4px 4px 6px -1px	rgba(37,37,37,0.7),
            0 0 5px #bc13f4,
                    0 0 10px #bf00ff,
                    0 0 25px #bb1eea,
                    0 0 50px #a462c9;
        transform: translateY(2px);
}
.card h3 {
  color: #583063;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card p {
  color: #444;
  font-size: 1rem;
}
.sp {
  position: absolute;
  transition: 0.5s;
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

 .footer {
    background-color: #583063;
    color: #fff;
    text-align: center;
    padding: 2rem;
    font-size: 1rem;
    margin-top: 4rem;
  }

  .footer a {
    color: #ffd6ff;
    text-decoration: underline;
  }

  .footer a:hover {
    color: #fff;
  }

`;

const styleSheet = document.createElement("style");
styleSheet.innerText = HomeStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div>
      
      <section class="hero-home">
        <img src="/static/assets/logo.png" alt="Vehicle Vault Logo" class="logo-image" />
      </section>

      
      <section class="why-us-section">
        <div class="why-us-image">
          <img src="/static/assets/car.png" alt="Why Us Image" />
        </div>
        <div class="why-us-text">
          <h2>Why Us?</h2>
          <ul>
            <div class="card">
            <li>1. Secure & Verified Parking Zones</li>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
            </div>
            </br>
            <div class="card">
            <li>2. Smart Navigation to Closest Spot</li>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>            
            </div>
            </br>
            <div class="card">
            <li>3. Real-Time Availability Tracking</li>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
            </div>
          </ul>
        </div>
      </section>

   
      <section class="banner-section">
        <img src="/static/assets/params.png" alt="Vehicle Banner" />
      </section>

  
      <section class="services-section">
        <h2>Our Services</h2>
        <div class="service-cards">
          <div class="card" style="width: 350px;">
            <h3>Smart Auto-Parking Allocation</h3>
            <p>Users simply choose the parking lot, and the app automatically assigns the next available spot — no hassle, no confusion.</p>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
          </div>
          <div class="card" style="width: 350px;">
            <h3>Personalized Parking History</h3>
            <p>Users can view real-time charts of their parking history, usage patterns, most-used lots, and amount spending</p>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
          </div>
          <div class="card" style="width: 350px;">
            <h3>Automated Reports & Daily Reminders</h3>
            <p>Daily booking reminders via email and monthly activity reports in PDF are sent to users</p>
            <span class="sp sp-t"></span>
            <span class="sp sp-r"></span>
            <span class="sp sp-b"></span>
            <span class="sp sp-l"></span>
          </div>
        </div>
      </section>
      <!-- Footer Section -->
      <footer class="footer">
        <p>&copy; 2025 Vehicle Vault. All rights reserved.</p>
        <p>
          <a href="mailto:support@vehiclevault.com">Contact Support</a> |
          <a href="/privacy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  `
};
