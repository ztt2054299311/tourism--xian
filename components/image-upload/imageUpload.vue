<template>
	<view class="">
		<view class="imageUploadContainer">
			<view class="imageUploadList">
				<view class="imageItem"><image :src="imgUrl" mode=""></image></view>
				<view class="imageUpload" @tap="selectImage">上传头像</view>
				<button type="default" class="imageUpload" @tap="button">提交</button>
			</view>
		</view>
	</view>
	
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
	computed: mapState(['userId']),
	data() {
		return {
			imgUrl: '',
			jsonData: ''
		};
	},
	methods: {
		selectImage() {
			let that = this;
			uni.chooseImage({
				success: chooseImageRes => {
					const tempFilePaths = chooseImageRes.tempFilePaths;
					uni.uploadFile({
						url: 'http://www.shenzepengzuishuai.cn:8080/sso-file-service-0.0.1-SNAPSHOT/uploadImg',
						filePath: tempFilePaths[0],
						name: 'file',
						formData: {
							user: 'test'
						},
						success: uploadFileRes => {
							that.jsonData = uploadFileRes;
							console.log(that.jsonData);
						},
						fail: () => {
							uni.showToast({
								title: '上传失败'
							});
						},
					});
				}
			});
		},
		button() {
			console.log(this.jsonData.data);
			let objData = JSON.parse(this.jsonData.data);
			console.log(objData);
			this.imgUrl = objData.data.imgUrl;
			console.log(objData.data.imgUrl);
			let that = this;
			uni.request({
				url: 'https://dailytravel.cn/travel-0.0.1-SNAPSHOT/update/user/imgUrl',
				method: 'PUT',
				data: {
					id: that.userId,
					imgUrl: that.imgUrl
				},
				success: res => {
					uni.showToast({
						title: '上传成功'
					});
				},
				fail: () => {
					uni.showToast({
						title: '上传失败'
					});
				},
				complete: () => {
					uni.hideToast();
				}
			});
		}
	}
};
</script>

<style>
.imageUploadContainer {
	padding: 10upx 5upx;
	margin: 10upx 5upx;
}

.dragging {
	transform: scale(1.2);
}

.imageUploadList {
	display: flex;
	flex-wrap: wrap;
}

.imageItem,
.imageUpload {
	width: 160upx;
	height: 160upx;
	margin: 10upx;
}

.imageDel {
	position: relative;
	left: 120upx;
	bottom: 165upx;
	background-color: rgba(0, 0, 0, 0.5);
	width: 36upx;
	text-align: center;
	line-height: 35upx;
	border-radius: 17upx;
	color: white;
	font-size: 30upx;
	padding-bottom: 2upx;
}

.imageItem image,
.moveImage {
	width: 160upx;
	height: 160upx;
	border-radius: 8upx;
}

.imageUpload {
	line-height: 80upx;
	text-align: center;
	font-size: 80upx;
	color: #d9d9d9;
	border: 1px solid #d9d9d9;
	border-radius: 8upx;
}

.moveImage {
	position: absolute;
}
</style>
