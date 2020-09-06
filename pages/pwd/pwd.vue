<template>
	<view class="content">
		<view class="input-row border">
			<text class="title">账号：</text>
			<m-input type="text" clearable v-model="userName" placeholder="请输入账号"></m-input>
		</view>
		<view class="input-row border">
			<text class="title">密码：</text>
			<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
		</view>
		<view class="input-row border">
			<text class="title">密码：</text>
			<m-input type="password" displayable v-model="password1" placeholder="请确认密码"></m-input>
		</view>
		<view class="input-row">
			<text class="title">手机：</text>
			<m-input type="text" clearable v-model="phoneNumber" placeholder="请输入手机号码"></m-input>
		</view>
		<view class="btn-row"><button type="primary" class="primary" @tap="findPassword">提交</button></view>
	</view>
</template>

<script>
import service from '../../service.js';
import mInput from '../../components/m-input.vue';

export default {
	components: {
		mInput
	},
	data() {
		return {
			userName: '',
			password: '',
			password1: '',
			phoneNumber: ''
		};
	},
	methods: {
		findPassword() {
			let that = this;
			console.log(that);
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/update/user/pwd',
				method: 'PUT',
				data: {
					userName: that.userName,
					password: that.password,
					phoneNumber: that.phoneNumber
				},
				success: res => {
					console.log(res)
					if (res.data.msg) {
						uni.showToast({
							title: res.data.msg,
							icon: 'success',
							duration: 2000
						});
						setTimeout(() => {
							uni.hideToast();
						}, 500);
						uni.navigateBack({
							delta: 1
						});
					} else {
						uni.showToast({
							title: '用户名或手机号错误',
							duration: 2000
						});
						setTimeout(() => {
							uni.hideToast();
						}, 1000);
					}
					console.log(res.data.msg);
				},
				fail: () => {},
				complete: () => {}
			});
			if (this.userName.length < 2) {
				uni.showToast({
					icon: 'none',
					title: '账号最短为 2 个字符'
				});
				return;
			}

			if (this.password.length < 6) {
				uni.showToast({
					icon: 'none',
					title: '密码最短为 6 个字符'
				});
				return;
			}
			if (this.password !== this.password1) {
				uni.showToast({
					icon: 'none',
					title: '俩次密码不一致'
				});
				setTimeout(() => {
					uni.hideToast();
				}, 500);
				return;
			}

			if (this.phoneNumber !== !/^1(3|4|5|6|7|8|9)\d{9}$/ && this.phoneNumber.length != 11) {
				uni.showToast({
					icon: 'none',
					title: '手机号码不合法'
				});
				setTimeout(() => {
					uni.hideToast();
				}, 500);
				return;
			}
		}
	}
};
</script>

<style></style>
