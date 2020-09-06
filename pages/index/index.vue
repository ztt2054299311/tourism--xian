<template>
	<view>
		<Search></Search>
		<Ticket v-on:ticket="classify"></Ticket>
		<Content id="boxFixde" v-on:content="classify"></Content>
		<view style="height: 140upx;"></view>
		<Scenic :scenicSpot="scenicSpots"></Scenic>
	</view>
</template>
<script>
import { mapState } from 'vuex';
import Search from './search.vue';
import Ticket from './ticket.vue';
import Content from './content.vue';
import Scenic from './scenic.vue';

export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'userId']),
	components: {
		Search,
		Ticket,
		Content,
		Scenic
	},
	data() {
		return {
			j: [1,1,1,1,1,1,1,1,1,1,1],
			scenicSpots: {},
			scenicSpotList:[[],[],[],[],[],[],[],[],[],[],[]],
			scenicIndex:0 //下拉刷新
		};
	},
	
	onLoad() {
			
			
			
			
			let that = this;
			
			this.j = [1,1,1,1,1,1,1,1,1,1,1];
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/three/in/one',
				method: 'POST',
				data: { 
					choose: 0,
					pageNum: that.j[0] ,
					},
				success: res => {
					let scenicSpotPush = [];
					scenicSpotPush = res.data.data.scenicSpotResponses;
					for (let i = 0; i < scenicSpotPush.length; i++) {
						that.scenicSpotList[this.scenicIndex].push(scenicSpotPush[i]);
						}
				},
				fail: () => {},
				complete: () => {}
			});
		this.scenicSpots = this.scenicSpotList[this.scenicIndex]
		console.log(this.scenicSpotList[this.scenicIndex])
	},
	onShow() {
		this.j = [1,1,1,1,1,1,1,1,1,1,1];
		
		
		
				uni.getStorage({
					key:'userinfo',
					success: (res) => {
						console.log("usif")
						console.log(res)
					}
				})
				
	},
	
	methods: {
		classify(index){
			console.log(index)
			this.scenicIndex = index
			let that = this;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/three/in/one',
				method: 'POST',
				data: { 
					choose: index,
					pageNum: this.j[index] ,
					},
				success: res => {
					// this.scenicSpots = res.data.data.scenicSpotResponses;
					let scenicSpotPush = [];
					scenicSpotPush = res.data.data.scenicSpotResponses;
					for (let i = 0; i < scenicSpotPush.length; i++) {
						that.scenicSpotList[this.scenicIndex].push(scenicSpotPush[i]);
						}
				},
				fail: () => {},
				complete: () => {}
			});
		this.scenicSpots = this.scenicSpotList[this.scenicIndex]
		console.log(this.scenicSpotList[this.scenicIndex])
		},
	},
	onReachBottom() {
		this.j[this.scenicIndex]++;
		console.log(this.scenicIndex);
		console.log(this.j[this.scenicIndex]);
		console.log(this.scenicSpots)
		uni.showToast({ title: '上拉刷新' });
		
		setTimeout(() => {
			let that = this;
			this.scenicSpotList.length = 9;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/three/in/one',
				method: 'POST',
				dataType: "json",
				crossDomain: true,
				data: { 
					choose: that.scenicIndex,
					pageNum: that.j[that.scenicIndex] ,
					},
				success: res => {
					console.log(res);
					let scenicSpotPush = [];
					scenicSpotPush = res.data.data.scenicSpotResponses;
					for (let i = 0; i < scenicSpotPush.length; i++) {
						that.scenicSpotList[this.scenicIndex].push(scenicSpotPush[i]);
					}
					
				},
				fail: () => {},
				complete: () => {
					uni.hideToast()
				}
			});
		}, 500);
		this.scenicSpots = this.scenicSpotList[this.scenicIndex]
		console.log(this.scenicSpotList[this.scenicIndex])
	},
	onNavigationBarButtonTap(){
		this.j = [1,1,1,1,1,1,1,1,1,1,1];
		console.log(this.j)
	},
	// // 监听页面滚动
	onPageScroll(e) {
		this.rect = e.scrollTop;
	},
	
	getUserInfo({ detail }) {
		uni.getStorage({
			key:UserInfo,
			success: (res) => {
				console.log(res)
			}
		})
		if (detail.userInfo) {
			this.toMain(detail.userInfo.userName);
		} else {
			uni.showToast({
				icon: 'none',
				title: '登陆失败'
			});
		}
	},
	toMain(userName) {
		this.login(userName);
		/**
		 * 强制登录时使用reLaunch方式跳转过来
		 * 返回首页也使用reLaunch方式
		 */
		if (this.forcedLogin) {
			uni.reLaunch({
				url: '../index/index'
			});
		} else {
			uni.navigateBack();
		}
	}
};
</script>

<style scoped>
	.span{
		margin-top:2000px
	}
/* .is_fixed{position: fixed; left: 0; right: 0; top: 0;} */
</style>
