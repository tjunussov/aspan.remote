<template lang="pug">
.control
  b-row
    b-col(cols="3")
    b-col(cols="5")
      b-input-group( size="lg")
        b-form-input(v-model.number="ticket" placeholder="Талон")
        b-dropdown(split size="lg" @click="press" :text="status?status:'Начать работу'" slot="append")
          b-dropdown-item-button(@click="next") Следующий
          b-dropdown-item-button(@click="busy") Занято, не беспокоить
          b-dropdown-divider
          b-dropdown-item-button(@click="na('Обед')") Обед
          b-dropdown-item-button(@click="na('Кварцевание')") Кварцевание
          b-dropdown-item-button(@click="na") Технический перерыв
          b-dropdown-item-button(@click="exit") Закрыть смену
    b-col(cols="3")
</template>

<script>
export default {
  name: 'Remote',
  computed:{
    statusText(){
      return this.statusMap[this.status==null?'null':this.status]
    }
  },
  mqtt: {
    'cafe/token': function(msg) {
      this.pay(JSON.parse(msg.toString()))
    },
  },
  data () {
    return {
      ticket: null,
      status: null,
      statusMap : {
        "null":"Начать работу",
        "next":"Следующий",
        "busy":"Занято, не беспокоить",
        "na":"Обед",
        "na1":"Кварцевание"
      }
    }
  },
  watch:{
    status(val){
      console.log('status',val);
      var msg = {"text":val,"color":"red","badge":null};
      this.$mqtt.publish('/leds/cabinet'+this.$root.cabinet,JSON.stringify(msg));
    }
  },
  methods:{
    press(){
      console.log('press');
      this.next();
    },
    next(){
      this.status = 'Следующий'+(this.ticket?this.ticket:'');
      if(this.ticket) this.ticket += 1;
    },
    busy(){
      this.status = 'Занято';
    },
    na(txt){
      this.status = txt;
    },
    exit(){
      this.status = '';
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2
    font-weight normal

ul
    list-style-type none
    padding 0

li
    display inline-block
    margin 0 10px

a
    color #42b983
</style>
