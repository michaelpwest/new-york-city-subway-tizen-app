<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Nearby Stations</h2>
		</header>
		<section class="ui-content">
			<span v-if="timestamp" class="time">Updated: {{ timestamp | time }}</span>
			<div class="refresh" @click="refresh()">
				<i class="fas fa-redo-alt"></i>
			</div>
			<div class='error'>{{ error }}</div>
			<ul class="ui-listview ui-snap-listview">
				<li v-for="(station, i) in stations" :key="i" @click="selectStation(station.station)">
					<div v-for="(route, j) in station.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" class="bullet"></div>
					<div class="ui-marquee">{{ station.name }}</div>
				</li>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const geolib = require("geolib");
const moment = require("moment");

const stations = require("@/assets/resources/stations.json");

export default {
	data() {
		return {
			error: null,
			stations: [],
			timestamp: null,
		};
	},
	created() {
		this.getLocation();
	},
	methods: {
		getLocation() {
			try {
				this.$store.commit("loading", true);

				this.error = null;
				this.stations = [];

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
		locationSuccess(position) {
			try {
				this.timestamp = moment().unix();

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

				this.$store.commit("loading", false);
			} catch(error) {
				this.locationError();
			}
		},
		locationError() {
			this.error = "Geolocation is not available.";

			this.$store.commit("loading", false);
		},
		selectStation(station) {
			this.routerLink(`/arrival-times/station/${station}`);
			this.$store.commit("selectedRoute", null);
			this.selectedStation(station);
		},
		refresh() {
			// Refresh nearby stations.
			this.getLocation();
		},
		...mapActions([
			"routerLink",
			"selectedStation",
		]),
	},
	filters: {
		time: (timestamp) => {
			if (!timestamp) {
				return "";
			}
			return moment.unix(timestamp).format("h:mm:ss a");
		},
	},
};
</script>

<style scoped>
.error {
	margin-top: 10px;
}
</style>
