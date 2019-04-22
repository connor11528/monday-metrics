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


export default {
  name: 'Home',
  mounted(){
  	let token = decodeURIComponent(window.location.search)
        .substring(1)
        .split("confirmation_token=")[1];

    console.log(token);

  },
  data(){
  	return {}
  }

}
</script>
