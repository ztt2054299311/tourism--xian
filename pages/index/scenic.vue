<template>
	<view class="active">
		<!-- <waterfall class="goods-list" column-count="2" column-width="auto"> -->
		<view class="conteng">
			<block v-for="(item,index) in scenicSpot" :key="index">
				<view class="conteng-article" @tap="openinfo" :data-scenicSpot="item.id">
					
					<view class="conteng-img">
						<image :src="item.img" mode="aspectFill" class="animated fadeIn"></image>
					</view>
					
					<!-- 文字介绍 -->
					<view class="active-introduce">
						<view class="active-title">{{item.scenicSpotName}}</view>
						<view class="active-list">{{item.scenicSpotDescribe}}</view>
					</view>
					
				</view>
			</block>
		</view>
		<!-- </waterfall> -->
	</view>
</template>

<script>
	export default{
		name:'Scenic',
		props:{
			scenicSpot:{}
		},
		data(){
			return{
			}
		},
		methods: {
			openinfo(e) {
				var detailsid = e.currentTarget.dataset.scenicspot;
				console.log(e.currentTarget.dataset.scenicspot);
				uni.navigateTo({
					url: '../details/goods?id='+detailsid
				});
			},
			
		},
		
	}
</script>

<style scoped>
	.active{
		margin: 0 20;
	}
	.conteng{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		-webkit-flex-wrap:wrap;
		overflow: hidden;
	}
	.conteng-article{
		width: 48%;
		flex-direction: column;
		display: flex;
		box-sizing: border-box;
	}
	.purchase{
		display: flex;
		align-items: center;
		padding-bottom: 10upx;
	}
	.conteng-img{
		height: 400upx !important;
		object-fit: cover;
		overflow: hidden;
	}
	.conteng-img image{
		width: 100% !important;
		height: 100% !important;
		object-fit: cover;
		border-radius: 10rpx;
	}
	.active-title{
		height: 100upx !important;
		font-size: 32upx;
		color: #444444;
		font-weight: bold;
		line-height: 100upx;
		display: -webkite-box;
		-webkite-box-orient: vertical;
		-webkite-line-clamp:2;
		overflow: hidden;
	}
	.active-list{
		color:  #d0b083;
		font-size: 20upx;
		margin-bottom: 10upx;
		overflow: hidden;
	}
	.active-introduce {
		padding-left: 10upx;
	}
</style>
