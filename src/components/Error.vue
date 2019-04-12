<template>
	<div class="ui-popup">
		<div class="ui-popup-content">{{ error }}</div>
		<div class="ui-popup-footer ui-bottom-button">
			<a href="#" class="ui-btn" @click="clearError()">OK</a>
		</div>
	</div>
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
