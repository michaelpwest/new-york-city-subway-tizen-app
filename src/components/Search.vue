<template>
	<section>
		<div v-bind:class="{ 'search-container': searching || searchResults }">
			<input v-model.trim="searchTerm" @focus="searchingToggle(true)" @blur="searchingToggle(false)" @keyup="search" type="search" placeholder="Search" class="search" />
			<div v-if="searchResults" class="search-results">
				<header class="ui-header">
					<h2 class="ui-title">Search Results</h2>
				</header>
				<ul class="ui-listview ui-snap-listview">
					<li v-for="(station, i) in searchResults" :key="i" @click="selectStation(station.station)">
						<div v-for="(route, j) in station.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" class="bullet"></div>
						<div>{{ station.name }}</div>
					</li>
				</ul>
			</div>
			<div v-if="searching && noResults">{{ noResults }}</div>
		</div>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const fuzzySearch = require("fuzzy-search");

const stations = require("@/assets/resources/stations.json");

export default {
	data() {
		return {
			searchTerm: "",
			searching: false,
			searchResults: null,
			noResults: null,
		};
	},
	created() {
		document.addEventListener("tizenhwkey", this.handleBackButton);
	},
	methods: {
		searchingToggle(inProgress) {
			this.searching = inProgress;
			this.search();
		},
		search() {
			this.searchResults = null;
			this.noResults = "Enter a search term.";

			if (!this.searchTerm.length) {
				return false;
			}

			// Find stations based on search term.
			const searcher = new fuzzySearch(stations, [
				"name",
			], {
				sort: true,
			});
			const searchResults = searcher.search(this.searchTerm);

			if (searchResults.length) {
				this.searchResults = searchResults;
				this.noResults = null;
				this.$parent.$parent.$parent.setupSnapList();
			} else {
				this.searchResults = null;
				this.noResults = "No stations found.";
			}
		},
		selectStation(station) {
			this.routerLink(`/arrival-times/station/${station}`);
			this.$store.commit("selectedRoute", null);
			this.selectedStation(station);
		},
		handleBackButton() {
			this.searchTerm = "";
			this.searchingToggle(false);
			document.querySelector(".search").blur();
		},
		...mapActions([
			"routerLink",
			"selectedStation",
		]),
	},
};
</script>

<style scoped>
.search {
	background: transparent;
	border: 0;
	color: #C7C7C7;
	margin-bottom: 20px;
	text-align: center;
	width: 75%;
}
.search-container {
	background: #000000;
	height: 100%;
	left: 0;
	overflow: scroll;
	padding-bottom: 185px;
	padding-top: 20px;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1000;
}
.search-results .ui-header {
	margin-top: 0;
}
.search-results .ui-title {
	padding-top: 31px;
}
</style>
