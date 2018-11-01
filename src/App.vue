<template lang="pug">
doctype html

#app

  b-navbar(toggleable="md" fixed="top" type="dark" variant="dark")

    b-nav-toggle(target="nav_collapse")

    b-navbar-brand(to="/")
      img.mr-2(src="./assets/logo.png" height="28")
      | ASPAN

    b-collapse(is-nav id="nav_collapse" v-if="authUser")

      //- b-nav(is-nav-bar)
        //- b-nav-item(to="/foo") Foo
        //- b-nav-item(to="/bar") Bar

        //- b-btn.ml-3 Next

      b-navbar-nav.ml-auto
        b-nav-form
          b-btn(@click="toggleWeather" :variant="interval?'success':''") Метео
          
        //-   b-form-input.mr-sm-2(size="sm" placeholder="Search  ...")

        //- b-nav-item(right to="/help") Help

        //- b-nav-item-dropdown(right v-if="authUser" id="loginPopover")
        //-   template(slot="button-content")
        //-     span(:title="authUser.email") 
        //-   b-dropdown-item(to="/profile") Profile
        //-   b-dropdown-item(@click="logout()")
        //-     span.i.fa.fa-exit.mr-1
        //-     | Signout

        //- b-nav-item(right id="loginPopover" v-else) Login
          
        b-nav-item-dropdown(right v-if="authUser")
          template(slot="button-content")
            span.i.fa.fa-user.mr-2
            span Кабинет {{$root.cabinet}}
          b-dropdown-item(@click="$root.cabinet = 1") Кабинет 1
          b-dropdown-item(@click="$root.cabinet = 2") Кабинет 2
          b-dropdown-item(@click="$root.cabinet = 3") Кабинет 3

  b-container
    router-view

</template>

<script>

import axios from 'axios';

export default {
  name: 'app',
  data(){
    return {
      weather:null,
      interval:null,
      authUser : {
        email:"email@email.com",
        firstName:"User"
      },
      ui:{
        search:null,
        showModalLogin:false
      }
    }
  },
  methods:{
    fetchWeather(){
      axios.get('https://api.weatherlink.com/v1/NoaaExt.json',{params:{user:'001D0A00FADA',pass:'87771107544bi',apiToken:'A1B241527DB14B43BAC5E92A84C5336B'}}
      ).then((resp)=>{
        if(resp.data == 'Invalid Request!') return;
        this.weather = resp.data;
        console.log('weather',this.weather.wind_mph);
        var msg = {"text":`${this.weather.wind_mph} mp/h`,"color":"green","badge":null};
        this.$mqtt.publish('/leds/cabinet'+this.$root.cabinet,JSON.stringify(msg));
      })
    },
    toggleWeather(){
      if(this.interval){
        clearTimeout(this.interval);
        this.interval = null
      } else {
        this.interval = setInterval(this.fetchWeather,10000)
      }
    }
  }
}
</script>

<style lang="stylus">

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

body
  padding-top 3.5rem

</style>
