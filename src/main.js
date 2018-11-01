// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import AxiosVue from './services/axios'
// import store from './store'
// import { sync } from 'vuex-router-sync'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import mqtt from 'mqtt'

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




// Object.defineProperty(Vue.prototype, '$mqtt', { value: mqtt });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data () {
    return {
      mqttOnline:false,
      cabinet:3,
      $mqtt:null,
      mqttConf:{'url':'wss://m21.cloudmqtt.com:32930','username':'xgsrcino','password':'fRKZlZtXnshN'}
    }
  },
  created(){
    console.log('created');
    this.mqttConf = ls('mqtt',this.mqttConf);
    this.mqttLogin();
  },
  methods:{
    mqttLogin(){

    this.$mqtt = mqtt.connect(this.mqttConf.url, 
        {
          clientId: 'WebClient-' + parseInt(Math.random() * 100000),
          username:this.mqttConf.username,
          password:this.mqttConf.password
        });
    this.$mqtt.on('connect', ()=>{ this.mqttOnline = true })
    this.$mqtt.on('offline', ()=>{ this.mqttOnline = false })

    },
  },
  components: { App },
  template: '<App/>'
})


function ls(key,default_){
  if(localStorage.getItem(key)){
    return JSON.parse(localStorage.getItem(key))   
  } else {
    localStorage.setItem(key,JSON.stringify(default_));
    return default_;
  }
  
}