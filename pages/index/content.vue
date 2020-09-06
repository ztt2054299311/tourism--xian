<template>
	<view>
		<scroll-view scroll-x="true" class="scroll" scroll-with-animation="true">
			<view>
				<block v-for="(item, index) in contentdata" :key="index">
					<view class="list-cont" @tap="tabs(index)" :class="{active:index == number}">
						<view>
							<text class="con-text-a">{{ item.title }}</text>
						</view>
						<view>
							<text class="con-text-b" :class="{activeb:index == number}">{{ item.labei }}</text>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		name:"tab",
		data(){
			return {
				number:0,
				j: [1,1,1,1,1],
				arrRegion:[],
				contentdata:[
					{
						title:'推荐',
						labei:'猜你喜欢'
					},
					{
						title:'人文',
						labei:'震古烁今'
					},
					{
						title:'休闲',
						labei:'吃喝玩乐'
					},
					{
						title:'自然',
						labei:'大好河山'
					},
					{
						title:'其他',
						labei:'更多景点'
					}
				]
			}
		},
		methods:{
			tabs(index){
				this.number = index;
				console.log(index)
				let that = this;
				if(index==0){
					that.$emit('content', index);
				}else{
					that.$emit('content', index+5);
				}
				
			},
		}
	}
</script>

<style scoped>
	.active {
		background-image: linear-gradient(to right, #ccffff 0%,#ffcc00 100%);
		border-top-right-radius: 50upx;
	}
	.activeb{
		color: #292c33 !important;
	}
	.scroll{
		white-space: nowrap;
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		background: #FFFFFF;
		padding: 20upx 0;
	}
	.con-text-a{
		color: #292c33;
		font-size: 30upx;
		font-weight: bold;
	}
	.con-text-b{
		color: #9EA0A5;
		font-size: 23upx;
	}
	.list-cont{
		width: 180upx;
		display: inline-block;
		text-align: center;
	}
</style>
