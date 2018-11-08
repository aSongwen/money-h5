<template>
  <div id="RestrictAccess">
    <mt-header title="限制访问" id="title_text">
    </mt-header>
    <div class="content">
      <img src="../../assets/img_xianzhifangwen.png" alt="">
      <p class="first">限制访问</p>
      <p>您严重违反平台规则，管理员暂时冻结您的账户</p>
      <p>具体情况请联系管理员处理</p>
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
  #RestrictAccess{
    background: #fff;
    overflow-x: hidden;
    height:calc(100vh);
    .mint-header{
      background-image: linear-gradient(to left, #fd2f53,#ff514f);
      height:0.64rem;
      font-size: 0.17rem;
      position:fixed;
      top:0;
      left:0;
      width:100%;
      z-index:999;
      .mint-header-title{
        height:0.64rem;
        line-height:0.64rem;
      }
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
