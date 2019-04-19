<template>
	<section>
		<Routes v-show="!route && !station"></Routes>
		<Stations v-show="route"></Stations>
		<ArrivalTimes v-show="station"></ArrivalTimes>
	</section>
</template>

<script>
import Routes from "@/components/Routes.vue";
import Stations from "@/components/Stations.vue";
import ArrivalTimes from "@/components/ArrivalTimes.vue";

export default {
	computed: {
		route: function() {
			return this.$store.state.selectedRoute;
		},
		station: function() {
			return this.$store.state.selectedStation;
		},
	},
	components: {
		Routes,
		Stations,
		ArrivalTimes,
	},
};
</script>
