<template>
  <div id="dialog-mask" @click="$close">
    <div id="message-box">
        <div id="dialog-body">
          <p>{{ content }}</p>
        </div>
        <footer>
          <div id=close>
            (Click anywhere to close.)
          </div>
        </footer>
      </div>
  </div>
</template>

<style lang="scss" scoped>
  #dialog-mask {
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background-color: rgba(0,0,0,.5);

    #message-box {
      position: absolute;
      font-size:14px;
      background-color: white;//#eee;
      border: 1px solid black;
      border-radius: 6px;
      // text-align: center;
      width:300px;
      // left: 50%;
      // margin-left:-100px; // half width (above)
      left: 10px; // debug
      top:20%;

      #dialog-body{
        margin:20px;
      }
      footer{
        color:gray;
        margin:10px 20px;
        #close {
          text-align: center;
        }
      }
    }
  }
</style>
