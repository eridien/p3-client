
<template>
  <div id="mstatus">
    <div id=table v-if="motors">
      <header id=hdr>
        <div id="pos">target</div>
        <div id="speed">speed</div>
        <div id="accel">accel</div>
        <div id="clk">clk</div>
      </header>
      <template v-for="mot in motors">
         <MotorStatusRow :key="mot.idx" :motIdx="mot.idx" :descr="mot.descr" :hasLimit="mot.hasLimit"/>
      </template>
    </div>
    <div v-else> Loading ...</div>
  </div>
</template>

<script>
import MotorStatusRow from '../components/mot-stat-row.vue'
import {getMotors}    from '../motor.js'
import {motRpc}       from '../websocket.js'

export default {
  name: 'MotorStatusTable',
  components: {
    MotorStatusRow,
  },
  data: function(){ return {
    motors: null,
  }},
  created: function() {
    getMotors().then( (mots) => {this.motors = mots;} );
  }
}
</script>

<style lang="scss" scoped>
  #mstatus {
    text-align: center;
    color: gray;
  }
  #table {
    display: grid;
    grid-template-rows: auto;
    grid-row-gap: 5px;
    
    #hdr {
      display: grid;
      grid-template-columns: [descr]   .5fr  [errFlag]  .2fr  [busy] .2fr 
                             [motorOn] .2fr  [homed]    .35fr [pos]  .4fr
                             [tgtPos]  .25fr [speed]    .25fr [accel]  .25fr  
                             [clk]     .25fr  [home]    .3fr  [move]     .25fr
                             [jogp]    .25fr [jogm]     .25fr  [stop] .25fr 
                             [reset]  .35fr ;
      #pos {
        grid-column: tgtPos;
        // justify-self: left;
        font-size: 14px;
      }
      #speed {
        grid-column: speed;
        // justify-self: left;
        font-size: 14px;
      }
      #accel {
        grid-column: accel;
        // justify-self: left;
        font-size: 14px;
      }
      #clk {
        grid-column: clk;
        // justify-self: left;
        font-size: 14px;
      }
    }
  }
</style>
