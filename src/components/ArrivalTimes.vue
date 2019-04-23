<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">{{ station.name }}</h2>
		</header>
		<section class="ui-content">
			<ul class="ui-listview">
				<li class="ui-listview-divider">
					<span v-show="arrivalTimes.timestamp" class="time">Updated: {{ arrivalTimes.timestamp | time }}</span>
					<div class="refresh" @click="refresh()">
						<i class="fas fa-redo-alt"></i>
					</div>
				</li>
			</ul>
			<ul class="ui-listview" v-for="(direction, i) in arrivalTimes.directions" :key="i">
				<li class="ui-listview-divider">{{ direction.name }}</li>
				<li v-for="(arrivalTime, j) in direction.arrivalTimes" :key="j">
					<div>{{ arrivalTime.firstLast }}</div>
					<div class="bullet-container">
						<div :style="{ 'background-image': `url(/images/${arrivalTime.route}.png)` }" class="bullet"></div>
					</div>
					<div class="arrival-time">{{ arrivalTime.arrivalTime | timeFromNow }}</div>
				</li>
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
	background-size: 48px;
	display: inline-block;
	height: 48px;
	width: 48px;
}
.bullet-container {
	display: inline-block;
	line-height: 48px;
	text-align: left;
	width: 48px;
}
.refresh {
	display: inline-block;
	margin-left: 10px;
}
.refresh, .time {
	color: #12B4FF;
}
</style>
