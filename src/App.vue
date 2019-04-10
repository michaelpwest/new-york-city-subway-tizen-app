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
</style>
