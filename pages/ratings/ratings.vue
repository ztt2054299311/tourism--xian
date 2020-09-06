<template>
	<view>
		<view class="uni-padding-wrap">
			<!-- 评论区 start -->
			<view class="uni-comment-list" v-for="(item, idx) in ratingsList" :key="idx">
				<view class="uni-comment">
					<view class="uni-comment-user">
						<image :src="item.imgUrl" mode="aspectFil"></image>
						<view class="uni-comment-top">
							<text>{{ item.nickName }}</text>
						</view>
						<!-- v-if="ismy" -->
						<view v-if="item.userId==userId" class="" @tap="deleteComment(item.commentId)">
							<text>删除</text>
						</view>
					</view>
					<view class="uni-comment-body">
						
						<view class="uni-comment-content">{{ item.comment }}</view>
						<view class="uni-comment-date">
							<view>{{ item.createTime }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 评论区 end -->
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
			j: 1,
			id:'',
			commentId:'',
			title:'评论',
			index: 0,
			ratingsList: ''
		};
	},
	onLoad(e) {
		this.id = e.id;
	},
	onShow() {
		let that = this;
		console.log('that.id'+that.id)
		uni.request({
			url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/comment/by/scenicId',
			method: 'POST',
			data: {
				scenicSpotId: that.id,
				pageNum: that.j,
			},
			success: res => {
				console.log(res.data);
				this.ratingsList = res.data.data.commentScenicResponseList;
			},
			fail: () => {},
			complete: () => {}
		});
	},
	onReachBottom() {
		this.j++;
		let that = this;
		setTimeout(() => {
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/comment/by/scenicId',
				method: 'POST',
				data: {
					scenicSpotId: that.id,
					pageNum: that.j,
				},
				success: res => {
					let ratingsPush = [];
					ratingsPush = res.data.data.commentScenicResponseList;
					for (let i = 0; i < ratingsPush.length; i++) {
					that.ratingsList.push(ratingsPush[i]);
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}, 500);
	},
	methods: {
		tapReply(e, idx) {
			if (this.index != idx) {
				this.index = idx;
				// console.log(e)
			} else {
				this.index = null;
			}
		},
		// ismy(index){
		// 	return [index].userId==this.userId
		// },
		deleteComment(commentId){
			
			let that = this;
			console.log(that.userId)
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/remove/comment',
				method: 'DELETE',
				data: {
					userId: that.userId,
					commentId: commentId
				},
				success: res => {
					console.log(res)
					onshow();
					uni.showToast({
						title:"删除成功"
					})
				},
				fail: () => {},
				complete: () => {
					uni.hideToast()
				}
			});
		}
	}
};
</script>

<style>
.uni-comment-list {
	/*    background:rgba(0,0,0,0.1);
    padding:0 10upx; */
}
.uni-comment{
	position: relative;
	width: 720upx;
	margin: 16upx auto;
	padding-bottom: 20upx;
	border-radius: 10%;
	background: rgb(238, 245, 255);
	overflow: hidden;
}
.uni-comment-user {
	height: 90upx;
	margin: 10upx 20upx;
	
}
.uni-comment-user image {
	float: left;
	width: 90upx;
	height:90upx;
	border-radius: 50%;
}
.uni-comment-user view{
	float: left;
	height: 40upx;
	color: #043941;
	font-size: 28upx;
	margin: 20upx;
}
.uni-comment-content {
	margin-bottom: 30upx;
}
.uni-comment-body {
	width: 100%;
	margin: 20upx;
}
.uni-comment-date{
	position: absolute;
	color: #b4af11;
	font-size: 20upx;
	bottom: 20upx;
	right: 20upx;
}
</style>
