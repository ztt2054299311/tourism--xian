<template>
	<view>
		<!-- 搜索 -->
		<view class="search-cont">
			<view class="search-code"><image src="../../static/tab/saoma.svg" mode="widthFix"></image></view>
			<view class="search" @click="topath">
				<image type="primary" ref="word" v-on:keyup="inputRef" src="../../static/tab/sousuo.svg" mode="widthFix" class="search-img"></image>
				<input type="text" disabled placeholder="请输入西安景点名" />
			</view>
			<view class="search-code"><image src="../../static/tab/xiaoxi.svg" mode="widthFix"></image></view>
		</view>
		<!-- 轮播图 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item>
							<view class="swiper-item"><image src="../../static/shouye/lunbo1.jpg" mode="aspectFill"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../static/shouye/lunbo2.jpg" mode="aspectFill"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../static/shouye/lunbo3.jpg" mode="aspectFill"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../static/shouye/lunbo4.jpg" mode="aspectFill"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script src="https://cdn.jsdelivr.net/npm/vue@2.6.6/dist/vue.js"></script>
<script>
export default {
	name: 'search',
	data() {
		return {
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500
		};
	},
	methods: {
		topath() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		changeIndicatorDots(e) {
			this.indicatorDots = !this.indicatorDots;
		},
		changeAutoplay(e) {
			this.autoplay = !this.autoplay;
		},
		intervalChange(e) {
			this.interval = e.target.value;
		},
		durationChange(e) {
			this.duration = e.target.value;
		}
	}
};
</script>

<style scoped>
.search-code image {
	width: 50upx;
	height: 50upx;
}
.search-code {
	width: 50upx;
	height: 50upx;
	padding: 0 15upx;
}
.search-img {
	margin: auto 0 auto 20upx;
	width: 45upx;
	height: 45upx;
}
.search {
	height: 70upx;
	line-height: 70upx;
	width: 100%;
	display: flex;
	flex-direction: flex;
	background: #fff7d4;
	border-top-left-radius: 50upx;
	border-bottom-left-radius: 50upx;
	border-bottom-right-radius: 50upx;
}
.search input {
	height: 70upx;
	line-height: 70upx;
	width: 100%;
	font-size: 30upx;
	color: #666666;
}
.search-cont {
	display: flex;
	justify-content: space-between;
	height: 70upx;
	align-items: center;
	background: linear-gradient(to top, #ffe566 10%, #ffd300 100%);
	padding: 30upx 0;
}
.swiper-item image{
	width: 100%;
	border-radius: 8px;
}
</style>
