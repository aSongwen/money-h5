<template>
  <div id="waitReview">
    <div class="waitTop">
      <img src="../../assets/icon_tijaochenggong.png" alt="">
      <p>您的任务等待商家审核</p>
    </div>
    <div class="waitSecond">
      <p><span>①</span>审核付款的店铺和链接是否正确</p>
      <p><span>②</span>审核付款账号的金额是否正确</p>
      <p><span>③</span>核对付款方式以及任务要求是否符合</p>
    </div>
    <div class="waitBtn">
      <p @click="pushHome">知道了</p>
    </div>
  </div>
</template>
<script>
  export default {
    components: {
    },
    data(){
      return {
      }
    },
    mounted:function(){
    },
    methods:{
      pushHome(){
        this.$router.push({name:'Task',query:{"currentTab":1}});
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #waitReview{
    background:@bgmWhite;
    margin-top: 0.2rem;
    overflow: hidden;
    .font(0.24rem);
    .waitTop{
      text-align: center;
      border-bottom: 0.2rem solid @bgmBlue;
      img{
        width: 1rem;
        height:1rem;
        margin: 0.4rem 0 0.2rem;
      }
      color: @red;
      p{
        margin-bottom: 0.4rem;
      }
    }
    .waitSecond{
      background: #f4f4f4;
      margin: 0.4rem 0.5rem 0.5rem;
      padding: 0.4rem 0.2rem;
      color:#666;
      p{
        line-height: 0.6rem;
        span{
          .font(0.28rem);
          margin-right: 0.2rem;
        }
      }
    }
    .waitBtn{
      .flex;
      .justify;
      p{
        width:80%;
        height:0.8rem;
        line-height: 0.8rem;
        .round;
        background: @red;
        color:#fff;
        text-align: center;
      }
    }
  }
</style>
