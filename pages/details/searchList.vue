<template>
	<view class="search">
		<view class="search-list">
			<view v-for="(item,index) in scenicSpot" :key ='index' >
				<view @tap= 'goods(item.id)' class="search-img">
					<image :src="item.img" mode="aspectFill"></image>
					<view class="search-text">
						<view class="search-name">{{item.scenicSpotName}}</view>
						<view class="search-describe">{{item.scenicSpotDescribe}}</view>
					</view>
				</view>
				
			</view>
			<!-- 文字介绍 -->
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// datai: {}
				j:1,
				scenicSpot:[],
				id:''
			}
		},
		onLoad:function(e){
			var scenicSpotName=e.scenicSpotName;
			let that = this;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/some/by/scenicSpotName',
				method: 'POST',
				data: {
					pageNum:that.j,
					scenicSpotName: scenicSpotName
					},
				success: res => {
					console.log(res.data.data.scenicSpotResponses);
					that.scenicSpot = res.data.data.scenicSpotResponses;
				},
				fail: () => {},
				complete: () => {}
			});
			
		},
		
		methods: {
			
			goods(id){
				console.log(id);
				uni.navigateTo({
					url:'./goods?id='+id
				})
			}
		},
		// onReachBottom() {
		// 	this.j++;
		// 	uni.showToast({ title: '触发上拉刷新' });
		// 	uni.request({
		// 		url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/some/by/scenicSpotName',
		// 		method: 'POST',
		// 		// dataType: 'jsonp',
		// 		// header: {
		// 		//         "Accept": "*/*"
		// 		//     },
		// 		data: {
		// 			'pageNum':this.j,
		// 			scenicSpotName: scenicSpotName
		// 		},
		// 		success: res => {
		// 			console.log(res);
		// 			this.scenicSpot = res.data.data.scenicSpotResponses;
		// 			uni.hideLoading();
		// 		},
		// 		fail: () => {},
		// 		complete: () => {uni.hideToast()}
		// 	});
		// 	console.log(this.j);
		// },
	};
</script>

<style scoped>

	.search-img{
		display: flex;
		justify-content: space-between;
		height: 140upx;
		width: 718upx;
		margin: 20upx auto;
		border: 1upx solid #c1c1c1;
		box-shadow: 1upx 1upx 1upx 1upx rgba(218, 218, 218, 102);
		background-color: #f4f4f4;
		/* overflow: hidden; */
	}
	.search-img image{
		display: inline-block;
		width: 150upx;
		height: 140upx;
	}
	.search-text{
		display: inline-block;
		float: right;
		width: 570upx;
		height: 140upx;
		padding: 10upx;
		box-sizing: border-box;
	}
	.search-name{
		font-size: 32upx;
		font-weight: 800;
		color: #086d7d;
		margin-bottom: 5upx;
	}
	.search-describe{
		font-size: 28upx;
		color: #f4af00;
	}
	
</style>
