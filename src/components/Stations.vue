<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Select Station</h2>
		</header>
		<section class="ui-content">
			<Search></Search>
			<ul class="ui-listview ui-snap-listview">
				<template v-for="(station, i) in stations">
					<li :key="`${i}-${station.borough}`" v-if="station.borough" class="ui-listview-divider">{{ station.borough }}</li>
					<li :key="i" @click="selectStation(station.station)">
						<div class="ui-marquee">{{ station.name }}</div>
					</li>
				</template>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

import Search from "@/components/Search.vue";

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

				// Add prefix to borough to allow boroughs to be sorted correctly.
				routeStations.forEach((station) => {
					switch (station.borough) {
					case "Bx":
						station.borough = "1-Bx";
						break;
					case "M":
						station.borough = "2-M";
						break;
					case "Bk":
						station.borough = "3-Bk";
						break;
					case "Q":
						station.borough = "4-Q";
						break;
					case "SI":
						station.borough = "5-SI";
						break;
					default:
						break;
					}
				});

				// Sort stations by borough.
				routeStations = _.sortBy(routeStations, "borough");

				// Add borough name once for first station in each borough.
				const boroughsUsed = [];
				routeStations.forEach((station) => {
					if (!boroughsUsed.includes(station.borough)) {
						boroughsUsed.push(station.borough);
						switch (station.borough) {
						case "1-Bx":
							station.borough = "Bronx";
							break;
						case "2-M":
							station.borough = "Manhattan";
							break;
						case "3-Bk":
							station.borough = "Brooklyn";
							break;
						case "4-Q":
							station.borough = "Queens";
							break;
						case "5-SI":
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
	components: {
		Search,
	},
};
</script>
