<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Select Station</h2>
		</header>
		<section class="ui-content">
			<ul v-for="(borough, i) in boroughs" :key="i" class="ui-listview">
				<li class="ui-listview-divider">{{ borough.name }}</li>
				<li v-for="(station, j) in borough.stations" :key="j" @click="selectStation(station.station)">{{ station.name }}</li>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const stations = require("@/assets/resources/stations.json");

export default {
	props: [
		"station",
	],
	computed: {
		boroughs: function() {
			try {
				const route = this.$store.state.selectedRoute;
				if (!route) {
					return {};
				}

				const boroughs = {};

				// Get stations for route.
				const routeStations = stations.filter((station) => {
					return station.routes.includes(route);
				});

				// Sort stations by borough.
				routeStations.forEach((station) => {
					if (!boroughs[station.borough]) {
						let name = "";
						switch (station.borough) {
						case "Bx":
							name = "Bronx";
							break;
						case "M":
							name = "Manhattan";
							break;
						case "Bk":
							name = "Brooklyn";
							break;
						case "Q":
							name = "Queens";
							break;
						case "SI":
							name = "Staten Island";
							break;
						default:
							break;
						}
						boroughs[station.borough] = {
							name,
							stations: [],
						};
					}
					boroughs[station.borough].stations.push(station);
				});

				return boroughs;
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
