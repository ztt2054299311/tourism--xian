<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title ">昵称：</text>
				<m-input type="text" focus clearable v-model="nickName" placeholder="请输入昵称"></m-input>
			</view>
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
		</view>
		<view class="btn-row"><button type="primary" class="primary" @tap="register">注册</button></view>
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
			nickName: '',
			userName: '',
			password: '',
			password1: '',
			phoneNumber: ''
		};
	},
	methods: {
		
		register() {
			let that = this;
			console.log(that);
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/register/user',
				method: 'POST',
				data: {
					nickName: that.nickName,
					userName: that.userName,
					password: that.password,
					phoneNumber: that.phoneNumber
				},
				success: res => {
					if(res.data.msg == "OK") {
					    uni.showToast({
					        title: '注册成功',
					        icon: 'success',
					        duration: 2000
					    })
						setTimeout(()=>{uni.hideToast();},500)
						uni.navigateBack({
							delta: 1
						});
					} else {
					    uni.showToast({
					        title: "该账号已被注册",
					        duration: 2000
					    })
						setTimeout(()=>{uni.hideToast();},1000)
					}
					console.log(res.data.msg);
				},
				fail: () => {},
				complete: () => {}
			});

			if (this.nickName.length > 12) {
				uni.showToast({
					icon: 'none',
					title: '昵称最长为 12 个字符'
				});
				return;
			}
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
				setTimeout(()=>{uni.hideToast();},500)
				return;
			}

			if (this.phoneNumber !== !/^1(3|4|5|6|7|8|9)\d{9}$/ && this.phoneNumber.length != 11) {
				uni.showToast({
					icon: 'none',
					title: '手机号码不合法'
				});
				setTimeout(()=>{uni.hideToast();},500)
				return;
			}
		}
	},
	onUnload: function() {}
};
</script>

<style></style>
