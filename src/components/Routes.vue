<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Select Route</h2>
		</header>
		<section class="ui-content">
			<Search></Search>
			<ul class="ui-listview ui-snap-listview">
				<li v-for="(line, i) in lines" :key="i">
					<div v-for="(route, j) in line.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" @click="selectRoute(route)" class="bullet"></div>
				</li>
			</ul>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

import Search from "@/components/Search.vue";

const lines = require("@/assets/resources/lines.json");
const routes = require("@/assets/resources/routes.json");

export default {
	data() {
		return {
			lines,
			routes,
		};
	},
	props: [
		"route",
	],
	async mounted() {
		if (this.$route.params.route) {
			this.$store.commit("selectedStation", null);
			this.$store.commit("selectedRoute", this.$route.params.route);
		}
	},
	methods: {
		selectRoute(route) {
			this.routerLink(`/arrival-times/route/${route}`);
			this.$store.commit("selectedStation", null);
			this.$store.commit("selectedRoute", route);
		},
		...mapActions([
			"routerLink",
		]),
	},
	components: {
		Search,
	},
};
</script>

<style scoped>
.bullet {
	position: relative;
	top: 10px;
}
</style>
