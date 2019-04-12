<template>
	<div id="app">
		<Error v-show="isError"></Error>
		<Navigation></Navigation>
		<router-view/>
	</div>
</template>

<script>
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
.ui-popup {
	display: block;
	overflow: scroll;
}
.ui-popup-content {
	margin-bottom: 100px;
}
</style>
