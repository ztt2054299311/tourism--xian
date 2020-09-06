<template>
	<view class="payPassword">
		<view class="password">
			<input 
			type="text" 
			focus 
			maxlength="12"
			v-model="nickName"
			 @keyup.enter="pass"/>
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
				nickName:'',
			}
		},
		methods: {
			
			pass(e){
				let that = this;
				console.log(that.userId);
				uni.request({
					url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/update/user/nickName',
					method: 'PUT',
					data: {
						id:that.userId,
						nickName:that.nickName
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
		height: 300upx;
		margin: 0 auto;
		margin-top: 200upx;
		position: relative;
	}
	
	.password input{
		width: 60%;
		height: 100upx;
		font-size: 48upx;
		background-color: #eaeaea;
		position: absolute;
		left: 50%;
		top:20%;
		transform: translate(-50%,-50%);
	}
	.payButton{
		width: 280upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		top:50%;
		transform: translate(-50%,-50%);
	}
</style>
