<template>
	<view class="payPassword">
		<view class="input-row border">
			<text class="title">密码：</text>
			<input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
		</view>
		<view class="input-row border">
			<text class="title">密码：</text>
			<input type="password" displayable v-model="password1" placeholder="请确认密码" @keyup.enter="pass"></m-input>
		</view>
		<view class="payButton">
			
			<button @tap="pass">提交</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['hasLogin', 'userId'])
	},
		data(){
			return{
				password:'',
				password1:''
			}
		},
		methods: {
			
			pass(){
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
					return;
				}
				let that = this;
				uni.request({
					url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/update/user/password',
					method: 'PUT',
					data: {
						id:this.userId,
						password:this.password
					},
					success: res => {
						console.log(res);
						uni.showToast({
							title:'修改成功'
						});
					},
					fail: () => {},
					complete: () => {}
				});
			},
		}
		
	}
</script>

<style>
	.payPassword{
		width: 100%;
		height: 500upx;
		margin: 0 auto;
		margin-top: 200upx;
		position: relative;
	}
	/* .password{
		width: 60%;
		height: 100upx;
		background-color: #345390;
	} */
	/* .password1{
		width: 60%;
		height: 100upx;
		background-color: #007AFF;
	}
	.password input,
	.password1 input{
		width: 60%;
		height: 100upx;
		font-size: 48upx;
		background-color: #eaeaea;
		position: absolute;
		left: 50%;
		top:20%;
		transform: translate(-50%,-50%);
	} */
	.payButton{
		width: 280upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		top:50%;
		transform: translate(-50%,-50%);
	}
</style>
