<template>
  <div id="Register2">
    <mt-header title="账号绑定">
      <router-link to="/Register" slot="left">
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
        <p class="tit">账号绑定步骤：</p>
        <div class="first">
          <div class="f_1">
            <span>①</span>
            <p>{{taokouling}}</p>
          </div>
          <div class="f_2">
            <p v-clipboard:copy="taokouling"
               v-clipboard:success="onCopy"
               v-clipboard:error="onError">点击复制淘口令，并打开淘宝APP</p>
          </div>
        </div>
        <div class="second">
          <p><span>②</span>用您的淘宝拍下淘口令打开的商品</p>
          <p class="second_2">只需拍下，不用付款！</p>
        </div>
        <div class="third">
          <span>③</span>
          <div style="margin-top:0;height:0.8rem;">
            <mt-field label=""  placeholder="粘贴已拍下的订单号" v-model="captcha" id="target">
              <!--<mt-button @click="pasteOrder" id="data">粘贴</mt-button>-->
            </mt-field>
          </div>
        </div>
        <div class="confirmBtn">
          <p class="confirm"  @click="pushOrderAudit">确定并绑定</p>
        </div>

        <div class="last">
          <img src="../../assets/icon_04.png" alt="">
          <p>系统会根据您拍下的淘宝号自动绑定该账号哦！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast,Field,Button } from 'mint-ui'
  import {getTaoToken,pushOrderAudit} from '@/api/getData'

  export default {
    data(){
      return {
        captcha:'',
        taokouling:'',
        taoTokenId:''
      }
    },
    methods:{
      pasteOrder(){
            var target = document.getElementById("target");
            target.focus();
           document.execCommand('paste');
      },
      //获取淘口令
      async getTaoToken() {
        let param = {};
        const res = await getTaoToken(param);
        if (res.success == true) {
          this.taokouling=res.content.token
          this.taoTokenId=res.content.id
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //提交订单号，绑定淘宝
      async pushOrderAudit() {
        if(this.captcha==null || this.captcha==""){
          Toast({
            message: '请填写订单号',
            iconClass: 'icon icon-fail'
          });
          return
        }
        if(!this.validateOrderNo(this.captcha)){
          return
        }
        let param = {
          taoTokenId: this.taoTokenId,
          orderNo: this.captcha
        };
        const res = await pushOrderAudit(param);
        if (res.success == true) {
          Toast({
            message: res.content.msg,
            iconClass: 'icon icon-success'
          });
          this.goTo('Register3')
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      // 复制成功
      onCopy(e){
        console.log(e);
        Toast({
          message: '复制成功！',
          iconClass: 'icon icon-success'
        });
      },
      // 复制失败
      onError(e){
        console.log("复制失败");
      },
      jump(){
        this.$router.push({name:'Register3'})
      },
      copy(){
        Toast('复制成功');
      },
      goTo(name) {
        this.$router.push({name: name})
      },
      validateOrderNo:function(val){
        if(val.length<18){
          Toast({
            message: '订单号格式不正确！',
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        var myreg = /^\d{18,}$/;
        if (!myreg.test(val)){
          Toast({
            message: '订单号格式不正确！',
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        return true;
      },
    },
    watch:{


    },
    mounted(){
      this.getTaoToken()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixin.less";
  #Register2{
    width:100%;
    height: 100vh;
    .font(0.28rem);
    overflow-x: hidden;
    .mint-header{
      background: @red;
      height:1rem;
      .font(0.34rem);
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
            height: 0.5rem;
            line-height: 0.5rem;
            background:url("../../assets/4.png")no-repeat;
            background-size: 100%;
            margin-right: 3%;
            color:@gray;
            &:first-child{
              color:#fff;
              background:url("../../assets/1.png")no-repeat;
              background-size: 100%;
            }
            &:nth-child(2){
              background:url("../../assets/3.png")no-repeat;
              background-size: 100%;
              color:#fff;
            }
          }
        }
      }
      .content{
        .tit{
          text-align: left;
          color:#333;
          margin-top:0.3rem;
        }
        div{
          margin-top: 0.3rem;
        }
        span{
          margin-right: 0.2rem;
          .font(0.36rem);
        }
        .first{
          .f_1{
            .flex;
            .align;
            p{
              width:90%;
              background: #fff;
              height:0.8rem;
              line-height: 0.8rem;
              padding-left: 0.2rem;
              .round;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }
          }
          .f_2{
            .flex;
            .justify;
            p{
              width:90%;
              height: 0.8rem;
              line-height: 0.8rem;
              text-align: center;
              background: @red;
              color:#fff;
              .round;
            }
          }
        }
        .second{
          line-height:0.8rem;
          .second_2{
            font-size: 0.36rem;
            color:@red;
            font-weight: bold;
            margin-left: 0.5rem;
            margin-bottom: 0.5rem;
          }
        }
        .third{
          line-height:0.8rem;
          margin-top:0;
          .flex;
          .align;
          div{
            width:90%;
            .mint-cell{
              min-height:0.8rem;
              border:none;
            }
            button{
              background: @red;
              color:#fff;
              width: 0.8rem;
            }
          }
        }
        .confirmBtn{
          .flex;
          .justify;
          .confirm{
            height: 0.8rem;
            line-height: 0.8rem;
            background: @red;
            color:#fff;
            width: 80%;
            text-align: center;
            .round;
            margin-top: 0.3rem;
          }
        }

        .last{
          .flex;
          .align;
          margin-top: 0.6rem;
          font-size:0.24rem;
          img{
            margin-right: 0.24rem;
          }
        }
      }
    }

  }
</style>
