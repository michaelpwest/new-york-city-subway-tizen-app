<template>
	<div id="app">
		<Navigation></Navigation>
		<router-view/>
	</div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";

export default {
	components: {
		Navigation,
	},
};
</script>

<style>
#app {
	text-align: center;
}
</style>
