<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="userName" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row"><button type="primary" class="primary" @tap="bindLogin">登录</button></view>
		<view class="action-row">
			<navigator url="../reg/reg">注册账号</navigator>
			<text>|</text>
			<navigator url="../pwd/pwd">忘记密码</navigator>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{ top: positionTop + 'px' }">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
				<!-- #ifdef MP-WEIXIN -->
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import service from '../../service.js';
import { mapState, mapActions, mapMutations } from 'vuex';
import mInput from '../../components/m-input.vue';
export default {
	components: {
		mInput
	},
	data() {
		return {
			providerList: [],
			hasProvider: false,
			userName: '',
			password: '',
			positionTop: 0,
			isDevtools: false
		};
	},
	computed: mapState(['hasLogin', 'forcedLogin']),

	methods: {
		...mapMutations(['login']),
		initProvider() {
			const filters = ['weixin', 'qq', 'sinaweibo'];
			uni.getProvider({
				service: 'oauth',
				success: res => {
					if (res.provider && res.provider.length) {
						for (let i = 0; i < res.provider.length; i++) {
							if (~filters.indexOf(res.provider[i])) {
								this.providerList.push({
									value: res.provider[i],
									image: '../../static/img/' + res.provider[i] + '.png'
								});
							}
						}
						this.hasProvider = true;
					}
				},
				fail: err => {
					console.error('获取服务供应商失败：' + JSON.stringify(err));
				}
			});
		},
		initPosition() {
			/**
			 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			 * 反向使用 top 进行定位，可以避免此问题。
			 */
			this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
		},
		bindLogin() {
			if (this.userName.length < 2) {
				uni.showToast({
					icon: 'none',
					title: '账号最短为 5 个字符'
				});
				setTimeout(() => {
					uni.hideToast();
				}, 500);
				return;
			}
			if (this.password.length < 6) {
				uni.showToast({
					icon: 'none',
					title: '密码最短为 6 个字符'
				});
				setTimeout(() => {
					uni.hideToast();
				}, 500);
				return;
			}
			console.log(this);
			let that = this;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/signIn/user',
				method: 'POST',
				data: {
					userName: that.userName,
					password: that.password
				},
				success: res => {
					console.log(res.data);
					if(res.data.msg == "OK"){
						that.userId = res.data.data.id;
						console.log(that.hasLogin);
						this.$store.dispatch('bindLogin', that.userId);
						uni.showToast({
							icon: null,
							title: '登录成功',
							duration: 2000
						});
						let UserInfo={
							userName: that.userName,
							password: that.password
						}
						setTimeout(() => {
						uni.navigateBack({ });
						}, 500);
					}else {
						setTimeout(() => {
						uni.showToast({
							icon: null,
							title: '用户账号或密码不正确'
						});
						}, 500);
					}
				}
			});
		},

		oauth(value) {
			uni.login({
				provider: value,
				success: res => {
					uni.getUserInfo({
						provider: value,
						success: infoRes => {
							/**
							 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
							 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
							 */
							this.toMain(infoRes.userInfo.nickName);
						},
						fail() {
							uni.showToast({
								icon: 'none',
								title: '登陆失败'
							});
						}
					});
				},
				fail: err => {
					console.error('授权登录失败：' + JSON.stringify(err));
				}
			});
		},
		getUserInfo({ detail }) {
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
	},

	onReady() {
		this.initPosition();
		this.initProvider();
		// #ifdef MP-WEIXIN
		this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
		// #endif
	}
};
</script>

<style>
.action-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.action-row navigator {
	color: #007aff;
	padding: 0 10px;
}

.oauth-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}

.oauth-image {
	position: relative;
	width: 50px;
	height: 50px;
	border: 1px solid #dddddd;
	border-radius: 50px;
	margin: 0 20px;
	background-color: #ffffff;
}

.oauth-image image {
	width: 30px;
	height: 30px;
	margin: 10px;
}

.oauth-image button {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}
</style>
