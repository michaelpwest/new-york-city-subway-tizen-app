<template>
	<div id="app">
		<Loading :active="isLoading" loader="dots"></loading>
		<Error v-if="isError"></Error>
		<Navigation></Navigation>
		<router-view/>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import Error from "@/components/Error.vue";
import Navigation from "@/components/Navigation.vue";

const _ = require("lodash");

export default {
	data() {
		return {
			snapList: null,
			snapListSelectedIndex: -1,
			snapListMarquee: null,
		};
	},
	computed: {
		isError() {
			return this.$store.state.error != null;
		},
		isLoading() {
			return this.$store.state.loading;
		},
	},
	created() {
		document.addEventListener("rotarydetent", this.handleRotary);
		document.addEventListener("tizenhwkey", this.handleBackButton);
	},
	mounted() {
		// Setup snap list.
		this.setupSnapList();

		// Setup marquee elements set to always run.
		this.setupMarquee();
	},
	updated() {
		// Scroll to the top of the page.
		document.querySelector("#app").scrollTop = 0;

		// Setup snap list.
		this.setupSnapList();

		// Setup marquee elements set to always run.
		this.setupMarquee();
	},
	methods: {
		setupSnapList() {
			setTimeout(() => {
				// Setup snap lists.
				this.snapList = document.querySelector(".ui-snap-listview");
				this.snapListSelectedIndex = -1;
				if (this.snapList) {
					this.snapList.querySelectorAll("li:not(.ui-listview-divider)").forEach((element) => {
						element.classList.add("ui-snap-listview-item");
					});
				}
			}, 0);
		},
		setupMarquee() {
			// Add marquee to elements set to always run.
			const app = document.querySelector("#app");
			const marquee = app.querySelector(".ui-marquee.always");
			if (marquee) {
				const elementMarquee = new tau.widget.Marquee(marquee, { // eslint-disable-line
					delay: 1000,
					iteration: "infinite",
					marqueeStyle: "endToEnd",
				});
				elementMarquee.start();
			}
		},
		handleRotary(e) {
			// Scroll snap lists based on rotary event direction.
			if (this.snapList) {
				const app = document.querySelector("#app");
				const appHeight = app.clientHeight;
				const nav = document.querySelector("#nav .ui-header");
				const navHeight = nav.clientHeight - 25;

				const listItems = this.snapList.querySelectorAll("li:not(.ui-listview-divider)");

				// Determine snap list selected index based on rotary event direction.
				this.snapListSelectedIndex += e.detail.direction == "CW" ? 1 : -1;
				this.snapListSelectedIndex = _.clamp(this.snapListSelectedIndex, 0, listItems.length - 1);

				listItems.forEach((element, index) => {
					element.classList.remove("ui-snap-listview-selected");
					if (index == this.snapListSelectedIndex) {
						// Mark element as selected.
						element.classList.add("ui-snap-listview-selected");

						// Scroll element into view.
						app.scrollTop = element.getBoundingClientRect().top + app.scrollTop;

						// Scroll up so element is vertically centered.
						app.scrollTop -= (appHeight + navHeight - element.clientHeight) / 2;

						// Remove marquee from last element.
						if (this.snapListMarquee) {
							this.snapListMarquee.reset();
						}

						// Add marquee to element.
						const marquee = element.querySelector(".ui-marquee");
						if (marquee) {
							this.snapListMarquee = new tau.widget.Marquee(marquee, { // eslint-disable-line
								delay: 1000,
								iteration: "infinite",
								marqueeStyle: "endToEnd",
							});
							this.snapListMarquee.start();
						}
					}
				});
			}

			// Scroll popup based on rotary event direction.
			const scrollStep = 100;
			document.querySelectorAll(".ui-popup").forEach((element) => {
				element.scrollTop += e.detail.direction == "CW" ? scrollStep : -scrollStep;
			});
		},
		handleBackButton() {
			// Close any open popups.
			const popupButtons = document.querySelectorAll(".ui-btn");
			if (popupButtons.length) {
				popupButtons.forEach((element) => {
					element.click();
				});
				return true;
			}

			// If no popup is open, go to home route of selected navigation link.
			const path = this.$route.path;
			if (path) {
				if (path.substr(0, 15) == "/service-status") {
					this.routerLink("/service-status");
				} else if (path.substr(0, 14) == "/arrival-times") {
					this.routerLink("/arrival-times");
					this.$store.commit("selectedRoute", null);
					this.$store.commit("selectedStation", null);
				} else if (path.substr(0, 1) == "/") {
					this.routerLink("/");
				}
				return true;
			}

			// Setup snap list.
			this.setupSnapList();

			// Setup marquee elements set to always run.
			this.setupMarquee();

			return false;
		},
		...mapActions([
			"routerLink",
		]),
	},
	components: {
		Loading,
		Error,
		Navigation,
	},
};
</script>

<style>
#app {
	overflow: scroll;
	text-align: center;
}
.bullet {
	background-size: 48px;
	display: inline-block;
	height: 48px;
	margin-left: 5px;
	margin-right: 5px;
	width: 48px;
}
.refresh {
	display: inline-block;
	margin-left: 10px;
}
.refresh, .time {
	font-size: 0.8em;
	color: #FFFFFF;
}
.ui-bottom-button.ui-popup-footer {
	bottom: 20px;
	position: fixed;
}
.ui-content {
	min-height: 185px;
	margin-bottom: 185px;
}
.ui-header {
	margin-top: 60px;
}
.ui-listview li {
	overflow: visible;
}
.ui-popup {
	display: block;
	overflow: scroll;
}
.ui-popup-content {
	margin-bottom: 100px;
}
</style>
