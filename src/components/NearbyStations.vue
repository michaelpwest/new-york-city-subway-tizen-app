<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Nearby Stations</h2>
		</header>
		<section class="ui-content">
			<ul v-for="(station, i) in stations" :key="i" class="ui-listview">
				<li class="ui-listview-divider">
					<div v-for="(route, j) in station.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" class="bullet"></div>
				</li>
				<li @click="selectStation(station.station)">{{ station.name }}</li>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const geolib = require("geolib");

const stations = require("@/assets/resources/stations.json");

export default {
	data() {
		return {
			stations: [],
		};
	},
	created() {
		try {
			// Get geolocation.
			if (navigator.geolocation) {
				const navigatorOptions = {
					maximumAge: 60000,
					timeout: 10000,
				};
				navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, navigatorOptions);
			} else {
				this.locationError();
			}
		} catch(error) {
			this.locationError();
		}
	},
	methods: {
		locationSuccess(position) {
			try {
				this.stations = [];

				// Get coordinates.
				const coords = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};

				// Get nearby stations.
				const nearestResults = geolib.findNearest(coords, stations, 0, 10);
				nearestResults.forEach((nearestResult) => {
					if (nearestResult.key && stations[nearestResult.key]) {
						this.stations.push(stations[nearestResult.key]);
					}
				});
			} catch(error) {
				this.locationError();
			}
		},
		locationError() {
			this.$store.commit("error", "Geolocation is not available.");
		},
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

<style scoped>
.bullet {
	background-size: 32px;
	display: inline-block;
	height: 32px;
	margin-left: 5px;
	margin-right: 5px;
	width: 32px;
}
</style>
