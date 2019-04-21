<template>
	<div class='container'>
    <div class='row'>
      <div class='col'>
        <h1>Dashboard</h1>
            <AddWeek />
      </div>
    </div>
    <div class='row'>
      <div class='col'>
        <button @click="logout">Log me out</button>
      </div>
    </div>

	</div>
</template>

<script>
import { mapActions } from 'vuex'
// @ is an alias to /src
import AddWeek from '@/components/AddWeek.vue'

export default {
	name: "Dashboard",
	components: {
    AddWeek
  },
	data(){
		return {};
	},
	methods: {
    ...mapActions("auth", ["attemptLogout"]),
    logout() {
      this.attemptLogout()
        .then(() => {
          this.$router.push(this.$route.query.redirect || "/login");
          console.log('You have successfully logged out')
        })
        .catch(err => console.log(err, "womp womp. Something went wrong."))
    }
  }
}
</script>