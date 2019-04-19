import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ServiceStatus from "./views/ServiceStatus.vue";
import ArrivalTimes from "./views/ArrivalTimes.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
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
