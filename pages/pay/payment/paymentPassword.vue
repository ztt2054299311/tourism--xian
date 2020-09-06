<template>
	<view class="payPassword">
		<view class="password"><input type="password" focus maxlength="6" v-model="payPassword" @keyup.enter="pass" /></view>
		<view class="payButton"><button type="primary" @tap="pass">提交</button></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['hasLogin', 'userId'])
	},
	data() {
		return {
			amount: 0,
			paymentOrderids: '',
			payPassword: '',
			lastMoney:'',
			payment_password: ''
		};
	},
	onLoad(e) {
		this.amount = e.amount;
		console.log(this.amount);
	},
	onReady() {
		let that = this;
		uni.getStorage({
			key: 'payment_password',
			success: function(res) {
				that.payment_password = res.data;
			}
		});
		uni.getStorage({
			key: 'userId',
			success: function(res) {
				that.userId = res.data;
				console.log(res.data);
			}
		});
		uni.getStorage({
			key: 'order_ids',
			success: function(res) {
				that.paymentOrderids = res.data;
			}
		});
		uni.getStorage({
			key: 'lastMoney',
			success: function(res) {
				that.lastMoney = res.data;
			}
		});
	},
	methods: {
		pass() {
			let that = this;
			console.log(that.lastMoney)
			if (this.payPassword == this.payment_password) {
				uni.showLoading({
					title: '支付中...'
				});
				let that = this;
				uni.request({
					url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/pay/orders',
					method: 'PUT',
					data: {
						ids: that.paymentOrderids,
						totalMoney: that.amount,
						userId: that.userId
					},
					success: res => {
						console.log(res.data);
						if (res.data.msg == "OK") {
							setTimeout(() => {
								uni.showToast({
									icon: null,
									title: '支付成功'
								});
							}, 500);
							setTimeout(() => {
								uni.redirectTo({
									url: '../success/success?amount=' + that.amount
								});
							}, 200);
							uni.hideToast();
						} else {
							setTimeout(() => {
								uni.showToast({
									icon: null,
									title: '余额不足'
								});
							}, 500);
							uni.navigateBack({
								delta: 1
							});
							uni.hideToast();
						}
					},
					fail: () => {},
					complete: () => {
						uni.hideToast();
					}
				});
			} else {
				uni.showToast({
					icon: null,
					title: '密码错误'
				});
				setTimeout(() => {
					uni.hideToast();
				}, 500);
			}
		}
	}
};
</script>

<style>
.payPassword {
	width: 100%;
	height: 300upx;
	margin: 0 auto;
	margin-top: 200upx;
	position: relative;
}

.password input {
	width: 60%;
	height: 100upx;
	font-size: 48upx;
	background-color: #eaeaea;
	position: absolute;
	left: 50%;
	top: 20%;
	transform: translate(-50%, -50%);
}
.payButton {
	width: 280upx;
	height: 50upx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
</style>
