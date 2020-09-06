<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{ position: headerPosition, top: headerTop }">
			<view class="grid" v-for="(grid, tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex == tabbarIndex ? 'on' : '']">{{ grid }}</view>
			</view>
		</view>

		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length == 0"><view class="text">请稍等</view></view>
				<view class="row" v-for="(row, index) in list" :key="index">
					<view class="type">{{ orderState[row.type] }}</view>
					<view class="order-info">
						<view class="left" @tap="toGood(row.scenicSpotId)"><image :src="row.img"></image></view>
						<view class="right">
							<view class="name">{{ row.ticketName }}</view>
							<view class="spec">{{ row.spec }}</view>
							<view class="price-number">
								￥
								<view class="price">{{ row.price }}</view>
								x
								<view class="number">{{ row.number }}</view>
							</view>
						</view>
					</view>
					<view class="detail">
						<view class="number">共{{ row.number }}件商品</view>
						<view class="sum">
							合计￥
							<view class="price">{{ row.totalMoney }}</view>
						</view>
					</view>
					<view class="btns">
						<block v-if="row.orderState == 'unpaid'">
							<view class="default" @tap="cancelOrder(row)">取消订单</view>
							<view class="pay" @tap="toPayment(row.totalMoney, row.id)">付款</view>
						</block>
						<block v-if="row.orderState == 'received'">
							<view class="default">评价</view>
							<view class="default" @tap="toPayment(row.totalMoney, row.id)">再次购买</view>
						</block>
						<block v-if="row.orderState == 'completed'"><view class="default" @tap="toRefund(row.id)">退票</view></block>
						<block v-if="row.orderState == 'refunds'"><view class="default" @tap="toPayment(row.totalMoney, row.id)">重新购买</view></block>
						<block v-if="row.orderState == 'cancelled'"><view class="default">已取消</view></block>
					</view>
				</view>
			</view>
		</view>
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
			url: [
				'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/order/by/userId',
				'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/wait/payment',
				'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/success/order',
				'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/charge/back'
			], //下拉刷新
			add: [1, 1, 1, 1], //下拉刷新
			headerPosition: 'fixed',
			headerTop: '0px',
			orderState: {
				unpaid: '等待付款',
				completed: '交易已完成',
				refunds: '门票退换处理中',
				cancelled: '订单已取消'
			},
			orderType: ['全部', '待付款', '待评价', '退换货'],
			//订单列表 演示数据
			orderList: [[], [], [], []],
			list: [],
			tabbarIndex: 0
		};
	},
	onLoad(option) {
		this.orderList = [[], [], [], []];
		//option为object类型，会序列化上个页面传递的参数
		console.log('option: ' + JSON.stringify(option));
		let tbIndex = parseInt(option.tbIndex) + 1;
		this.tabbarIndex = tbIndex;
		console.log(this.tabbarIndex);

		for (let i = 0; i < this.add.length; i++) {
			this.add[i] = 1;
		}
		let that = this;
		console.log(that.userId);
		uni.request({
			url: that.url[that.tabbarIndex],
			method: 'POST',
			data: {
				pageNum: that.add[that.tabbarIndex],
				userId: that.userId
			},
			success: res => {
				console.log(res.data);
				that.orderList[that.tabbarIndex] = res.data.data.orderResponseList;

				that.list = that.orderList[tbIndex];
			},
			fail: () => {
				uni.showLoading({
					title: '订单列表没有数据'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 500);
				return;
			},
			complete: () => {}
		});
		this.isSupport = !this.isSupport;
		//兼容H5下排序栏位置
		// #ifdef H5
		let Timer = setInterval(() => {
			let uniHead = document.getElementsByTagName('uni-page-head');
			if (uniHead.length > 0) {
				this.headerTop = uniHead[0].offsetHeight + 'px';
				clearInterval(Timer); //清除定时器
			}
		}, 1);
		// #endif
	},
	onPageScroll(e) {
		return;
		//兼容iOS端下拉时顶部漂移
		this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute';
	},
	onPullDownRefresh() {
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
		//下拉刷新
		const pages = getCurrentPages();
		const page = pages[pages.length - 1];
		const currentWebview = page.$getAppWebview();
		currentWebview.setStyle({
			pullToRefresh: {
				support: !this.isSupport,
				style: plus.os.name === 'Android' ? 'circle' : 'default'
			}
		});
	},
	methods: {
		showList: function(tbIndex) {
			this.list= [];
			let that = this;
			console.log(that);
			this.tbIndex = tbIndex;
			//调用四个接口值

			uni.request({
				url: that.url[tbIndex],
				method: 'POST',
				data: {
					pageNum: that.add[tbIndex],
					userId: that.userId
				},
				success: res => {
					console.log(res.data.data == null);
					if (res.data.data != null) {
						that.orderList[tbIndex] = res.data.data.orderResponseList;
						that.list = that.orderList[tbIndex];
						console.log(res.data.data);
					} else {
						uni.showToast({
							title: '订单列表没有数据'
						});
						setTimeout(() => {
							uni.hideToast();
						}, 1000);
					}
				},
				fail: () => {
					return 0;
				},
				complete: () => {}
			});

			return that.orderList[tbIndex];
		},
		showType(tbIndex) {
			this.add[this.tbIndex]=1;
			this.tabbarIndex = tbIndex;
			this.orderList = [[], [], [], []];
			console.log(this.list);
			console.log(tbIndex);
			//获取当前点击顶部导航栏数据
			setTimeout(() => {
				this.list = this.showList(tbIndex);
			}, 500);
		},
		cancelOrder(row) {
			uni.showModal({
				title: '取消订单',
				content: '确定取消此订单？',
				success: res => {
					if (res.confirm) {
						console.log('用户点击确定');
						this.doCancelOrder(row.id);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		doCancelOrder(id) {
			console.log(id);
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/close/pay/order',
				method: 'PUT',
				data: {
					id: id
				},
				success: res => {
					console.log(res);
					uni.showToast({
						title: '取消成功'
					});
				},
				fail: () => {},
				complete: () => {}
			});
			// let typeNum = this.orderList.length;
			// for (let i = 0; i < typeNum; i++) {
			// 	let list = this.orderList[i];
			// 	let orderNum = list.length;
			// 	if (orderNum > 0 && list[0].type == 'unpaid') {
			// 		for (let j = 0; j < orderNum; j++) {
			// 			if (this.orderList[i][j].id == id) {
			// 				this.orderList[i][j].type = 'cancelled';
			// 				break;
			// 			}
			// 		}
			// 	}
			// }
		},
		toPayment(totalMoney, id) {
			console.log(id)
			uni.showLoading({
				title: '正在获取订单...'
			});
			let paymentOrder = [];
			paymentOrder.push(totalMoney);
			setTimeout(() => {
			console.log(id)
				uni.hideLoading();
				uni.navigateTo({
					url: '../../pay/payment/payment?amount=' + totalMoney + '&ids=' + id
				});
			}, 500);
		},
		toGood(row) {
			console.log(row);
			uni.navigateTo({
				url: '../../details/goods?id=' + row
			});
		},
		toRefund(row) {
			console.log(row);
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/chargeBack/order',
				method: 'PUT',
				data: {
					id: row
				},
				success: res => {
					console.log(res);
					uni.showToast({
						title: '退票成功'
					});
				},
				fail: res => {
					uni.showToast({
						title: '出错了'
					});
				}
			});
		}
	},
	onReachBottom() {
		let that = this;
		that.add[that.tbIndex]++;
		uni.showToast({ title: '触发上拉刷新' });
		setTimeout(() => {
			uni.request({
				url: that.url[that.tbIndex],
				method: 'POST',
				data: {
					pageNum: that.add[that.tbIndex],
					userId: that.userId
				},
				success: res => {
					console.log(res);
					let scenicSpotPush = [];
					let newList = [];
					scenicSpotPush = res.data.data.orderResponseList;
					for (let i = 0; i < scenicSpotPush.length; i++) {
						that.list.push(scenicSpotPush[i]);
						newList = that.list;
					}
					uni.hideLoading();
				},
				fail: () => {},
				complete: () => {}
			});
		}, 500);
	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f3;
}
.topTabBar {
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #f8f8f8;
	height: 80upx;
	display: flex;
	justify-content: space-around;
	.grid {
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;
		.text {
			height: 76upx;
			display: flex;
			align-items: center;
			&.on {
				color: #f06c7a;
				border-bottom: solid 4upx #f06c7a;
			}
		}
	}
}
.order-list {
	margin-top: 80upx;
	padding-top: 20upx;
	width: 100%;
	.list {
		width: 94%;
		margin: 0 auto;
		.onorder {
			width: 100%;
			height: 50vw;
			display: flex;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			.text {
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.row {
			width: calc(100% - 40upx);
			padding: 10upx 20upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;
			.type {
				font-size: 26upx;
				color: #ec652f;
				height: 50upx;
				display: flex;
				align-items: center;
			}
			.order-info {
				width: 100%;
				display: flex;
				.left {
					flex-shrink: 0;
					width: 25vw;
					height: 25vw;
					image {
						width: 25vw;
						height: 25vw;
						border-radius: 10upx;
					}
				}
				.right {
					width: 100%;
					margin-left: 10upx;
					position: relative;
					.name {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.spec {
						color: #a7a7a7;
						font-size: 22upx;
					}
					.price-number {
						position: absolute;
						bottom: 0;
						width: 100%;
						display: flex;
						justify-content: flex-end;
						font-size: 22upx;
						color: #333;
						display: flex;
						align-items: flex-end;
						.price {
							font-size: 24upx;
							margin-right: 5upx;
						}
					}
				}
			}
			.detail {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;
				.sum {
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;
					.price {
						font-size: 30upx;
					}
				}
			}
			.btns {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view {
					min-width: 120upx;
					height: 50upx;
					padding: 0 20upx;
					border-radius: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28upx;
					margin-left: 20upx;
				}
				.default {
					border: solid 1upx #ccc;
					color: #666;
				}
				.pay {
					border: solid 1upx #ec652f;
					color: #ec652f;
				}
			}
		}
	}
}
</style>
