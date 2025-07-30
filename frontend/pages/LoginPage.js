const loginRegisterStyles = `
body{
        margin: 0;
        padding: 0;
        min-height:100vh;
        font-family: sans-serif;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      .hero{
        margin-top: 60px; /* Adjust for fixed navbar */
        height: calc(100vh - 78.5px);
        width : 100%;
        background: url('/static/assets/dash-bg.png') no-repeat center center/cover;;
        position: relative;
        overflow: hidden;

      }
      div{
        box-sizing: border-box;
      }
      /*main box*/
      .main-box{
        width: 320px;
        height: 480px;
        position: relative;
        margin: 6% auto;
        background:#1b1b1b;
        display: flex;
        justify-content: center;
        align-items: center; 
        overflow: hidden;
      }
      .sp{
        position: absolute;
        transition: 0.5s; 
      }
      .sp-t{
        top: 0;
        right: 0;
        width: 200px;
        height: 2px;
        background:linear-gradient( to left , transparent,#bc13f4,#bc13f4);
        animation: anim2 2s linear infinite;
        transform: translateY(-300%);
        animation-delay: 0.8s;
      }
      .sp-r{
        bottom: 0;
        right: 0;
        width: 2px;
        height: 200px;
        background:linear-gradient( to top , transparent,#bc13f4 ,#bc13f4);
        animation: anim1 2s linear infinite;
        animation-delay: 0s;
      }
      .sp-b{
        right: 0;
        bottom: 0;
        width: 200px;
        height: 2px;
        background:linear-gradient( to left , transparent,#bc13f4,#bc13f4);
        animation: anim2 2s linear infinite;
      }
      .sp-l{
        left: 0;
        top:0;
        width: 2px;
        height: 200px;
        background:linear-gradient( to top , transparent,#bc13f4,#bc13f4);
        animation: anim1 2s linear infinite;
        animation-delay: 1s;
        transform: translateX(-300%);
      }
      @keyframes anim1 {
          0%{
              transform: translateY(300%);
              
          }
          100%{
              transform: translateY(-300%);
              
          }
      }
      @keyframes anim2 {
          0%{
              transform: translateX(300%);
          }
          100%{
              transform: translateX(-300%);
              
          }
      }
      /*main box end*/

      .form-box{
        width: 316px;
        height: 476px;
        position: relative;
        background:#752a9e29; 
        padding: 5px;
        overflow: hidden;
        z-index: 5;
      }
      #after{
        width: 50%;
        height: 100%;
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        background:#2d2e30 #752a9e29; 
        z-index:-1;
        transition: 0.5s;
      }
      .button-box{
        width: 220px;
        margin: 35px auto 30px auto;
        position: relative;
        border: #bc13f4 1.5px solid;
        
        border-radius:30px; 
        display: flex;
        justify-content: space-around;
        box-shadow: 6px 6px 10px -1px #a462c9,
              -6px -6px 10px -1px	rgba(37,37,37,0.7);
      }

      @keyframes animBTN {
          0%{
              box-shadow:  0 0 10px 9px rgba(3,169,244,0.3);
          }
          33%{
              box-shadow:  0 0 10px 9px rgba(244,65,165,0.3);
              
          }
          66.9%{
              box-shadow:  0 0 10px 9px rgba(255,235,59,0.3);
              
          }
          100%{
              box-shadow:  0 0 10px 9px rgba(3,169,244,0.3);
          }
      }
      .toggle-btn{
        padding: 10px 30px;
        cursor: pointer;
        background:transparent;
        border: 0;
        font-size: 14px;
        font-weight: bold;
        color: rgb(234, 234, 235);
        outline: none;
        position: relative;
        transition: 0.5s;
      }
      #btn{
        position: absolute;
        top: 0;
        left: 0;
        
        width: 110px;
        height: 100%;
        background:linear-gradient( to left , #bc13f4, #e68dffff);
        border-radius: 30px;
        transition: 0.5s; 
      }
      .social-icons{
        margin: 0 auto;
        text-align: center;
        display: flex;
        justify-content: center;
      }
      .icon-link{
        display: flex;
        background: transparent;
        width: 50px;
        height: 50px;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        border-radius: 50%;
        margin: 0px 10px;
        box-shadow: 6px 6px 10px -1px rgba(234, 234, 235, 0.1),
              -6px -6px 10px -1px	rgba(37,37,37,0.7);
        border: 1px solid rgba(234, 234, 235,0.09);
        transition: transform 0.5s;
      } 
      .cont-icon{
        color: #a462c9;
        font-size: 28px;
        transition: transform 0.5s;
      }
      .icon-link:hover{
        box-shadow: inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
              inset 4px 4px 6px -1px	rgba(37,37,37,0.7),
            0 0 5px #bc13f4,
                    0 0 25px #bf00ff,
                    0 0 50px #bb1eea,
                    0 0 100px #a462c9;
        transform: translateY(2px);
      }
      .icon-link:hover .cont-icon{
        transform: scale(0.95);
      }
      .icon-link:hover .fa-facebook{
        color: #a462c9;
      }
      .icon-link:hover .fa-instagram{
        color: #a462c9;
      }
      .icon-link:hover .fa-github{
        color: #a462c9;
      }
      .input-group{
        width: 320px; 
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        top:180px;
        position: absolute;
        padding:0 30px;
        transition: 0.5s;
        box-sizing: border-box;
      }
      .input-field{
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
      .input-field:focus{
        box-shadow: inset 4px 4px 6px -1px rgba(234, 234, 235, 0.2),
              inset 4px 4px 6px -1px	rgba(37,37,37,0.7),
            0 0 5px #bc13f4,
                    0 0 10px #bf00ff,
                    0 0 15px #bb1eea,
                    0 0 20px #a462c9;
        transform: translateY(2px);
        
      }

      .submit-btn{
        width: 85%;
        padding: 10px 30px;
        cursor: pointer;
        display: block;
        margin: 30px auto 0 auto;
        background: linear-gradient(to right, #583063,#bc13f4,#583063);
        border:0;
        outline: none;
        border-radius: 30px; 
        position: relative;
        z-index: 5;
          box-sizing: border-box;   
          color:#fff;
          font-weight: bold;
          font-size:15px; 
          transition: 0.5s;
      }
      .submit-btn:hover {

        background:#a462c9;
        color: #000000;
        border-radius: 30px;
        box-shadow: 0 0 5px #000000,
                    0 0 25px #bf00ff,
                    0 0 50px #bb1eea,
                    0 0 100px #a462c9;
      }
      

      .span{
        margin: 20px 0;
        color:rgb(234, 234, 235);
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        /*position: absolute;
        bottom: 88px;*/
      }
      .check-box{
        margin: 0 10px ;
        padding: 0;
      }

      #login{
        left : 0px; 
      }
      #register{
        left : 500px;
      }



      @keyframes a {
        0%{
          background-position: 0%;
        }
        100%{
          background-position: 400%;
        }
      }

      @keyframes animBTN {
          0%{
              box-shadow:  0 0 10px 9px rgba(3,169,244,0.3);
          }
          33%{
              box-shadow:  0 0 10px 9px rgba(244,65,165,0.3);
              
          }
          66.9%{
              box-shadow:  0 0 10px 9px rgba(255,235,59,0.3);
              
          }
          100%{
              box-shadow:  0 0 10px 9px rgba(3,169,244,0.3);
          }
      }
        .feedback {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        font-weight: bold;
        padding: 12px 24px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease-out;
        }

        .feedback.success {
        background-color: #2ecc71;
        }

        .feedback.error {
        background-color: #e74c3c;
        }

        @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        }


`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = loginRegisterStyles;
document.head.appendChild(styleSheet);

