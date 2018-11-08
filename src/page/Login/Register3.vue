<template>
  <div id="Register3">
    <mt-header title="等待审核">
      <router-link to="/Register2" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="main">
      <div class="step">
        <ul>
          <li>1.邀请注册</li>
          <li>2.账号绑定</li>
          <li>3.等待审核</li>
        </ul>
      </div>
      <div class="content">
        <div class="first">
          <img src="../../assets/icon_tijaochenggong.png" alt="">
          <p>已提交成功</p>
        </div>
        <div class="second">
          <img src="../../assets/icon_05.png" alt="">
          <p>审核员会根据您拍下的淘宝号自动绑定该账号哦！</p>
        </div>
        <p class="third">审核结果将通知到您的手机短信</p>
        <p class="fourth">预计在{{last_format}}完成审核</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Field } from 'mint-ui'
  import moment from "moment"
  export default {
    data() {
      return {
        last_format: ''
      }
    },
    methods: {
    },
    watch: {},
    mounted() {
      let now = new Date().getTime() + 86400000
      this.last_format = moment(now).format("YYYY/MM/DD HH:mm:ss")
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixin.less";
  #Register3{
    width:100%;
    height: 100vh;
    background: #fff;
    overflow-x: hidden;
    .mint-header{
      background: @red;
      height:1rem;
      .font(0.34rem)
    }
    .main{
      padding: 10px;
      .step{
        ul{
          .flex;
          .font(0.22rem);
          li{
            text-align: center;
            width:30%;
            height:0.5rem;
            line-height: 0.5rem;
            background:url("../../assets/3.png")no-repeat;
            background-size: 100%;
            margin-right: 3%;
            color:#fff;
            &:first-child{
              //color:@gray;
              //background:url("../../assets/2.png")no-repeat;
              background-size: 100%;
            }
            &:nth-child(2){
              //color:@gray;
              //background:url("../../assets/4.png")no-repeat;
              background-size: 100%;
            }
          }
        }
      }
      .content{
        text-align: center;
        .font(0.24rem);
        .first{
          img{
            width: 1.4rem;
            margin: 0.9rem 0 0.2rem;
          }
          color:@red;
        }
        .second{
          color:#999;
          .font(0.26rem);
          margin: 0.4rem 0;
          .flex;
          align-items:flex-start;
          .justify;

          img{
            margin-right: 0.2rem;
          }
        }
        .fourth{
          background: #efefed;
          height:1rem;
          line-height: 1rem;
          margin: 0.3rem 0;
        }
      }
      }
    }
</style>
