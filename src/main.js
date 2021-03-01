import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.config.productionTip = false

import './assets/css/style.css'

new Vue({
	render: h => h(App),
}).$mount('#app')
