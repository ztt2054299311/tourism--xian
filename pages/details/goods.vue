<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"></view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box" @tap="share">
					<view class="icon fenxiang"></view>
					<view class="text">分享</view>
				</view>
				<view class="box"><view class="text">客服</view></view>
				<view class="box" @tap="keep">
					<view class="icon" :class="[isKeep ? 'shoucangsel' : 'shoucang']"></view>
					<view class="text">{{ isKeep ? '已' : '' }}收藏</view>
				</view>
			</view>
			<view class="map" @tap="goodMap"><view class="m-map">地图</view></view>
			<view class="btn">
				<view class="joinCart" @tap="joinCart">加入购物车</view>
				<view class="buy" @tap="buy">立即购买</view>
			</view>
		</view>
		<!-- share弹窗 -->
		<view class="share" :class="shareClass" @touchmove.stop.prevent="discard" @tap="hideShare">
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="h1">分享</view>
				<view class="list">
					<view class="box">
						<image src="../../static/img/share/wx.png"></image>
						<view class="title">微信好友</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/pyq.png"></image>
						<view class="title">朋友圈</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/wb.png"></image>
						<view class="title">新浪微博</view>
					</view>
					<view class="box">
						<image src="../../static/img/share/qq.png"></image>
						<view class="title">QQ</view>
					</view>
				</view>
				<view class="btn" @tap="hideShare">取消</view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="discard" @tap="hideSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="title">选择规格：</view>
					<view class="sp">
						<view v-for="(item, index) in spec" :class="[index == selectSpec ? 'on' : '']" @tap="setSelectSpec(index)" :key="index">{{ item }}</view>
					</view>
					<view class="length" v-if="selectSpec != null">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub">
								-
								<view class="icon jian"></view>
							</view>
							<view class="input" @tap.stop="discard"><input type="number" v-model="number" /></view>
							<view class="add" @tap.stop="add">
								+
								<view class="icon jia"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="hideSpec">完成</view></view>
			</view>
		</view>
		<!-- 门票简绍 -->
		<view class="ticketDisc">
			<view class="popup service" :class="serviceClass" @touchmove.stop.prevent="discard" @tap="hideService">
				<!-- 遮罩层 -->
				<view class="mask"></view>
				<view class="layer" @tap.stop="discard">
					<view class="content">
						<view class="title">{{ ticketName }}</view>
						<view class="description">{{ ticketDescribe }}</view>
					</view>
					<view class="btn"><view class="button" @tap="hideService">完成</view></view>
				</view>
			</view>
		</view>
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.imgId"><image :src="swiper.imgUrl"></image></swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ swiperList.length }}</view>
		</view>

		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="price">成人票:￥{{ adultTicketPrice }}</view>
			<view class="price">学生票:￥{{ childrenTicketPrice }}</view>
			<view class="title">{{ name }}</view>
		</view>
		<!--规则选择 -->
		<view class="info-box spec">
			<view class="row" @tap="showSpec(false)">
				<view class="text">选择</view>
				<view class="content">
					<view>选择规格：</view>
					<view class="sp">
						<view v-for="(item, index) in spec" :key="index" :class="[index == selectSpec ? 'on' : '']">{{ item }}</view>
					</view>
				</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>

			<view class="row" @tap="showService">
				<view class="text">门票介绍</view>
				<view class="content">
					<view class="serviceitem">{{ ticketName }}</view>
				</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="info-box comments" id="comments">
			<view class="row">
				<view class="text">商品评价</view>
				<view class="arrow" @tap="toRatings">
					<view class="show" @tap="showComments(scenicSpotId)">
						查看全部
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="comment">
				<view class="user-info"><view class="username">我的评论：</view></view>
				<input type="text" v-model="mycomment" placeholder="留下你的足迹" class="mycomment" />
				<view @tap="submissionComment" class="comment-submission"><text>提交</text></view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="title">{{ JDescribe }}</view>
			<view class="Describe">{{ Describe }}</view>
		</view>
		<view style="height: 150upx;"></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['hasLogin', 'userId', 'forcedLogin'])
	},
	data(e) {
		return {
			//控制渐变标题栏的参数
			beforeHeaderzIndex: 11, //层级
			afterHeaderzIndex: 10, //层级
			beforeHeaderOpacity: 1, //不透明度
			afterHeaderOpacity: 0, //不透明度
			//是否显示返回按钮
			// #ifndef MP
			showBack: true,
			// #endif
			//轮播主图数据
			swiperList: [],
			//轮播图下标
			currentSwiper: 0,
			anchorlist: [], //导航条锚点
			selectAnchor: 0, //选中锚点
			serviceClass: '', //服务弹窗css类，控制开关动画
			specClass: '', //规格弹窗css类，控制开关动画
			shareClass: '', //分享弹窗css类，控制开关动画
			// 商品信息
			mycomment: '', //评论
			scenicSpotId: '',
			name: '',
			adultTicketPrice: '',
			childrenTicketPrice: '',
			img: '',
			Describe: '',
			JDescribe: '',
			ticketName: '',
			ticketDescribe: '',
			number: 1,
			service: [{ name: '正品保证', description: '此商品官方保证为正品' }, { name: '极速退款', description: '此商品享受退货极速退款服务' }],
			spec: ['成人', '学生'],
			ticket: [], //门票介绍
			selectSpec: null, //选中规格
			isKeep: false, //收藏
			scenicSpotId: '' //景点ID
		};
	},
	onLoad(option) {
		// #ifdef MP
		//小程序隐藏返回按钮
		this.showBack = false;
		// #endif
		//option为object类型，会序列化上个页面传递的参数
		this.scenicSpotId = option.id;
		let that = this;
		uni.request({
			url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/select/scenicSpot/by/id/',
			method: 'GET',
			data: { id: that.scenicSpotId },
			success: res => {
				console.log(res.data.data)
				that.img = res.data.data.img;
				that.name = res.data.data.scenicSpotName;
				that.Address = res.data.data.scenicSpotAddress;
				that.JDescribe = res.data.data.scenicSpotDescribe;
				that.Describe = res.data.data.scenicSpotSynopsis;
				that.swiperList = res.data.data.scenicSpotImgsListBos;
				that.adultTicketPrice = res.data.data.adultTicketPrice;
				that.childrenTicketPrice = res.data.data.childrenTicketPrice;
				that.ticketDescribe = res.data.data.ticketDescribe;
				that.ticketName = res.data.data.ticketName;
			},
			fail: () => {},
			complete: () => {}
		});
	},
	methods: {
		//轮播图指示器
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		// 分享
		share() {
			this.shareClass = 'show';
		},
		hideShare() {
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 150);
		},
		//地图
		goodMap() {
			uni.navigateTo({
				url: '/pages/details/goodMap?id=' + this.scenicSpotId
			});
			uni.setStorage({
				key: 'maps_id',
				data: this.scenicSpotId,
				success: function() {
					console.log('successmaps_id');
				}
			});
		},
		//收藏
		keep() {
			this.isKeep = this.isKeep ? false : true;
			var that = this;

			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (!res.confirm && this.isKeep) {
							that.isKeep = false;
						} else {
							that.isKeep = false;
							uni.navigateTo({
								url: '../login/login'
							});
						}
					}
				});
			} else {
				uni.request({
					url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/insert/favorite',
					method: 'POST',
					data: {
						userId: this.userId,
						scenicSpotId: this.scenicSpotId
					},
					success: res => {
						uni.showToast({
							icon: 'null',
							title: '收藏成功'
						});
						that.isKeep = true;
						setTimeout(() => {
							uni.hideToast();
						}, 500);
					},
					fail: () => {
						that.isKeep = false;
					}
				});
			}
		},

		joinCart() {
			let that = this;
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (!res.confirm) {
						} else {
							uni.navigateTo({
								url: '../login/login'
							});
						}
					}
				});
			} else {
				if (this.selectSpec == null) {
					return this.showSpec(() => {
						uni.request({
							url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/shopping/car', //添加购物车
							method: 'POST',
							data: {
								number: that.number,
								spec: '规格:' + that.spec[that.selectSpec],
								ticketId: that.scenicSpotId,
								userId: that.userId
							},
							success: res => {
								uni.showToast({ title: res.data.msg });
								setTimeout(() => {
									uni.hideToast();
								}, 500);
							}
						});
					});
				} else {
					console.log(that);
					uni.request({
						url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/shopping/car', //添加购物车
						method: 'POST',
						data: {
							number: that.number,
							spec: '规格:' + that.spec[that.selectSpec],
							ticketId: that.scenicSpotId,
							userId: that.userId
						},
						success: res => {
							uni.showToast({ title: res.data.msg });
							setTimeout(() => {
								uni.hideToast();
							}, 500);
						},
						fail: res => {
							uni.showToast({ title: res.data.msg });
							setTimeout(() => {
								uni.hideToast();
							}, 500);
						}
					});
				}
			}
		},
		//立即购买
		buy() {
			let that = this;
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (!res.confirm) {
						} else {
							uni.navigateTo({
								url: '../login/login'
							});
						}
					}
				});
			} else {
				if (this.selectSpec == null) {
					return this.showSpec(() => {
						this.toConfirmation();
					});
				}
				this.toConfirmation();
			}
		},
		//商品评论

		toRatings() {
			uni.navigateTo({
				url: '../ratings/ratings?id=' + this.scenicSpotId
			});
		},
		//跳转确认订单页面
		toConfirmation() {
			let tmpList = [];
			let paymentOrder = [];
			let goods = {
				scenicSpotId: this.scenicSpotId,
				img: this.img,
				name: this.name,
				spec: '规格:' + this.spec[this.selectSpec],
				adultTicketPrice: this.adultTicketPrice,
				childrenTicketPrice: this.childrenTicketPrice,
				number: this.number
			};
			console.log(this.scenicSpotId);
			let order = {
				ticketId: this.scenicSpotId,
				spec: '规格:' + this.spec[this.selectSpec],
				number: this.number
			};
			tmpList.push(goods);
			paymentOrder.push(order);
			uni.setStorage({
				key: 'buylist',
				data: tmpList,
				success: () => {
					uni.navigateTo({
						url: '../order/confirmation?buylist=' + tmpList
					});
				}
			});
			uni.setStorage({
				key: 'payment_order',
				data: paymentOrder
			});
		},
		//跳转评论列表
		showComments(goodsid) {},
		//提交评论
		submissionComment() {
			let that = this;
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
						if (!res.confirm) {
						} else {
							uni.navigateTo({
								url: '../login/login'
							});
						}
					}
				});
			} else {
				if (that.mycomment.length == 0) {
					uni.showToast({
						title: '什么都没写'
					});
					setTimeout(() => {
						uni.hideToast();
					}, 500);
				} else {
					uni.request({
						url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/insert/comment',
						method: 'POST',
						data: {
							comment: that.mycomment,
							scenicSpotId: that.scenicSpotId,
							userId: that.userId
						},
						success: res => {
							uni.showToast({
								title: '评论成功'
							});
							setTimeout(() => {
								uni.hideToast();
							}, 500);
						},
						fail() {}
					});
				}
			}
		},
		//选择规格
		setSelectSpec(index) {
			this.selectSpec = index;
		},
		//减少数量
		sub() {
			if (this.number <= 1) {
				return;
			}
			this.number--;
		},
		//增加数量
		add() {
			this.number++;
		},
		
		
		//服务弹窗
		showService() {
			console.log('show');
			this.serviceClass = 'show';
		},
		//关闭服务弹窗
		hideService() {
			this.serviceClass = 'hide';
			setTimeout(() => {
				this.serviceClass = 'none';
			}, 200);
		},
		//规格弹窗
		showSpec(fun) {
			console.log('show');
			this.specClass = 'show';
			this.specCallback = fun;
		},
		specCallback() {
			return;
		},
		//关闭规格弹窗
		hideSpec() {
			this.specClass = 'hide';
			//回调

			this.selectSpec && this.specCallback && this.specCallback();
			this.specCallback = false;
			setTimeout(() => {
				this.specClass = 'none';
			}, 200);
		},
		discard() {
			//丢弃
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
}
@keyframes showPopup {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes hidePopup {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
@keyframes showLayer {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-100%);
	}
}
@keyframes hideLayer {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0);
	}
}

