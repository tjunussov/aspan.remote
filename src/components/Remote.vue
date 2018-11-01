<template lang="pug">
.control
  b-row
    b-col(cols="3")
    b-col(cols="5")
      b-input-group( size="lg")
        b-form-input(v-model.number="ticket" :placeholder="display")
        b-input-group-append
          b-btn( @click="send" :variant="loggedIn?(nextAction=='Занято'?'danger':'success'):''") {{nextAction}}
        b-dropdown(:disabled="!loggedIn" :variant="loggedIn?(nextAction=='Занято'?'danger':'success'):''" slot="append")
          b-dropdown-item-button.text-success(@click="send('Занято',{text:$event.target.innerText,color:'green',badge:1,static:'  Каб '+$root.cabinet})") Открыто
          b-dropdown-item-button.text-success(@click="send('Занято',{text:$event.target.innerText,color:'green',badge:1})") Следующий {{ticket}}
          b-dropdown-item-button.text-danger(@click="send('Открыто',{text:$event.target.innerText,color:'red',badge:2})") Занято
          b-dropdown-item-button.text-danger(@click="send('Открыто',{text:$event.target.innerText,color:'red',badge:2})") Занято, не входить!
          b-dropdown-divider
          b-dropdown-item-button.text-warning(@click="send('Открыто',{text:$event.target.innerText,color:'yellow',badge:2})") Закрыто
          b-dropdown-item-button.text-warning(@click="send('Открыто',{text:$event.target.innerText,color:'yellow',badge:2})") Закрыто - Обед
          b-dropdown-item-button.text-warning(@click="send('Открыто',{text:$event.target.innerText,color:'yellow',badge:2})") Закрыто - Кварцевание
          b-dropdown-item-button.text-warning(@click="send('Открыто',{text:$event.target.innerText,color:'yellow',badge:2})") Закрыто - Технический перерыв
          b-dropdown-item-button(@click="exit") Выйти
    b-col(cols="3")
  b-row
    b-col(cols="3")
    b-col(cols="5")
      b-row.text-muted.text-small
        b-col 
          small Текущее состояние экрана
        b-col.text-right 
          small Следующее действие
    b-col(cols="3")
</template>

<script>
export default {
  name: 'Remote',
  computed:{
    statusText(){
      return this.statusMap[this.display==null?'null':this.display]
    }
  },
  created(){
    this.exit();
  },
  data () {
    return {
      ticket: null,
      loggedIn:false,
      display: '--',
      nextAction: 'Начать',
      statusMap : {
        "null":"Начать",
        "next":"Следующий",
        "busy":"Занято, не беспокоить",
        "na":"Обед",
        "na1":"Кварцевание"
      }
    }
  },
  watch:{
    ticket(val){
      console.log('ticket',val);
      this.display = 'Следующий '+(this.ticket?this.ticket:'');
      this.nextAction = 'Следующий '+(this.ticket?this.ticket:'');
    }
  },
  methods:{
    send(nextAction,msg){
      console.log('send',msg);
      if(!msg){
        if(this.nextAction == 'Начать'){
          this.nextAction = 'Открыто';
          this.loggedIn = true;
        }
        msg = {"text":this.nextAction,"color":this.nextAction=='Занято'?'red':'green',"badge":this.nextAction=='Занято'?2:1,staticState:false};
        this.nextAction = this.nextAction=='Занято'?'Открыто':'Занято';
      } else {
        this.nextAction = nextAction;
      }
      this.ticket = null;      
      this.display = msg.text;
      this.$root.$mqtt.publish('/leds/cabinet'+this.$root.cabinet,JSON.stringify(msg));
    },
    exit(){
      this.send('--',{text:'--',color:'yellow',bagde:0,staticState:true,"static":' Каб '+this.$root.cabinet})
      this.$resetData();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

</style>
