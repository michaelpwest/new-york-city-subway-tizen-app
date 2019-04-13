<template>
	<div>
		<header class="ui-header">
			<h2 class="ui-title">Arrival Times</h2>
		</header>
		<section class="ui-content">
			<Routes></Routes>
		</section>
	</div>
</template>

<script>
import Routes from "@/components/Routes.vue";

export default {
	components: {
		Routes,
	},
};
</script>
