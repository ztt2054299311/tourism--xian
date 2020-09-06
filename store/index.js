import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: false,
		hasLogin: false,
		userId: ""
	},
	mutations: {
		login(state, userId) {
			state.userId = userId || '新用户';
			state.hasLogin = true;
			state.forcedLogin = false;
		},
		logout(state) {
			state.userId = "";
			state.hasLogin = false;
			state.forcedLogin = true;
		}
	},
	actions:{
		bindLogin(context,userId){
			context.commit("login",userId)
		},
		bindLogout(context){
			context.commit("logout")
		},
	}
})

export default store
