<template>
<div class='container'>

	<template v-if="notifications.length > 0">
    <transition-group name="notification-list" tag="div" class="notifications" appear>
      <notification
        appear
        v-for="(notification, idx) in notifications"
        :key="idx"
        :notification="notification"
      ></notification>
    </transition-group>
  </template>

  <h1>Login</h1>
	<form @submit.prevent="login()">
	  <label>
	    Email:
	    <input type="text" v-model="loginCreds.email">
	  </label>
	  <label>
	    Password:
	    <input type="password" v-model="loginCreds.password">
	  </label>
	  <button type="submit">Login</button>
	</form>

	<h1>Signup</h1>
	<form @submit.prevent="signup()">
	  <label>
	    Email:
	    <input type="text" v-model="signupCreds.email">
	  </label>
	  <label>
	    Password:
	    <input type="password" v-model="signupCreds.password">
	  </label>
	  <button type="submit">Sign Me Up!</button>
	</form>

</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Notification from '../components/Notification.vue'

export default {
	name: "Login",
	components: {
		Notification
	},
	data(){
		return {
			loginCreds: {
				email: null,
				password: null
			},
			signupCreds: {
				email: null,
				password: null
			}
		};
	},
	computed: {
    ...mapState(["notifications", "currentUser"])
  },
	methods: {
		...mapActions(["attemptLogin", "attemptSignup", "addNotification"]),
		signup(){
			this.attemptSignup(this.signupCreds) 
	  		.then(() => {

	  			this.addNotification({
		        title: "Signup Success",
		        text: "A confirmation email has been sent to you!",
		        type: "success"
		      });

	  			this.signupCreds = {
						email: null,
						password: null
					};
	  		})
	  		.catch(err => {
	  			this.addNotification({
		        title: "Signup Error",
		        text: err.error_description,
		        type: "fail"
		      });
		      
	  			console.error(err);
	  		});

		},
		login(){

			let token = decodeURIComponent(window.location.search)
        .substring(1)
        .split("confirmation_token=")[1];

      console.log('your token is ', token);

			this.attemptLogin({ token, ...this.loginCreds })
	      .then(() => {
	        this.$router.push(this.$route.query.redirect || "/");

	        console.log('You have successfully logged in');
	      })
	      .catch(err => {
	      	this.addNotification({
		        title: "Login Error",
		        text: err.error_description,
		        type: "fail"
		      });

	  			console.error(err);
	      })
		}
	}
}
</script>