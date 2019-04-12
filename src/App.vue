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
.ui-popup {
	display: block;
	overflow: scroll;
}
.ui-popup-content {
	margin-bottom: 100px;
}
</style>
