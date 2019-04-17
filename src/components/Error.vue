<template>
	<section>
		<div class="ui-popup">
			<div v-html="error" class="ui-popup-content"></div>
			<div class="ui-popup-footer ui-bottom-button">
				<a href="#" class="ui-btn" @click="clearError()">OK</a>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	computed: {
		error() {
			return this.$store.state.error;
		},
	},
	methods: {
		clearError() {
			this.$store.commit("error", null);
		},
	},
};
</script>

<style scoped>
.ui-popup-content {
	margin-top: 60px;
}
</style>
