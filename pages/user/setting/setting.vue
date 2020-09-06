<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row" @click="changeFace">
					<view class="title">头像</view>
					<view class="right"><view class="tis">
					<image :src="user.imgUrl" mode="widthFix"></image>
					</view><view class="icon dianji">></view></view>
				</view>
				<view class="row" @click="changeNickName">
					<view class="title">昵称</view>
					<view class="right"><view class="tis">{{user.nickName}}</view><view class="icon dianji">></view></view>
				</view>
				<view class="row">
					<view class="title">账号</view>
					<view class="right"><view class="tis">{{user.userName}}</view><view class="icon dianji"></view></view>
				</view>
				<view class="row" @click="accountSecurity">
					<view class="title">账户安全</view>
					<view class="right"><view class="tis"></view><view class="icon dianji">></view></view>
				</view>
				<view class="row" @click="paymentPassword">
					<view class="title">支付设置</view>
					<view class="right"><view class="tis"></view><view class="icon dianji">></view></view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">通知提醒</view>
					<view class="right"><view class="tis"></view><view class="icon dianji"></view></view>
				</view>
				<view class="row">
					<view class="title">通用</view>
					<view class="right"><view class="tis"></view><view class="icon dianji"></view></view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">问题反馈</view>
					<view class="right"><view class="tis"></view><view class="icon dianji"></view></view>
				</view>
				<view class="row">
					<view class="title">关于</view>
					<view class="right"><view class="tis"></view><view class="icon dianji"></view></view>
				</view>
				<view class="row">
					<view class="title">版本升级</view>
					<view class="right"><view class="tis">v1.0.0</view><view class="icon dianji"></view></view>
				</view>
			</view>
		</view>
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
				user:[],
			};
		},
		
		onLoad() {
			let that = this;
			console.log(that.userId);
			
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/user/by/id',
				method: 'POST',
				data: {
					id: that.userId
				},
				success: res => {
					console.log(res.data.data)
					that.user = res.data.data;
				},
				fail: () => {},
				complete: () => {}
			});
		},
		onShow() {
			
		},
		methods: {
			changeFace(){
				uni.navigateTo({
				    url: './userInformation/face'
				});
			},
			changeNickName(){
				uni.navigateTo({
				    url: './userInformation/nickName'
				});
			},
			accountSecurity(){
				uni.navigateTo({
				    url: 'userInformation/accountSecurity'
				});
			},
			paymentPassword(){
				uni.navigateTo({
				    url: './userInformation/paymentPassword'
				});
			},
			showType(tbIndex){
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			}
		},
		onUnload() {
			uni.setStorage({
				imgUrl:'',
				nickName: '',
				success: function (res) {
					this.userName= res.data.userName;
					this.password= res.data.password;
				    console.log(res.data);
				}
			});
			
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f3f3f3;	
}

.icon {
	font-size: 30upx;

}
.content{
	padding-bottom: 20upx;
	.list{
		width: 96%;
		padding-left: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		.row{
			widows: 100%;
			min-height: 90upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: solid 1upx #eee;
			&:last-child{
				border-bottom: none;
			}
			.title{
				font-size: 32upx;
				color: #333;
			}
			.right{
				display: flex;
				align-items: center;
				color: #999;
				.tis{
					font-size: 26upx;
					margin-right: 5upx;
					max-height: 120upx;
					image{
						width: 100upx;
						height: 100upx;
						border-radius: 100%;
						margin: 10upx 0;
					}
				}
				.icon{
					width: 40upx;
					color: #cecece;
				}
			}
			
		}
	}
}

</style>
