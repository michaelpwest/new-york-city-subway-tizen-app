<template>
	<section>
		<ul v-for="(lineStatus, i) in status" :key="i" class="ui-listview">
			<li class="ui-listview-divider">
				<div v-for="(route, j) in lineStatus.routes" :key="j" :style="{ 'background-image': `url(./images/${route}.png)` }" class="bullet"></div>
			</li>
			<li :style="`color: ${lineStatus.color}`">{{ lineStatus.status }}</li>
		</ul>
	</section>
</template>

<script>
const axios = require("axios");

const config = require("@/assets/config/config.json");

export default {
	data() {
		return {
			status: [],
		};
	},
	async mounted() {
		try {
			// Get service status.
			const response = await axios.get(`${config.apiUrl}/service-status`);

			this.status = [];

			if (response.status != 200 || !response.data) {
				throw new Error("Cannot retrieve service status");
			}

			response.data.forEach((line) => {
				const name = line.name;
				const status = line.status;

				// Get individual routes for line.
				const routes = name == "SIR" ? ["SIR"] : name.split("");

				// Set color based on service status.
				let color;
				switch(status) {
				case "GOOD SERVICE":
					color = "#006600";
					break;
				case "DELAYS":
					color = "#990033";
					break;
				default:
					color = "#996600";
					break;
				}
				this.status.push({
					status,
					routes,
					color,
				});
			});
		} catch(error) {
			// Modify error message for invalid HTTP response status codes.
			if (error.response && error.response.status && error.response.status != 200) {
				error.message = "Cannot retrieve service status";
			}

			this.status = [];
			this.$store.commit("error", error);

			return false;
		}
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
