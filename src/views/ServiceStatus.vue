<template>
	<div>
		<header class="ui-header">
			<h2 class="ui-title">Service Status</h2>
		</header>
		<section class="ui-content">
			<ServiceStatus></ServiceStatus>
		</section>
	</div>
</template>

<script>
import ServiceStatus from "@/components/ServiceStatus.vue";

export default {
	components: {
		ServiceStatus,
	},
};
</script>