export default {
  template: `
    <div class="hero">
      <div class="main-box">
        <div class="form-box">
          <div id="after"></div>
          <div class="button-box">
            <div id="btn"></div>
            <button id="log" type="button" class="toggle-btn" @click="switchToLogin">Log in</button>
            <button id="reg" type="button" class="toggle-btn" @click="switchToRegister">Register</button>
          </div>
          <div class="social-icons">
            <a class="icon-link" href="#"><i class="fab fa-facebook cont-icon"></i></a>
            <a class="icon-link" href="#"><i class="fab fa-instagram cont-icon"></i></a>
            <a class="icon-link" href="#"><i class="fab fa-github cont-icon"></i></a>
          </div>
          <form id="login" class="input-group" :style="{ left: loginFormLeft }" @submit.prevent="submitLogin">
            <input type="text" class="input-field" placeholder="Email" v-model="loginData.email" required />
            <input type="password" class="input-field" placeholder="Password" v-model="loginData.password" required />
            <input type="submit" class="submit-btn" value="Log in" />
          </form>
          <form id="register" class="input-group" :style="{ left: registerFormLeft }" @submit.prevent="submitRegister">
          <input type="email" class="input-field" placeholder="Email" v-model="registerData.email" required />
          <input type="password" class="input-field" placeholder="Password" v-model="registerData.password" required />
          
            <input type="submit" class="submit-btn" value="Register" />
          </form>
          </div>
          <span class="sp sp-t"></span>
          <span class="sp sp-r"></span>
          <span class="sp sp-b"></span>
          <span class="sp sp-l"></span>
          </div>
          <div v-if="feedbackMessage" :class="['feedback', feedbackType]">
          {{ feedbackMessage }}
        </div>
    </div>
  `,
  data() {
    return {
      loginFormLeft: "0px",
      registerFormLeft: "500px",
      loginData: {
        email: '',
        password: ''
      },
      registerData: {
          email: '',
          password: ''
      },
      feedbackMessage: "",     
      feedbackType: ""         // 🆕 'success' or 'error'
    }
  },
  methods: {
    switchToRegister() {
      this.loginFormLeft = "-500px";
      this.registerFormLeft = "0px";
      document.getElementById("btn").style.left = "110px";
      document.getElementById("log").style.color = "rgb(234, 234, 235)";
      document.getElementById("reg").style.color = "#252525";
      document.getElementById("after").style.left = "0";
    },
    switchToLogin() {
      this.loginFormLeft = "0px";
      this.registerFormLeft = "500px";
      document.getElementById("btn").style.left = "0px";
      document.getElementById("reg").style.color = "rgb(234, 234, 235)";
      document.getElementById("log").style.color = "#252525";
      document.getElementById("after").style.left = "50%";
    },
    async submitLogin() {
    try {
      const res = await fetch(`${location.origin}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.loginData.email,
          password: this.loginData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        this.feedbackMessage = data.message || "Login successful!";
        this.feedbackType = "success";

        const userData = {
        token: data.token,
        role: data.role,
        id: data.id,
        email: data.email
      };

      localStorage.setItem('user', JSON.stringify(userData));
      this.$store.commit('setUser', userData); // Pass the user data


       
        if (data.role === 'admin') {
          this.$router.push({ path: '/admin_dashboard', query: { msg: this.feedbackMessage } });
        } else {
          this.$router.push({ path: '/user_dashboard', query: { msg: this.feedbackMessage } });
        }

        setTimeout(() => {
          this.feedbackMessage = '';
          this.feedbackType = '';
        }, 3000);
      } else {
        this.feedbackMessage = data.message || "Login failed!";
        this.feedbackType = "error";
        setTimeout(() => {
          this.feedbackMessage = '';
          this.feedbackType = '';
        }, 3000);
      }
    } catch (err) {
      this.feedbackMessage = "Server error during login!";
      this.feedbackType = "error";
      setTimeout(() => {
        this.feedbackMessage = '';
        this.feedbackType = '';
      }, 3000);
    }
  }

,
    async submitRegister() {
    try {
        const res = await fetch(`${location.origin}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: this.registerData.email,
            password: this.registerData.password
        })
        });

        const data = await res.json();

        if (res.ok) {
        this.feedbackMessage = data.message || "Registration successful!";
        this.feedbackType = "success";
        
        setTimeout(() => {
            this.feedbackMessage = '';
            this.feedbackType = '';
            }, 3000);
        } else {
        this.feedbackMessage = data.message || "Registration failed!";
        this.feedbackType = "error";
        setTimeout(() => {
            this.feedbackMessage = '';
            this.feedbackType = '';
            }, 3000);
        }
    } catch (err) {
        this.feedbackMessage = "Server error during registration!";
        this.feedbackType = "error";
        setTimeout(() => {
            this.feedbackMessage = '';
            this.feedbackType = '';
            }, 3000);
    }
    }

  }
};