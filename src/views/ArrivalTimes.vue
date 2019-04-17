<template>
	<section>
		<Routes v-show="!route && !station"></Routes>
		<Stations v-show="route && !station"></Stations>
		<ArrivalTimes v-show="route && station"></ArrivalTimes>
	</section>
</template>

<script>
import Routes from "@/components/Routes.vue";
import Stations from "@/components/Stations.vue";
import ArrivalTimes from "@/components/ArrivalTimes.vue";

export default {
	computed: {
		route: function() {
			return this.$store.state.route;
		},
		station: function() {
			return this.$store.state.station;
		},
	},
	components: {
		Routes,
		Stations,
		ArrivalTimes,
	},
};
</script>
