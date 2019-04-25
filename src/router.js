import Vue from "vue";
import Router from "vue-router";
import NearbyStations from "./views/NearbyStations.vue";
import ServiceStatus from "./views/ServiceStatus.vue";
import ArrivalTimes from "./views/ArrivalTimes.vue";

Vue.use(Router);

const router = new Router({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "nearby-stations",
			component: NearbyStations,
		},
		{
			path: "/service-status/:line?",
			name: "service-status",
			component: ServiceStatus,
			props: true,
		},
		{
			path: "/arrival-times",
			name: "arrival-times",
			component: ArrivalTimes,
			props: true,
		},
		{
			path: "/arrival-times/route/:route",
			name: "arrival-times-route",
			component: ArrivalTimes,
			props: true,
		},
		{
			path: "/arrival-times/station/:station",
			name: "arrival-times-station",
			component: ArrivalTimes,
			props: true,
		},
	],
});

// If a Tizen device, set home route.
if (tau.support.browser.tizen) { // eslint-disable-line
	router.replace({
		path: "/",
	});
}

export default router;
