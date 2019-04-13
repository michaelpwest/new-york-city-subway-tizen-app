<template>
	<section>
		<ul v-for="(borough, i) in boroughs" :key="i" class="ui-listview">
			<li class="ui-listview-divider">{{ borough.name }}</li>
			<li v-for="(station, j) in borough.stations" :key="j" @click="selectStation(station.station)">{{ station.name }}</li>
		</ul>
	</section>
</template>

<script>
const stations = require("@/assets/resources/stations.json");

export default {
	computed: {
		boroughs: function() {
			try {
				const route = this.$store.state.route;
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
	methods: {
		selectStation(station) {
			this.$store.commit("station", station);
		},
	},
};
</script>
