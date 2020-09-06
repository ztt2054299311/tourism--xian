<template>
	<view>
		<view class="place"></view>
		<!-- 用户信息 -->
		<view class="user">
			<!-- 头像 -->
			<view class="left"><image :src="user.imgUrl" @tap="toSetting"></image></view>
			<!-- 昵称 -->
			<view class="right">
				<view class="username">{{ user.nickName }}</view>
			</view>
			<!-- 登录 -->
			<view class="erweima">
				<view class="primary" v-if="!hasLogin" @tap="bindLogin"><text class="login_text">登录</text></view>
				<view class="default" v-if="hasLogin" @tap="bindLogout"><text class="login_text">退出</text></view>
			</view>
		</view>
		<!-- 订单-余额 -->
		<view class="order">
			<!-- 订单类型 -->
			<view class="list">
				<view class="box" v-for="(row, index) in orderList" :key="index" @tap="toOrderList(index)">
					<view class="text">{{ row.text }}</view>
				</view>
			</view>
			<!-- 余额 -->
			<view class="lastMoney-info">
				<view class="left">
					<view class="box">
						<view class="num">{{ user.lastMoney }}</view>
						<view class="text">余额</view>
					</view>
				</view>
				<view class="right">
					<view class="box" @tap="toDeposit()">
						<view class="img"><view class="icon chongzhi"></view></view>
						<view class="text">充值</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">我的工具栏</view>
			<view class="list">
				<view class="box" v-for="(row, index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
					<view class="img"><image :src="row.img"></image></view>
					<view class="text">{{ row.text }}</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place-bottom"></view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['hasLogin', 'forcedLogin', 'userId'])
	},
	data() {
		return {
			// isfirst:true,
			headerPosition: 'fixed',
			headerTop: null,
			statusTop: null,
			showHeader: true,
			//个人信息,
			user: [],
			// 订单类型
			orderList: [{ text: '全部' }, { text: '待付款' }, { text: '待评价' }, { text: '退换货' }],
			// 工具栏列表
			mytoolbarList: [
				{ url: '../../user/keep/keep', text: '我的收藏', img: '/static/img/user/point.png' },
				{ url: '../../user/cart/cart', text: '购物车', img: '/static/img/user/quan.png' },
				{ url: '', text: '新客豪礼', img: '/static/img/user/renw.png' },
				{ url: '', text: '领红包', img: '/static/img/user/momey.png' },

				{ url: '', text: '去过景点', img: '/static/img/user/addr.png' },
				{ url: '', text: '账户安全', img: '/static/img/user/security.png' },
				{ url: '', text: '银行卡', img: '/static/img/user/bank.png' },
				{ url: '', text: '抽奖', img: '/static/img/user/choujiang.png' }
			]
		};
	},
	onLoad() {
		this.statusHeight = 0;
		// #ifdef APP-PLUS
		this.showHeader = false;
		this.statusHeight = plus.navigator.getStatusbarHeight();
		// #endif
	},
	onReady() {
		//此处，演示,每次页面初次渲染都把登录状态重置
		console.log('onReady' + this);
		uni.setStorage({
			key: 'UserInfo',
			data: false,
			success: function() {},
			fail: function(e) {}
		});
	},
	onShow() {
		if (!this.hasLogin) {
			uni.showModal({
				title: '未登录',
				content: '您未登录，需要登录后才能继续',
				/**
				 * 如果需要强制登录，不显示取消按钮
				 */
				showCancel: !this.forcedLogin,
				success: res => {
					if (res.confirm) {
						/**
						 * 如果需要强制登录，使用reLaunch方式
						 */
						uni.navigateTo({
							url: '../../login/login'
						});
					}
				}
			});
		} else {
			let that = this;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/user/by/id',
				method: 'POST',
				data: {
					id: that.userId
				},
				success: res => {
					console.log(res);
					that.user = res.data.data;
				},
				fail: () => {},
				complete: () => {}
			});
			console.log(this.user);
		}
	},
	methods: {
		//登录
		...mapMutations(['logout']),
		bindLogin() {
			uni.navigateTo({
				url: '../../login/login'
			});
		},
		bindLogout() {
			this.logout();
			try {
				uni.clearStorageSync();
			} catch (e) {
				// error
			}
			this.user = '';
			this.$store.dispatch('bindLogout');
			/**
			 * 如果需要强制登录跳转回登录页面
			 */
			if (!this.hasLogin) {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},

		//订单列表
		toOrderList(index) {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							uni.navigateTo({
								url: '../../login/login'
							});
						}
					}
				});
			} else {
				uni.navigateTo({ url: '../../user/order_list/order_list?tbIndex=' + (index - 1) });
			}
		},
		toSetting() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							uni.navigateTo({
								url: '../../login/login'
							});
						}
					}
				});
			} else {
				uni.navigateTo({ url: '../setting/setting' });
			}
		},
		isLogin() {
			const value = uni.getStorageSync('UserInfo');
			if (value) {
				return true;
			}
			return false;
		},
		//充值
		toDeposit() {
			let that = this;
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							uni.navigateTo({
								url: '../../login/login'
							});
						}
					}
				});
			} else {
				uni.navigateTo({
					url: '../../user/deposit/deposit?lastMoney=' + that.user.lastMoney,
					success: function() {
						console.log(that.user.lastMoney);
					}
				});
			}
		},
		toPage(url) {
			if (!url) {
				uni.showToast({ title: '还未包含此页面', icon: 'none' });
				return;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
page {
	position: relative;
	background-color: #fff;
}
.place {
	background-color: #0eb0c9;
	height: 100upx;
}
.place-bottom {
	height: 300upx;
}
.user {
	width: 92%;
	padding: 0 4%;
	display: flex;
	align-items: center;
	// position: relative;
	background-color: #0eb0c9;
	padding-bottom: 120upx;
	.left {
		width: 20vw;
		height: 20vw;
		flex-shrink: 0;
		margin-right: 20upx;
		border: solid 1upx #fff;
		border-radius: 100%;
		background: url(../../../static/img/user/face.png) center;
		image {
			width: 20vw;
			height: 20vw;
			border-radius: 100%;
		}
	}
	.right {
		width: 100%;
		.username {
			font-size: 36upx;
			color: #fff;
		}
	}
	.erweima {
		flex-shrink: 0;
		width: 10vw;
		height: 10vw;
		margin-left: 5vw;
		border-radius: 30%;

		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to left, #fbbb37 0%, #fcf0d0 105%);
		.login_text {
			color: #619ac3;
			font-size: 26upx;
			margin: 0 auto;
		}
	}
}
.order {
	width: 84%;
	margin: 30upx 4% 30upx 4%;
	padding: 30upx 4% 20upx 4%;
	background-color: #fff;
	box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
	border-radius: 15upx;
	.list {
		display: flex;
		border-bottom: solid 1upx #17e6a1;
		padding-bottom: 10upx;
		.box {
			width: 20%;
			.img {
				width: 100%;
				display: flex;
				justify-content: center;
				.icon {
					font-size: 50upx;
					color: #464646;
				}
			}
			.text {
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 28upx;
				color: #3d3d3d;
			}
		}
	}
	.lastMoney-info {
		display: flex;
		padding: 10upx 0;
		.left {
			width: 50%;
			display: flex;
			.box {
				width: 50%;
				font-size: 28upx;

				.num {
					width: 100%;
					height: 50upx;
					display: flex;
					justify-content: center;
					align-items: flex-end;
					color: #f9a453;
				}
				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					color: #3d3d3d;
					font-size: 28upx;
				}
			}
		}
		.right {
			border-left: solid 1upx #17e6a1;
			width: 50%;
			.box {
				.img {
					width: 100%;
					height: 50upx;
					display: flex;
					justify-content: center;
					align-items: flex-end;
					.icon {
						font-size: 45upx;
						color: #e78901;
					}
				}
				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #3d3d3d;
				}
			}
		}
	}
}
.toolbar {
	width: 92%;
	margin: 0 4% 0 4%;
	padding: 0 0 20upx 0;
	background-color: #fff;
	box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
	border-radius: 15upx;
	.title {
		padding-top: 10upx;
		margin: 0 0 10upx 3%;
		font-size: 30upx;
		height: 80upx;
		display: flex;
		align-items: center;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		.box {
			width: 25%;
			margin-bottom: 30upx;
			.img {
				width: 23vw;
				height: 10.5vw;
				display: flex;
				justify-content: center;

				image {
					width: 9vw;
					height: 9vw;
				}
			}
			.text {
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 26upx;
				color: #3d3d3d;
			}
		}
	}
}
</style>
