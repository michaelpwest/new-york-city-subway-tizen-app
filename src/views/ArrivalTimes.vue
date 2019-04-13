<template>
	<div>
		<header class="ui-header">
			<h2 class="ui-title">Arrival Times</h2>
		</header>
		<section class="ui-content">
			<Routes v-show="!route"></Routes>
			<Stations v-show="route"></Stations>
		</section>
	</div>
</template>

<script>
import Routes from "@/components/Routes.vue";
import Stations from "@/components/Stations.vue";

export default {
	computed: {
		route: function() {
			return this.$store.state.route;
		},
	},
	components: {
		Routes,
		Stations,
	},
};
</script>
