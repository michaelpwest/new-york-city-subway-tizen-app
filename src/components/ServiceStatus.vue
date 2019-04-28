<template>
	<section>
		<header class="ui-header">
			<h2 class="ui-title">Service Status</h2>
		</header>
		<section class="ui-content">
			<span v-if="timestamp" class="time">Updated: {{ timestamp | time }}</span>
			<div class="refresh" @click="refresh()">
				<i class="fas fa-redo-alt"></i>
			</div>
			<ul class="ui-listview ui-snap-listview">
				<li v-for="(lineStatus, i) in status" :key="i" @click="setLineDetail(lineStatus.name)">
					<div v-for="(route, j) in lineStatus.routes" :key="j" :style="{ 'background-image': `url(/images/${route}.png)` }" class="bullet"></div>
					<div :style="`color: ${lineStatus.color}`" class="status">{{ lineStatus.status }}</div>
				</li>
			</ul>
			<div v-if="noResults" v-html="noResults" class="no-results"></div>
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
				this.$store.commit("loading", true);

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

				serviceStatus.forEach((line) => {
					line.status = line.status.toLowerCase();
				});

				serviceStatus = serviceStatus.filter(line => {
					return line.status != "good service";
				});

				if (!serviceStatus.length) {
					this.noResults = "<span class='good-service'>All lines are running with Good Service.</span>";
					this.$store.commit("loading", false);
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
					case "delays":
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

				this.$store.commit("loading", false);
			} catch(error) {
				// Modify error message for invalid HTTP response status codes.
				if (error.response && error.response.status && error.response.status != 200) {
					error.message = "Cannot retrieve service status";
				}

				this.status = [];
				this.$store.commit("error", error);

				this.$store.commit("loading", false);

				return false;
			}
		},
		async setLineDetail(line) {
			try {
				this.$store.commit("loading", true);

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

				this.$store.commit("loading", false);
			} catch(error) {
				// Modify error message for invalid HTTP response status codes.
				if (error.response && error.response.status && error.response.status != 200) {
					error.message = "Cannot retrieve service status";
				}

				this.status = [];
				this.$store.commit("error", error);

				this.$store.commit("loading", false);

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
	background-size: 48px;
	display: inline-block;
	height: 48px;
	margin-left: 5px;
	margin-right: 5px;
	width: 48px;
}
.detail >>> .bullet {
	background-size: 32px;
	height: 32px;
	width: 32px;
}
.detail >>> .TitlePlannedWork, .detail >>> .TitleDelay {
	color: #0000FF;
	font-weight: bold;
}
.no-results >>> .good-service {
	color: #006600;
}
.refresh {
	display: inline-block;
	margin-left: 10px;
}
.refresh, .time {
	font-size: 0.8em;
	color: #12B4FF;
}
.status {
	text-transform: capitalize;
}
</style>
