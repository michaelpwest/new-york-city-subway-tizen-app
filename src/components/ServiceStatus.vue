<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Service Status</h2>
		</header>
		<section class="ui-content">
			<ul v-for="(lineStatus, i) in status" :key="i" @click="setDetail(lineStatus.detail)" class="ui-listview">
				<li class="ui-listview-divider">
					<div v-for="(route, j) in lineStatus.routes" :key="j" :style="{ 'background-image': `url(./images/${route}.png)` }" class="bullet"></div>
				</li>
				<li :style="`color: ${lineStatus.color}`">{{ lineStatus.status }}</li>
			</ul>
			<div v-show="noResults">{{ noResults }}</div>
			<div v-show="detail" class="detail ui-popup">
				<div v-html="detail" class="ui-popup-content"></div>
				<div class="ui-bottom-button ui-popup-footer">
					<a href="#" class="ui-btn" @click="unsetDetail()">OK</a>
				</div>
			</div>
		</section>
	</section>
</template>

<script>
const axios = require("axios");
const sanitizeHtml = require("sanitize-html");

const config = require("@/assets/config/config.json");

export default {
	data() {
		return {
			status: [],
			noResults: null,
			detail: null,
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

			response.data = response.data.filter(line => {
				return line.status != "GOOD SERVICE";
			});

			if (!response.data.length) {
				this.noResults = "All lines are running with GOOD SERVICE.";
			}

			response.data.forEach((line) => {
				const name = line.name;
				const status = line.status;
				let detail = line.text;

				// Get individual routes for line.
				const routes = name == "SIR" ? ["SIR"] : name.split("");

				// Set color based on service status.
				let color;
				switch(status) {
				case "DELAYS":
					color = "#990033";
					break;
				default:
					color = "#996600";
					break;
				}

				if (detail) {
					// Sanitize detail HTML.
					detail = sanitizeHtml(detail, {
						allowedTags: [
							"b",
							"br",
							"div",
							"i",
							"span",
							"table",
							"tbody",
							"td",
							"tfoot",
							"th",
							"thead",
							"tr",
						],
						allowedAttributes: {
							"*": [
								"class",
							],
							"table": [
								"border",
								"cellpadding",
								"cellspacing",
								"frame",
								"rules",
							],
						},
					});

					// Replace [A], [B], etc. in detail with route bullets.
					detail = detail.replace(/\[(.{1})\]/g, "<div style='background-image: url(./images/$1.png)' class='bullet'></div>");
				}

				this.status.push({
					status,
					routes,
					color,
					detail,
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
	methods: {
		setDetail(detail) {
			this.detail = detail;
		},
		unsetDetail() {
			this.detail = null;
		},
	},
};
</script>

<style scoped>
.bullet, .detail >>> .bullet {
	background-size: 32px;
	display: inline-block;
	height: 32px;
	margin-left: 5px;
	margin-right: 5px;
	width: 32px;
}
.detail >>> .TitlePlannedWork, .detail >>> .TitleDelay {
	color: #0000FF;
	font-weight: bold;
}
</style>