.icon {
	font-size: 26upx;
}
.status {
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height); //覆盖样式
	/*  #endif  */
	background-color: #f1f1f1;
	transition: opacity 0.05s linear;
}
.header {
	width: 100%;

	height: 100upx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	.before,
	.after {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		transition: opacity 0.05s linear;
		.back {
			width: 125upx;
			height: 60upx;
			flex-shrink: 0;
			.icon {
				margin-left: -10%;
				width: 60upx;
				height: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 42upx;
			}
		}
		.middle {
			width: 100%;
		}
		.icon-btn {
			width: 125upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon {
				&:first-child {
					margin-right: 5upx;
				}
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	.before {
		.back {
			.icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
			}
		}
		.icon-btn {
			.icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
			}
		}
	}
	.after {
		background-color: #f1f1f1;
		.back {
			.icon {
				color: #666;
			}
		}
		.icon-btn {
			.icon {
				color: #666;
			}
		}
		.middle {
			font-size: 32upx;
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 7%;
			view {
				width: (100%/3);
				padding: 0 3%;
				margin: 0 3%;
				display: flex;
				justify-content: center;
				align-items: center;
				&.on {
					margin-bottom: -4upx;
					color: #f47952;
					border-bottom: solid 4upx #f47952;
				}
			}
		}
	}
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
	swiper {
		width: 100%;
		height: 100vw;
		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}
	.indicator {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}
.info-box {
	width: 92%;
	padding: 20upx 4%;
	background-color: #fff;
	margin-bottom: 20upx;
}

.goods-info {
	.price {
		display: inline-block;
		font-size: 42upx;
		font-weight: 500;
		color: #f47925;
		margin-right: 40upx;
	}
	.title {
		font-size: 30upx;
	}
}
.spec {
	.row {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 24upx;
			color: #a2a2a2;
			margin-right: 20upx;
		}
		.content {
			font-size: 28upx;
			display: flex;
			flex-wrap: wrap;
			.serviceitem {
				margin-right: 10upx;
			}
			.sp {
				width: 100%;
				display: flex;
				view {
					background-color: #f6f6f6;
					padding: 5upx 10upx;
					color: #999;
					margin-right: 10upx;
					font-size: 20upx;
					border-radius: 5upx;
					&.on {
						border: solid 1upx #f47952;
						padding: 4upx 8upx;
					}
				}
			}
		}
		.arrow {
			position: absolute;
			right: 4%;
			.icon {
				color: #ccc;
			}
		}
	}
}
.comments {
	.row {
		width: 100%;
		height: 40upx;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 30upx;
		}
		.arrow {
			font-size: 28upx;
			position: absolute;
			right: 4%;
			color: #17e6a1;
			.show {
				display: flex;
				align-items: center;
				.icon {
					color: #17e6a1;
				}
			}
		}
	}
	.comment {
		width: 100%;
		.user-info {
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: center;
			.username {
				font-size: 24upx;
				color: #999;
			}
		}
		.mycomment {
			margin: 0 0 30upx 0;
			font-size: 32upx;
			color: #8a8a8a;
		}
		.comment-submission {
			display: inline-block;
			margin-left: 90%;
			font-size: 32upx;
			right: 4%;
			color: #17e6a1;
		}
	}
}
.description {
	overflow: hidden;
	.title {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		color: #777;
		overflow: hidden;
	}
	.Describe {
		width: 90%;
		margin: 20upx 5%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #999;
		overflow: hidden;
	}
}
.footer {
	position: fixed;
	bottom: 0upx;
	width: 92%;
	padding: 0 4%;
	height: 99upx;
	border-top: solid 1upx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.icons {
		display: flex;
		height: 80upx;
		margin-left: -4%;
		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.icon {
				font-size: 40upx;
				color: #828282;
			}
			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}
	.btn {
		height: 80upx;
		border-radius: 40upx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;
		.joinCart,
		.buy {
			height: 80upx;
			padding: 0 40upx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 28upx;
		}
		.joinCart {
			background-color: #f0b46c;
		}
		.buy {
			background-color: #f06c7a;
		}
	}
}
.map {
	position: absolute;
	width: 100upx;
	height: 100upx;
	bottom: 100upx;
	border-radius: 50%;
	background: rgba($color: #ffd300, $alpha: 0.8);
	.m-map {
		text-align: center;
		line-height: 100upx;
		color: #ffffff;
	}
}

.popup {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;
	display: none;
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 21;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.layer {
		position: fixed;
		z-index: 22;
		bottom: -70%;
		width: 92%;
		padding: 0 4%;
		height: 70%;
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		.content {
			width: 100%;
			padding: 20upx 0;
		}
		.btn {
			width: 100%;
			height: 100upx;
			.button {
				width: 100%;
				height: 80upx;
				border-radius: 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f47952;
				font-size: 28upx;
			}
		}
	}

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		display: block;
		.mask {
			animation: hidePopup 0.2s linear both;
		}

		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	&.service {
		.row {
			margin: 30upx 0;
			.title {
				font-size: 30upx;
				margin: 10upx 0;
			}
			.description {
				font-size: 28upx;
				color: #999;
			}
		}
	}
	&.spec {
		.title {
			font-size: 30upx;
			margin: 30upx 0;
		}
		.sp {
			display: flex;
			view {
				font-size: 28upx;
				padding: 5upx 20upx;
				border-radius: 8upx;
				margin: 0 30upx 20upx 0;
				background-color: #f6f6f6;
				&.on {
					padding: 3upx 18upx;
					border: solid 1upx #f47925;
				}
			}
		}
		.length {
			margin-top: 30upx;
			border-top: solid 1upx #aaa;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20upx;
			.text {
				font-size: 30upx;
			}
			.number {
				display: flex;
				justify-content: center;
				align-items: center;
				.input {
					width: 80upx;
					height: 60upx;
					margin: 0 10upx;
					background-color: #f3f3f3;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					input {
						width: 80upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 26upx;
					}
				}

				.sub,
				.add {
					width: 60upx;
					height: 60upx;
					background-color: #f3f3f3;
					border-radius: 5upx;
					.icon {
						font-size: 30upx;
						width: 60upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}
}
.share {
	display: none;
	&.show {
		display: block;
		.mask {
			animation: showPopup 0.15s linear both;
		}
		.layer {
			animation: showLayer 0.15s linear both;
		}
	}
	&.hide {
		display: block;
		.mask {
			animation: hidePopup 0.15s linear both;
		}

		.layer {
			animation: hideLayer 0.15s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 11;
	}
	.layer {
		width: 92%;
		position: fixed;
		z-index: 12;
		padding: 0 4%;
		top: 100%;
		background-color: rgba(255, 255, 255, 0.9);
		.list {
			width: 100%;
			display: flex;
			padding: 10upx 0 30upx 0;
			.box {
				width: 25%;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				image {
					width: 13.8vw;
					height: 13.8vw;
				}
				.title {
					margin-top: 10upx;
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 26upx;
				}
			}
		}
		.btn {
			width: 100%;
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			border-top: solid 1upx #666666;
		}
		.h1 {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34upx;
		}
	}
}
</style>
