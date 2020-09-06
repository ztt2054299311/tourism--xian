<template>
	<view>
		<zy-search
			:is-focus="false"
			:theme="themeClass"
			:show-want="true"
			:speechEngine="speechEngine"
			:hot-list="hotList"
			@getSearchText="getSearchText"
			:dataSource="dataSource"
			@select="handleChange"
		></zy-search>
	</view>
</template>

<script>
import zySearch from '../../components/zy-search/zy-search.vue'
export default {
	components: {
		zySearch
	},
	data() {
		return {
			dataSource:'',
			themeClass: 'block',
			speechEngine: 'baidu', //语音识别引擎
			hotList: ['秦阿房宫','大明宫','兵马俑','华清宫']	,//初始化推荐列表
			outpt:'',
		}
	},
	methods: {
	}
}
</script>

<style></style>
