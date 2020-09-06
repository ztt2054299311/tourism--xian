<template>
	<view>
		<view class="ticket">
			<block v-for="(item, index) in ticket" :key="index">
				<view @tap="region(index)">
					<image :src="item.image" mode="widthFix"></image>
					<text>{{ item.name }}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ticket',
	data() {
		return {
			number: 0,
			j: [1,1,1,1,1],
			arrRegion: [],
			ticket: [
				{
					image: '../../static/shouye/lintong.jpg',
					name: '临潼区'
				},
				{
					image: '../../static/shouye/beilin.png',
					name: '碑林区'
				},
				{
					image: '../../static/shouye/yanta.png',
					name: '雁塔区'
				},
				{
					image: '../../static/shouye/baqiao.jpg',
					name: '灞桥区'
				},
				{
					image: '../../static/shouye/xincheng.jpg',
					name: '新城区'
				}
			]
		};
	},
	methods: {
		region(index) {
			console.log(index);
			let that = this;
			that.$emit('ticket', index+1);
			
		}
	}
};
</script>

<style>
.ticket image {
	width: 90upx;
	height: 90upx;
}
.ticket {
	display: flex;
	justify-content: space-around;
	text-align: center;
	margin: 30upx 0;
}
.ticket text {
	font-size: 30upx;
	display: block;
}
</style>
