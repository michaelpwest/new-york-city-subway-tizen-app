<template>
	<div id="app">
		<Error v-show="isError"></Error>
		<Navigation></Navigation>
		<router-view/>
	</div>
</template>

<script>
import { mapActions } from "vuex";

import Error from "@/components/Error.vue";
import Navigation from "@/components/Navigation.vue";

export default {
	computed: {
		isError() {
			return this.$store.state.error != null;
		},
	},
	created() {
		document.addEventListener("rotarydetent", this.handleRotary);
		document.addEventListener("tizenhwkey", this.handleBackButton);
	},
	methods: {
		handleRotary(e) {
			// Scroll page based on rotary event direction.
			const scrollStep = 100;
			const app = document.querySelector("#app");
			const popup = document.querySelectorAll(".ui-popup");
			app.scrollTop += e.detail.direction == "CW" ? scrollStep : -scrollStep;
			popup.forEach((element) => {
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

			return false;
		},
		...mapActions([
			"routerLink",
		]),
	},
	components: {
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
.ui-bottom-button.ui-popup-footer {
	bottom: 20px;
	position: fixed;
}
.ui-content {
	min-height: 185px;
}
.ui-header {
	margin-top: 60px;
}
.ui-listview li.ui-listview-divider {
	height: 50px;
}
.ui-popup {
	display: block;
	overflow: scroll;
}
.ui-popup-content {
	margin-bottom: 100px;
}
</style>
