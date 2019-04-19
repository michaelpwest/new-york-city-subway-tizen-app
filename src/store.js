import Vue from "vue";
import Vuex from "vuex";

import router from "./router";

Vue.use(Vuex);

const axios = require("axios");

const config = require("@/assets/config/config.json");
const stations = require("@/assets/resources/stations.json");

export default new Vuex.Store({
	state: {
		error: null,
		selectedRoute: null,
		selectedStation: null,
		arrivalTimes: null,
	},
	mutations: {
		error(state, error) {
			state.error = error;
		},
		selectedRoute(state, route) {
			state.selectedRoute = route;
		},
		selectedStation(state, station) {
			state.selectedStation = station;
		},
		arrivalTimes(state, arrivalTimes) {
			state.arrivalTimes = arrivalTimes;
		},
	},
	actions: {
		routerLink(context, payload) {
			router.push({
				path: payload,
			});
		},
		async selectedStation(context, payload) {
			try {
				// Set station.
				context.commit("selectedStation", payload);

				// Get selected station details.
				let station = stations.filter((station) => {
					return station.station == payload;
				});
				if (!station[0]) {
					throw new Error("Cannot retrieve arrival times");
				}
				station = station[0];

				// Get arrival times.
				const response = await axios.get(`${config.apiUrl}/arrival-times/${station.stop}`);

				if (response.status != 200 || !response.data || (!response.data.directions.N.arrivalTimes && !response.data.directions.S.arrivalTimes)) {
					throw new Error("Cannot retrieve arrival times");
				}

				context.commit("arrivalTimes", response.data);
			} catch(error) {
				// Modify error message for invalid HTTP response status codes.
				if (error.response && error.response.status && error.response.status != 200) {
					error.message = "Cannot retrieve arrival times";
				}

				context.commit("arrivalTimes", null);
				context.commit("error", error);

				return false;
			}
		},
	},
});
