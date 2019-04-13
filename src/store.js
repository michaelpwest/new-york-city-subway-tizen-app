import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		error: null,
		route: null,
		station: null,
	},
	mutations: {
		error(state, error) {
			state.error = error;
		},
		route(state, route) {
			state.route = route;
		},
		station(state, station) {
			state.station = station;
		},
	},
	actions: {

	},
});
