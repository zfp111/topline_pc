import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userInfo: JSON.parse(window.localStorage.getItem('userInfo')) || {},
        activeDefalut: ''
    },
    mutations: {
        updata(state, obj) {
            Object.assign(state.userInfo, obj)
            window.localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
        },
        changeActive(state,active) {
            state.activeDefalut = active
        }
    }
})

export default store