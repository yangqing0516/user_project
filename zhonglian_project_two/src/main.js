// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入公共css
import "@/styles/common.css";
import '@/styles/resets.css';
Vue.config.productionTip = false;

import axios from 'axios';
Vue.prototype.$axios = axios;
// 引入vant公共样式
import Vant from 'vant';
import 'vant/lib/index.css';
// import '@/styles/index.less';
Vue.use(Vant);
import qs from 'qs';
Vue.prototype.$qs = axios;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
