<template>
	<view>
		<view class="block">
			<view class="content">
				<view class="orderinfo">
					<view class="row">
						<view class="nominal">订单金额:</view>
						<view class="text">{{ amount }}元</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">选择支付方式</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="paytype = 'alipay'">
						<view class="left"><image src="/static/img/alipay.png"></image></view>
						<view class="center">支付宝支付</view>
						<view class="right"><radio :checked="paytype == 'alipay'" color="#ffcc00" /></view>
					</view>
					<view class="row" @tap="paytype = 'wxpay'">
						<view class="left"><image src="/static/img/wxpay.png"></image></view>
						<view class="center">微信支付</view>
						<view class="right"><radio :checked="paytype == 'wxpay'" color="#ffcc00" /></view>
					</view>
					<view class="row" @tap="paytype = 'yepay'">
						<view class="left"><image src="/static/img/yepay.png"></image></view>
						<view class="center">余额支付</view>
						<view class="right"><radio :checked="paytype == 'yepay'" color="#ffcc00" /></view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" @tap="doDeposit">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意
				<view class="terms">《条款协议》</view>
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
			amount: 0,
			ids: '',
			orderName: '',
			ordelist: '', //支付订单
			paytype: 'alipay' //支付类型
		};
	},
	onLoad(e) {
		console.log(e);
		console.log(this.userId);
		this.amount = e.amount;
		this.ids = e.ids.split(",");
		console.log(this.ids)
		uni.getStorage({
			key: 'payment_order',
			success: e => {
				if (e.data.length > 1) {
				} else {
					this.orderName = e.data[0].name;
				}
			}
		});
		let that = this;
		// uni.getStorage({
		// 	key: 'order_ids',
		// 	success: e => {
		// 		that.ids = e.data;
		// 	}
		// });
		console.log(this.ids);
	},
	onShow() {
		let that = this;
		uni.getStorage({
			key: 'payment_password',
			success: res => {
				console.log('payment_password' + res.data);
				that.paymentPassword = res.data;
			}
		});
	},
	methods: {
		doDeposit() {
			console.log(this.ids);
console.log('this.ids');
			if (this.paytype == 'yepay') {
				//余额支付

				if (!this.paymentPassword) {
					console.log('payment' + this.paymentPassword);
					uni.navigateTo({
						url: '../../user/setting/userInformation/paymentPassword'
					});
					return;
				} else {
					uni.navigateTo({
						url: '../../pay/payment/paymentPassword?amount=' + this.amount
					});
				}
			} else {
				//其他支付
				uni.showLoading({
					title: '支付中...'
				});
				let that = this;
				setTimeout(() => {
					uni.request({
						url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/pay/order/by/other',
						method: 'PUT',
						data: {
							ids: that.ids,
							totalMoney: that.amount,
							userId: that.userId
						},
						header: {
							Accept: '*/*'
						},
						success: res => {
							console.log(res);
							uni.hideLoading();
							uni.navigateTo({
								url: '../success/success?amount=' + that.amount
							});
						},
						fail: () => {},
						complete: () => {}
					});
				}, 500);
			}
		}
	}
};
</script>

<style lang="scss">
.block {
	width: 94%;
	padding: 0 3% 40upx 3%;
	.title {
		width: 100%;
		font-size: 34upx;
	}
	.content {
		.orderinfo {
			width: 100%;
			border-bottom: solid 1upx #eee;
			.row {
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;
				.nominal {
					flex-shrink: 0;
					font-size: 32upx;
					color: #7d7d7d;
				}
				.text {
					width: 70%;
					margin-left: 10upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 32upx;
				}
			}
		}
		.pay-list {
			width: 100%;
			border-bottom: solid 1upx #eee;
			.row {
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;
				.left {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					image {
						width: 80upx;
						height: 80upx;
					}
				}
				.center {
					width: 100%;
					font-size: 30upx;
				}
				.right {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
}
.pay {
	margin-top: 20upx;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.btn {
		width: 70%;
		height: 80upx;
		border-radius: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		background-color: #f06c7a;
		box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
	}
	.tis {
		margin-top: 10upx;
		width: 100%;
		font-size: 24upx;
		display: flex;
		justify-content: center;
		align-items: baseline;
		color: #999;
		.terms {
			color: #5a9ef7;
		}
	}
}
</style>
