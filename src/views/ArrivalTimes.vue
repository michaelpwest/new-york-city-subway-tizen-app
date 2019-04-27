<template>
	<section>
		<Routes v-if="!route && !station"></Routes>
		<Stations v-if="route"></Stations>
		<ArrivalTimes v-if="station"></ArrivalTimes>
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
