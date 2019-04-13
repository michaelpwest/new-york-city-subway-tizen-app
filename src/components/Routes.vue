<template>
	<section>
		<ul v-for="(line, i) in lines" :key="i" class="ui-listview">
			<li class="ui-listview-divider">
				<div v-for="(route, j) in line.routes" :key="j" :style="{ 'background-image': `url(./images/${route}.png)` }" @click="selectRoute(route)" class="bullet"></div>
			</li>
		</ul>
	</section>
</template>

<script>
const lines = require("@/assets/resources/lines.json");
const routes = require("@/assets/resources/routes.json");

export default {
	data() {
		return {
			lines,
			routes,
		};
	},
	methods: {
		selectRoute(route) {
			this.$store.commit("route", route);
		},
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
