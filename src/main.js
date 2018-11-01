// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import AxiosVue from './services/axios'
import VueMqtt from 'vue-mqtt';
// import store from './store'
// import { sync } from 'vuex-router-sync'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueMqtt, 'wss://m21.cloudmqtt.com:32930', {clientId: 'WebClient-' + parseInt(Math.random() * 100000),username:'xgsrcino',password:'fRKZlZtXnshN'});

Vue.use(BootstrapVue)
Vue.use(AxiosVue)

// Mocking Service
import '@/store/api/mock'
// sync(store, router)

Vue.config.productionTip = false

// Global Functions
Vue.mixin({
  methods: {
    $resetData: function (emit) {
      console.log('reset global data =', this.$options.name)
      // reset data()
      Object.assign(this.$data, this.$options.data.call(this));
      if((emit !==null && emit) || ( emit == null)) this.$emit('reset',null) /// CAUTION! May Interefere with other local events
    },
    $_clone: function (val) {
      return Object.assign({},val);
    },
    $: function (id) {
      return document.querySelector(id)
    },
    $ArrayRemoveElement(arr,item){
      let index = arr.indexOf(item);
      if(index !== -1) {
        arr.splice(index, 1);
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data () {
    return {
      mqttOnline:false,
      cabinet:3
    }
  },
  created(){
    console.log('created');
    this.$mqtt.on('connect', ()=>{ this.mqttOnline = true })
    this.$mqtt.on('offline', ()=>{ this.mqttOnline = false })
  },
  beforeDestroy(){
    this.$mqtt.off('connect', ()=>{ this.mqttOnline = true })
    this.$mqtt.off('offline', ()=>{ this.mqttOnline = false })
  },
  components: { App },
  template: '<App/>'
})
