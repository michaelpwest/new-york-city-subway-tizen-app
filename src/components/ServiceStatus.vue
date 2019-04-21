<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Service Status</h2>
		</header>
		<section class="ui-content">
			<ul class="ui-listview">
				<li class="ui-listview-divider">
					Updated: {{ timestamp | time }}
					<div class="refresh" @click="refresh()">
						<i class="fas fa-redo-alt"></i>
					</div>
				</li>
			</ul>
			<ul v-for="(lineStatus, i) in status" :key="i" @click="setLineDetail(lineStatus.name)" class="ui-listview">
				<li class="ui-listview-divider">
					<div v-for="(route, j) in lineStatus.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" class="bullet"></div>
				</li>
				<li :style="`color: ${lineStatus.color}`">{{ lineStatus.status }}</li>
			</ul>
			<div v-if="noResults">{{ noResults }}</div>
			<div v-if="detail" class="detail ui-popup">
				<div v-html="detail" class="ui-popup-content"></div>
				<div class="ui-bottom-button ui-popup-footer">
					<a href="#" class="ui-btn" @click="unsetLineDetail()">OK</a>
				</div>
			</div>
		</section>
	</section>
</template>

<script>
import { mapActions } from "vuex";

const moment = require("moment");

const axios = require("axios");
const sanitizeHtml = require("sanitize-html");

const config = require("@/assets/config/config.json");

export default {
	data() {
		return {
			timestamp: null,
			status: [],
			noResults: null,
			detail: null,
		};
	},
	props: [
		"id",
	],
	async mounted() {
		await this.getServiceStatus();
	},
	methods: {
		async getServiceStatus() {
			try {
				this.timestamp = null;
				this.status = [];
				this.noResults = null;
				this.detail = null;

				// Get service status.
				const response = await axios.get(`${config.apiUrl}/service-status`);

				if (response.status != 200 || !response.data || !response.data.serviceStatus) {
					throw new Error("Cannot retrieve service status");
				}

				let serviceStatus = response.data.serviceStatus;

				serviceStatus = serviceStatus.filter(line => {
					return line.status != "GOOD SERVICE";
				});

				if (!serviceStatus.length) {
					this.noResults = "All lines are running with GOOD SERVICE.";
					return true;
				}

				serviceStatus.forEach((line) => {
					const name = line.name;
					const status = line.status;

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

					this.status.push({
						name,
						status,
						routes,
						color,
					});
				});

				// Set timestamp.
				this.timestamp = response.data.timestamp;

				// Get service status detail for line.
				if (this.$route.params.line) {
					this.setLineDetail(this.$route.params.line);
				}
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
		async setLineDetail(line) {
			try {
				this.routerLink(`/service-status/${line}`);

				this.detail = null;

				// Get service status detail for line.
				const response = await axios.get(`${config.apiUrl}/service-status/${line}`);

				if (response.status != 200 || !response.data || !response.data.serviceStatus.text) {
					throw new Error(`Cannot retrieve service status detail for line ${line}`);
				}

				let detail = response.data.serviceStatus.text;

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
				detail = detail.replace(/\[(.{1})\]/g, "<div style='background-image: url(/images/$1.png)' class='bullet'></div>");

				this.detail = detail;
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
		unsetLineDetail() {
			this.routerLink("/service-status");
			this.detail = null;
		},
		refresh: function() {
			// Refresh service status.
			this.getServiceStatus();
		},
		...mapActions([
			"routerLink",
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
.refresh {
	color: #12B4FF;
	display: inline-block;
	margin-left: 10px;
}
</style>
