<template>
	<view>
		<view class="page-body">
			<view class="map">
				<!-- :key="index" -->
				<map :latitude="latitude" :longitude="longitude" show-location="true" :markers="covers" @callouttap="getoption()" :scale="scaling" :polyline="polyline"></map>
				
				<!-- <view class="my-location"><button class="location-button" @tap="getLocation">我的位置</button></view> -->
				<button class="my-location" type="default" @tap="getLocation">定位</button>
				<button class="sc-location" type="default" @tap="getoption">更多</button>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			id:0,
			scaling:16,
			latitude: '',
			longitude: '',
			covers: [
				{
					id:0,
					title: '景点',
					latitude: '',
					longitude: '',
					iconPath: ''
				},
				{
					id:1,
					title: '定位',
					latitude: '',
					longitude: '',
					iconPath: ''
				}
			]
		};
	},
	onShow() {
		let that = this;
		uni.getLocation({
			type: 'gcj02',
			success: res => {
				console.log('当前位置的经度：' + res.longitude);
				that.longitude = res.longitude;
				that.latitude = res.latitude;
				console.log('当前位置的纬度：' + res.latitude);
				that.covers[1].latitude = res.data.data.sdimension;
				that.covers[1].longitude = res.data.data.slongitude;
				that.covers[1].iconPath = res.data.data.img;
			}
		});
	},
	methods: {
		getLocation() {
			let that = this;
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log('当前位置的经度：' + res.longitude);
					that.longitude = res.longitude;
					that.latitude = res.latitude;
					console.log('当前位置的纬度：' + res.latitude);
					that.covers[1].latitude = res.data.data.sdimension;
					that.covers[1].longitude = res.data.data.slongitude;
					that.covers[1].iconPath = res.data.data.img;
				}
			});
		},
		getoption(){
			let that = this;
			uni.chooseLocation({
			    success: function (res) {
					that.latitude = res.latitude;
					that.longitude = res.longitude;
			        console.log('位置名称：' + res.name);
			        console.log('详细地址：' + res.address);
			        console.log('纬度：' + res.latitude);
			        console.log('经度：' + res.longitude);
			    }
			});
			// let that = this
			// uni.openLocation({
			//     latitude: that.latitude,
			//     longitude: that.longitude,
			//     success: function () {
			//         console.log('success');
			//     }
			// });
		}
	}
};
</script>

<style scoped>
.map map {
	position: relative;
	width: 100vw !important;
	height: 90vh !important;
}
.scaling{
	position: absolute;
	top: 20upx;
	right: 26upx;
	width: 60upx;
	height: 140upx;
	border-radius: 16upx;
	background: rgba(253, 216, 0, 0.8);
}
.bigger,.smaller{
	width: 60upx;
	height: 70upx;
	display: flex;
	justify-content: center;
	align-items: center;
	/* top: 50%;
	left: 50%;
	transform: translate(50%); */
}
.bigger text,
.smaller text{
	display: inline-block;
	font-size: 52upx;
	font-weight: 800;
	text-align: center;
	color: #fff3f4;
}

.my-location {
	float: left;
}
.sc-location{
	float: right;
}
.location-button {
	width: 160upx;
	padding: 5upx;
	font-size: 24upx;
	position: relative;
	float: left;
	bottom: 90upx;
	left: 20upx;
	background: rgba(253, 216, 0, 0.8);
}
</style>
