<template>
  <div id="register">
    <mt-header title="邀请注册">
    </mt-header>
    <div class="main">
      <div class="step">
        <ul>
          <li>1.邀请注册</li>
          <li>2.账号绑定</li>
          <li>3.等待审核</li>
        </ul>
      </div>
    </div>
    <div class="loginImg">
      <img src="../../assets/img_touxiang.png">
    </div>
    <div class="loginContent">
      <span v-if="invitePhone!=null && invitePhone!=''" class="tips">您是来自<a class="tipss">"{{invitePhone}}"</a>的邀请注册</span>
      <div class="phoneCode phone">
        <input placeholder="请输入手机号码" type="number" v-model="submitForm.phone" oninput="if(value.length>11)value=value.slice(0,11)" onkeyup="this.value=this.value.replace(/[^\d]/g,'');">
      </div>
      <div class="phoneCode yzm">
        <input placeholder="请输入邀请码" v-model="submitForm.VerificationCode">
          <div class="getCode" @click="realCheckCode">验证邀请码</div>
      </div>
      <div class="phoneCode code">
        <input placeholder="请输入短信验证码" type="number" v-model="submitForm.phoneCode"  onkeyup="this.value=this.value.replace(/[^\d]/g,'');">
          <div class="getCode" @click="checkMobile" v-if="checkCode==false">获取验证码</div>
          <div class="getCode" v-if="checkCode==true">{{countdown}}s</div>
      </div>
      <mt-button type="danger" style="width:5rem;" @click="registerPromoter">确认注册，进入下一步</mt-button>
      <div class="invite">
        <span @click="goTo('login')">已有账号,直接登录！</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast, Field, Button} from 'mint-ui'
  import {realCheckCode, checkMobile, sendMobileMessage, registerPromoter} from '@/api/getData'
  import {setStore} from "../../config/mUtils";

  export default {
    data() {
      return {
        timer:null,
        countdown:60,
        checkCode: false,
        invitePhone: "",//邀请人手机号
        submitForm: {
          phone: null,
          VerificationCode: null,
          phoneCode: null
        }
      }
    },
    methods: {
      /**
       * 判断手机号是否正确
       */
      validatemobile: function () {
        var phone = this.submitForm.phone;
        var that = this;
        if (phone == null || phone.length == 0) {
          Toast({
            message: '请输入手机号',
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        if (phone.length != 11) {
          Toast({
            message: '手机号有误!',
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        var myreg = /^((1)+\d{10})$/;
        if (!myreg.test(phone)) {
          Toast({
            message: '手机号有误',
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        return true;
      },
      /**
       * 判断手机号是否可用
       */
      async checkMobile() {
        if (!this.validatemobile()) {
          return
        }
        let param = {
          mobile: this.submitForm.phone
        };
        const res = await checkMobile(param);
        if (res.success == true) {
          this.sendMobileMessage()
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      /**
       * 获取手机验证码
       */
      async sendMobileMessage() {
        if(this.checkCode!=false){
          return
        }
        this.checkCode=true
        this.timer = setInterval(() => {
          if (this.countdown == 0) {
            this.countdown =60;
            this.checkCode=false
            clearInterval(this.timer);
            return;
          }else {
            this.countdown--;
          }
        }, 1000);
        let param = {
          platform: 1,
          inviteCode:this.submitForm.VerificationCode,
          mobile: this.submitForm.phone,
          type: 1
        };
        const res = await sendMobileMessage(param);
        if (res.success == true) {
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
        } else {
          this.countdown =60;
          this.checkCode=false
          clearInterval(this.timer);//停止计时
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //验证邀请码
      async realCheckCode() {
        var code = this.submitForm.VerificationCode;
        if (!code || code == null || code == '') {
          Toast({
            message: '邀请码不能为空',
            iconClass: 'icon icon-fail'
          });
          return
        }
        let param = {"code": code};
        const res = await realCheckCode(param);
        if (res.success) {
          this.invitePhone = res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
          this.invitePhone = "";
        }
      },
      //注册
      async registerPromoter() {
        if (this.submitForm.VerificationCode == null || this.submitForm.VerificationCode == "") {
          Toast({
            message: '邀请码不能为空',
            iconClass: 'icon icon-fail'
          });
          return;
        }
        if (this.submitForm.phoneCode == null || this.submitForm.phoneCode == "") {
          Toast({
            message: '验证码不能为空',
            iconClass: 'icon icon-fail'
          });
          return;
        }
        if (this.validatemobile()) {
          let param = {
            username: this.submitForm.phone,
            password: this.submitForm.phone,
            rePassword: this.submitForm.phone,
            inviteCode: this.submitForm.VerificationCode,
            mobile: this.submitForm.phone,
            mobileCode: this.submitForm.phoneCode,
            companyName: this.submitForm.phone,
            type: 5,
            registerMethod: 'MOBILE',
          };
          const res = await registerPromoter(param);
          if (res.success) {
            setStore("access_token", res.content.access_token);
            setStore("refresh_token", res.content.refresh_token);
            setStore("access_overtime", res.content.access_overtime);
            setStore("refresh_overtime", res.content.refresh_overtime);
            var date = new Date().getTime();
            var local_access_overtime = date + 3000000;
            var local_refresh_overtime = date + 2592000000;
            setStore("local_access_overtime", local_access_overtime);
            setStore("local_refresh_overtime", local_refresh_overtime);
            this.goTo('Register2')
          } else {
            Toast({
              message: res.errmsg,
              iconClass: 'icon icon-fail'
            });
          }
        }
      },
      goTo(name) {
        this.$router.push({name: name})
      }
    },
    //离开当前页面后执行
    destroyed: function () {
      clearInterval(this.timer);//停止计时
    },
    watch: {},
    mounted() {

    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixin.less";
  @height:0.8rem;
  #register {
    background: #f3f6fe;
    width: 100%;
    min-height:100vh;
    overflow-x: hidden;
    .mint-header {
      background: @red;
      height:0.54rem;
      font-size: 0.28rem;
      margin-bottom:0.3rem;
    }
    .main {
      padding: 0.2rem 0.2rem 0.3rem 0.1rem;
      .step {
        ul {
          .flex;
          font-size: 0.24rem;
          li {
            text-align: center;
            width: 30%;
            height: 0.5rem;
            line-height: 0.5rem;
            background: url("../../assets/4.png") no-repeat;
            background-size: 100%;
            margin-right: 3%;
            color: @gray;
            &:first-child {
              color: #fff;
              background: url("../../assets/1.png") no-repeat;
              background-size: 100%;
            }
          }
        }
      }
    }
    .loginImg {
      margin:0 auto;
      width:1.6rem;
      height:1.6rem;
      .round(50%);
      img{
        width:100%;
        .round(50%);
      }
      background: url("../../assets/img_touxiang.png")no-repeat;
      background-size: 100%;

    }
    .loginContent{
      width:5rem;
      margin:0 auto;
      padding-top:0.2rem;
      .tips{
        font-size:0.24rem;
        text-align:center;
        display: inline-block;
        width:100%;
        color:#666;
        margin-bottom:0.1rem;
        .tipss{
          font-size:0.26rem;
          font-weight:bolder;
        }
      }
      .phoneCode {
        height: 0.8rem;
        width:100%;
        border:1px solid #d7d7d7;
        .round;
        .flex;
        margin-bottom: 0.4rem;
        position:relative;
        &:before{
          content:"";
          width:0.3rem;
          height:0.3rem;
          position:absolute;
          left:0.2rem;
          z-index:2;
          top:32%;
          background-size: 100%;
        }
        input{
          height: 0.76rem;
          width:100%;
          border: none;
          .font(0.24rem);
          padding-left: 0.6rem;
        }
        .getCode {
          background: @red;
          width:3rem;
          height: 0.76rem;
          line-height:0.76rem;
          color: #fff;
          font-size: 0.24rem;
          text-align: center;
        }
        .mint-button--normal{
          padding: 0;
        }
      }
      .yzm{
        &:before{
          background:url("../../assets/icon_06.png") no-repeat top left /0.3rem 0.3rem;
        }
      }
      .code{
        &:before{
          background:url("../../assets/icon_03.png") no-repeat top left /0.3rem 0.3rem;
        }
      }
      .phone{
        &:before{
          content:"";
          width:0.3rem;
          height:0.3rem;
          position:absolute;
          left:0.2rem;
          z-index:2;
          top:32%;
          background:url("../../assets/icon_01.png") no-repeat top left/0.3rem 0.3rem;
          background-size: 100%;
        }
      }

      .invite{
        color:@blue;
        margin-top:0.4rem;
        font-size:0.24rem;
        text-align:center;
      }

    }
  }
</style>
