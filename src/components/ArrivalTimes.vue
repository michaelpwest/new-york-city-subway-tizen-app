<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title ui-marquee always">{{ station.name }}</h2>
		</header>
		<section class="ui-content">
			<span v-if="arrivalTimes.timestamp" class="time">Updated: {{ arrivalTimes.timestamp | time }}</span>
			<div class="refresh" @click="refresh()">
				<i class="fas fa-redo-alt"></i>
			</div>
			<ul class="ui-listview ui-snap-listview">
				<template v-for="(arrivalTime, i) in arrivalTimes.arrivalTimes">
					<li :key="`${i}-${arrivalTime.direction}`" v-if="arrivalTime.direction" class="ui-listview-divider">{{ arrivalTime.direction }}</li>
					<li :key="i">
						<div class="ui-marquee">{{ arrivalTime.firstLast }}</div>
						<div class="bullet-container">
							<div :style="{ 'background-image': `url(/images/${arrivalTime.route}.png)` }" class="bullet"></div>
						</div>
						<div class="arrival-time">{{ arrivalTime.arrivalTime | timeFromNow }}</div>
					</li>
				</template>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const moment = require("moment");

const stations = require("@/assets/resources/stations.json");

export default {
	computed: {
		station: function() {
			try {
				// Get selected station.
				const selectedStation = this.$store.state.selectedStation;
				if (!selectedStation) {
					this.$store.commit("arrivalTimes", null);
					return {};
				}

				// Get selected station details.
				let station = stations.filter((station) => {
					return station.station == selectedStation;
				});
				if (!station[0]) {
					this.$store.commit("arrivalTimes", null);
					return {};
				}
				station = station[0];

				return station;
			} catch(error) {
				this.$store.commit("error", error);
				return {};
			}
		},
		arrivalTimes: function() {
			try {
				const arrivalTimes = this.$store.state.arrivalTimes;
				if (!arrivalTimes) {
					return {};
				}

				return arrivalTimes;
			} catch(error) {
				this.$store.commit("error", error);
				return {};
			}
		},
	},
	methods: {
		refresh: function() {
			// Clear arrival times and refresh.
			this.$store.commit("arrivalTimes", null);
			this.selectedStation(this.station.station);
		},
		...mapActions([
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
		timeFromNow: (timestamp) => {
			let timeFromNow = Math.max(Math.ceil((timestamp - moment().unix()) / 60), 0);
			if (timeFromNow == 1) {
				timeFromNow += " Minute";
			} else {
				timeFromNow += " Minutes";
			}
			return timeFromNow;
		},
	},
};
</script>

<style scoped>
.arrival-time {
	display: inline-block;
	width: calc(100% - 48px);
}
.bullet {
	margin-left: 0;
	margin-right: 0;
}
.bullet-container {
	display: inline-block;
	line-height: 48px;
	text-align: left;
	width: 48px;
}
</style>
