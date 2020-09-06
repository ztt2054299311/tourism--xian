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
			payPassword: ''
		};
	},
	methods: {
		pass() {
			let that = this;
			console.log(that);
			console.log(that.userId);
			console.log(that.payPassword);
			if (this.payPassword.length == 6) {
				uni.request({
					url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/update/user/paypassword/by/old',
					method: 'PUT',
					data: {
						id: that.userId,
						paymentPassword: that.payPassword
					},
					success: res => {
						uni.showToast({
							title: '成功'
						});

						uni.setStorage({
							key: 'payment_password',
							data: that.payPassword,
							success: function() {
								uni.navigateBack({});
							}
						});
					},
					fail: () => {},
					complete: () => {}
				});
			} else {
				uni.showToast({
					title: '请输入六位数字密码'
				});
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
