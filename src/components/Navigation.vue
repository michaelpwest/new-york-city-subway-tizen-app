<template>
	<div id="nav">
		<header class="ui-header">
			<h2 class="ui-title">
				<div class="circle service-status" @click="routerLink(0)">
					<i class="fas fa-exclamation"></i>
				</div>
				<div class="circle home" @click="routerLink(1)">
					<i class="fas fa-home"></i>
				</div>
				<div class="circle arrival-times" @click="routerLink(2)">
					<i class="fas fa-search"></i>
				</div>
			</h2>
		</header>
	</div>
</template>

<script>
export default {
	data() {
		return {
			links: [
				"/service-status",
				"/",
				"/arrival-times",
			],
		};
	},
	methods: {
		routerLink(link) {
			this.$router.push({
				path: this.links[link],
			});
		},
	},
};
</script>

<style scoped>
.circle {
	border-radius: 28px;
	color: #FFFFFF;
	display: inline-block;
	height: 56px;
	line-height: 56px;
	margin-left: 8px;
	margin-right: 8px;
	width: 56px;
}
.circle.arrival-times {
	background: #6699FF;
}
.circle.service-status {
	background: #669900;
}
.circle.home {
	background: #FF6600;
}
</style>
