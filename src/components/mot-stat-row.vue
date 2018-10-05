
<template>
  <div class=row>
      <div class="descr">{{ descr }}:</div>
      <div class="error" v-show="showError">{{errMsg}}</div>
      <template v-if="!showError">
        <div class="errFlag" :class="{error:status.errFlag}">error</div>
        <div class="busy" :class="{true:status.busy}"    >busy</div>
        <div class="motorOn" :class="{true:status.motorOn}" >motorOn</div>
        <div class="homed" :class="{true:status.homed}"   >homed</div>
        <div class="pos" :class="{true:status.homed}">pos: {{status.pos}}</div>
      </template>
      <input class="tgtPos" v-model.number="tgtPos" placeholder="Enter">
      <input class="speed" v-model.number="speed" placeholder="Default">
      <input class="accel" v-model.number="accel" placeholder="Default">
      <button class="home"  @click="home">Home</button>
      <button class="move"  @click="move">Move</button>
      <button class="jogp"  @click="jogp">Jog+</button>
      <button class="jogm"  @click="jogm">Jog-</button>
      <button class="stop"  @click="stop">Stop</button>
      <button class="reset" @click="reset">Reset</button>
  </div>
</template>

<script>
  import {motRpc} from '../websocket.js';
  import util     from '../my-utils.js';

  let isDestroyed = false;
  const accelTable = [0, 8000, 16000, 24000, 32000, 40000, 50000, 60000];

  export default {
    name: 'MotorStatusRow',
    props: {
      motIdx:   Number, 
      descr:    String, 
      hasLimit: Boolean
    },
    data: function () {
      return {
        showError: false,
        errMsg: '',
        tgtPos: 1000,
        speed:  2000,
        accel:     4,
        status: {
          name:'', errFlag:false, busy:false, motorOn:false, homed:false, pos:0,
        },
      };
    },
    created: async function() {  
      while(!isDestroyed) {
        try { this.status = await motRpc('getStatus', this.motIdx); }
        catch(err) {
          this.errMsg = err.message;
          this.showError = true;
        };
        await util.sleep(200);
      }
    },
    destroyed: () => {
      isDestroyed = true;
    },
    methods: {
      home: function() {
        if(this.hasLimit)
          motRpc('home', this.motIdx).then(()=>{});
        else
          motRpc('fakeHome', this.motIdx).then(()=>{});
      },
      getAccel: function() {
        let accel;
        if(this.accel < 8) accel = this.accel;
        else {
          accel = 7;
          accelTable.some( (a, idx) => {
            if(this.accel < a) { accel = idx-1; return true; }});
        }
        return accel;
      },
      move: function() {
        motRpc('move', this.motIdx, this.tgtPos, this.speed, this.getAccel()).then(()=>{});
      },
      jogp: function() {
        motRpc('jog', this.motIdx, 1, this.tgtPos).then(()=>{});
      },
      jogm: function() {
        motRpc('jog', this.motIdx, 0, this.tgtPos).then(()=>{});
      },
      stop: function() {
        motRpc('stop', this.motIdx).then(()=>{});
      },
      reset: function() {
        this.showError = false;
        motRpc('reset', this.motIdx).then(()=>{});
      },
    }
  }
</script>

<style lang="scss" scoped>
  .row {
    font-size: 13px;
    display: grid;
      grid-template-columns: [descr]   .5fr  [errFlag]  .2fr  [busy] .2fr 
                             [motorOn] .2fr  [homed]    .35fr [pos]  .4fr
                             [tgtPos]  .25fr [speed]    .25fr [accel]  .25fr  
                             [home]    .3fr  [move]     .25fr
                             [jogp]    .25fr [jogm]     .25fr  [stop] .25fr 
                             [reset]  .35fr ;
    grid-column-gap: 5px;
    .descr {
      color: black;
      text-align: right;
      grid-column: descr ;
    }
    .error   { grid-column: errFlag/tgtPos ; }
    .errFlag { grid-column: errFlag ; }
    .busy    { grid-column: busy; }
    .motorOn { grid-column: motorOn ; }
    .homed   { grid-column: homed   ; }
    .pos {
      color: black;
      text-align: left;
      grid-column: pos ;
    }
    .true { color:green;}
    .error{ color:red;   }
    .tgtPos { 
      width:45px;
      grid-column: tgtPos ;
      justify-self: left;
    }
    .speed { 
      width:45px;
      grid-column: speed ;
      justify-self: left;
    }
    .accel { 
      width:45px;
      grid-column: accel ;
      justify-self: left;
    }
    .home {
      font-size: 11px;
      width: 50px;
      grid-column: home ;
    }
    .move {
      font-size: 11px;
      width: 40px;
      grid-column: move ;
    }
    .jogp {
      font-size: 11px;
      width: 40px;
      grid-column: jogp ;
    }
    .jogm {
      font-size: 11px;
      width: 40px;
      grid-column: jogm ;
    }
    .stop {
      font-size: 11px;
      width: 40px;
      grid-column: stop ;
    }
    .reset {
      font-size: 11px;
      width: 45px;
      grid-column: reset ;
    }
  }
</style>
