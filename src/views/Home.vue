<template>
  <div class='container'>
  	<div class='row'>
	  	<div class='col'>
	  		<h1>Welcome to Monday Metrics</h1>
	  	</div>

  	</div>
    
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  mounted(){

    if (window.location.hash && window.location.hash.indexOf('#confirmation_token=') === 0) {
	    const token = window.location.hash.replace('#confirmation_token=', '');

	    console.log('Got the token: ', token);

	    this.attemptConfirmation(token)
			  .then(user => {
			  	console.log('User confirmed! ', user);
			  	window.location.href = '/';
			  },error => {
			  	console.error("Failed to log in: %o", error)
			  });
	}

  },
  data(){
  	return {}
  },
  methods:{
  	...mapActions(["attemptConfirmation"]),

  }

}
</script>
