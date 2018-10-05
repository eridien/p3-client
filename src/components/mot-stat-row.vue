
<template>
  <div class=row>
      <div class="descr">{{ descr }}:</div>
      <div class="error" v-show="status.errMsg">Error: {{status.errMsg}}</div>
      <template v-if="!status.errMsg">
        <div class="errFlag" :class="{error:status.errFlag}">error</div>
        <div class="busy" :class="{true:status.busy}"    >busy</div>
        <div class="motorOn" :class="{true:status.motorOn}" >motorOn</div>
        <div class="homed" :class="{true:status.homed}"   >homed</div>
        <div class="pos" :class="{true:status.homed}">pos: {{status.pos}}</div>
      </template>
      <input class="tgtPos" v-model.number="tgtPos" placeholder="Target Position">
      <button class="home"  @click="home">Home</button>
      <button class="move"   @click="move">Move</button>
      <button class="stop"   @click="stop">Stop</button>
      <button class="reset"  @click="reset">Reset</button>
  </div>
</template>

<script>
  import {motRpc} from '../websocket.js';
  import util     from '../my-utils.js';

  let isDestroyed = false;

  export default {
    name: 'MotorStatusRow',
    props: {
      motIdx:   Number, 
      descr:    String, 
      hasLimit: Boolean
    },
    data: function () {
      return {
        content: 'test',
        tgtPos: 1000,
        status: {
          name:'', errFlag:false, busy:false, motorOn:false, homed:false, pos:0,
        },
      };
    },
    created: async function() {  
      while(!isDestroyed) {
        try {
          this.status = await motRpc('getStatus', this.motIdx);
          await util.sleep(200);
        }
        catch(err) { console.debug(err); }
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
      move: function() {
        motRpc('move', this.motIdx, this.tgtPos).then(()=>{});
      },
      stop: function() {
        motRpc('stop', this.motIdx).then(()=>{});
      },
      reset: function() {
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
                           [tgtPos]  .3fr  [home]     .3fr  [move] .25fr
                           [stop]    .25fr [reset]    .35fr ;
    grid-column-gap: 5px;
  }
  .descr {
    color: black;
    text-align: right;
    grid-column: descr / span 1;
  }
  .errFlag { grid-column: errFlag / span 1; }
  .busy    { grid-column: busy    / span 1; }
  .motorOn { grid-column: motorOn / span 1; }
  .homed   { grid-column: homed   / span 1; }
  .pos {
    color: black;
    text-align: left;
    grid-column: pos / span 1;
  }
  .true { color:green;}
  .error{ color:red;   }
  .tgtPos { 
    width:60px;
    grid-column: tgtPos / span 1;
    justify-self: left;
  }
  .home {
    font-size: 11px;
    width: 50px;
    grid-column: home / span 1;
  }
  .move {
    font-size: 11px;
    width: 40px;
    grid-column: move / span 1;
  }
  .stop {
    font-size: 11px;
    width: 40px;
    grid-column: stop / span 1;
  }
  .reset {
    font-size: 11px;
    width: 40px;
    grid-column: reset / span 1;
  }
</style>
