import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ServiceStatus from "./views/ServiceStatus.vue";
import ArrivalTimes from "./views/ArrivalTimes.vue";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			name: "home",
			component: Home,
		},
		{
			path: "/service-status",
			name: "service-status",
			component: ServiceStatus,
		},
		{
			path: "/arrival-times",
			name: "arrival-times",
			component: ArrivalTimes,
		},
	],
});
