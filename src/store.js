import Vue from "vue";
import Vuex from "vuex";

import router from "./router";

Vue.use(Vuex);

const axios = require("axios");

const config = require("@/assets/config/config.json");
const stations = require("@/assets/resources/stations.json");

export default new Vuex.Store({
	state: {
		loading: false,
		error: null,
		selectedRoute: null,
		selectedStation: null,
		arrivalTimes: null,
	},
	mutations: {
		loading(state, loading) {
			state.loading = loading;
		},
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
			context.commit("loading", false);

			router.push({
				path: payload,
			});
		},
		async selectedStation(context, payload) {
			try {
				context.commit("loading", true);

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

				const arrivalTimes = {
					timestamp: response.data.timestamp,
					arrivalTimes: [],
				};

				// Merge directions into single array and add direction name once for first arrival time.
				const directionsUsed = [];
				["N", "S"].forEach((direction) => {
					const currentDirection = response.data.directions[direction];
					currentDirection.arrivalTimes.forEach((arrivalTime) => {
						if (!directionsUsed.includes(currentDirection.name)) {
							directionsUsed.push(currentDirection.name);
							arrivalTime.direction = currentDirection.name;
						} else {
							arrivalTime.direction = null;
						}
						arrivalTimes.arrivalTimes.push(arrivalTime);
					});
				});

				context.commit("arrivalTimes", arrivalTimes);

				context.commit("loading", false);
			} catch(error) {
				// Modify error message for invalid HTTP response status codes.
				if (error.response && error.response.status && error.response.status != 200) {
					error.message = "Cannot retrieve arrival times";
				}

				context.commit("arrivalTimes", null);
				context.commit("error", error);

				context.commit("loading", false);

				return false;
			}
		},
	},
});
