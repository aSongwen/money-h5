<template>
  <div id="IsWeixin">
    <mt-header title="限制访问">
    </mt-header>
    <div class="content">
      <img src="../../assets/img_xianzhifangwen.png" alt="">
      <p class="first">请在微信中打开此应用</p>
    </div>
  </div>
</template>
<script>
  export default {

    data(){
      return {

      }
    },
    mounted:function(){

    },


    methods:{

    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #IsWeixin{
    background: #fafafa;
    overflow-x: hidden;
    .mint-header{
      background-image: linear-gradient(to left, #fd2f53,#ff514f);
      height:0.64rem;
      font-size: 0.17rem;
      position:fixed;
      top:0;
      left:0;
      width:100%;
      z-index:999;
    }
    .content{
      text-align: center;
      margin-top: 0.64rem;
      img{
        width:1.24rem;
        height:1.24rem;
        margin: 1rem 0;
      }
      p{
        .font(0.24rem);
        color:#666;
        margin-bottom: 0.3rem;
      }
      .first{
        .font(0.3rem);
        color:#333;
        font-weight: bold;
        margin-bottom: 0.4rem;
      }
    }
  }
</style>
