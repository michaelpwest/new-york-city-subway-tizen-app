<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Select Station</h2>
		</header>
		<section class="ui-content">
			<ul class="ui-listview">
				<template v-for="(station, i) in stations">
					<li :key="`${i}-${station.borough}`" v-if="station.borough" class="ui-listview-divider">{{ station.borough }}</li>
					<li :key="i" @click="selectStation(station.station)">
						<span>{{ station.name }}</span>
					</li>
				</template>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const _ = require("lodash");

const stations = require("@/assets/resources/stations.json");

export default {
	props: [
		"station",
	],
	computed: {
		stations: function() {
			try {
				const route = this.$store.state.selectedRoute;
				if (!route) {
					return {};
				}

				// Get stations for route.
				let routeStations = stations.filter((station) => {
					return station.routes.includes(route);
				});

				// Sort stations by borough.
				routeStations = _.sortBy(routeStations, "borough");

				// Add borough name once for first station in each borough.
				const boroughsUsed = [];
				routeStations.forEach((station) => {
					if (!boroughsUsed.includes(station.borough)) {
						boroughsUsed.push(station.borough);
						switch (station.borough) {
						case "Bx":
							station.borough = "Bronx";
							break;
						case "M":
							station.borough = "Manhattan";
							break;
						case "Bk":
							station.borough = "Brooklyn";
							break;
						case "Q":
							station.borough = "Queens";
							break;
						case "SI":
							station.borough = "Staten Island";
							break;
						default:
							break;
						}
					} else {
						station.borough = null;
					}
				});

				return routeStations;
			} catch(error) {
				this.$store.commit("error", error);
				return {};
			}
		},
	},
	async mounted() {
		if (this.$route.params.station) {
			this.$store.commit("selectedRoute", null);
			this.selectedStation(this.$route.params.station);
		}
	},
	methods: {
		selectStation(station) {
			this.routerLink(`/arrival-times/station/${station}`);
			this.$store.commit("selectedRoute", null);
			this.selectedStation(station);
		},
		...mapActions([
			"routerLink",
			"selectedStation",
		]),
	},
};
</script>
