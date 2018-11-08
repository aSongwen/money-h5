<template>
  <div id="changeMobile">
   <div class="oldMobile">
     <P>+86</P>
     <P>{{mobile}}</P>
   </div>
    <div class="phoneCode">
      <input type="number" placeholder="请输入验证码" v-model="phoneCode" pattern="\d*"/>
        <mt-button class="getCode" :disabled="sendMark" @click="sendMobileMessageCode">{{earnCode}}</mt-button>
    </div>
    <div class="oldMobile">
      <P>+86</P>
      <input type="number" placeholder="请输入新手机号码" v-model="newMobile" pattern="\d*" oninput="if(value.length>11)value=value.slice(0,11)"/>
    </div>
    <div class="phoneCode">
      <input type="number" placeholder="请输入验证码" v-model="newPhoneCode" pattern="\d*" />
      <mt-button class="getCode" :disabled="sendMark2" @click="checkMobile">{{earnCode2}}</mt-button>
    </div>
    <div class="lastBtn">
      <p @click="changeUserMobile">确认修改</p>
    </div>
  </div>
</template>
<script>
  import { Button,Toast } from 'mint-ui';
  import {sendMobileMessage,checkMobile,changeUserMobile} from '@/api/getData';
  import {getStore,setStore} from "../../config/mUtils"
  export default {
    components: {
      Button
    },
    data(){
      return {
        sendMark:false,
        sendMark2:false,
        earnCode:'获取验证码',
        earnCode2:'获取新手机验证码',
        mobile:'',
        newMobile:'',
        phoneCode:'',
        newPhoneCode:'',
        mobileCodeTimer:{},
        mobileCodeTimer2:{}
      }
    },
    mounted:function(){
     this.mobile = sessionStorage.getItem("mobile");
    },
    methods:{

      /**
       * 校验手机号
       */
      checkPhone: function(){
        if(this.newMobile == null || this.newMobile.length == 0){
          Toast({
            message:'请输入新手机号!',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        var myreg = /^((1)+\d{10})$/;
        if(!myreg.test(this.newMobile)){
          Toast({
            message:'新手机号有误!',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        return true;
      },
      /**
       *
       * 旧手机号获取短信验证码
       */
      async sendMobileMessageCode(){
      this.sendMark = true;
      this.earnCode = '60s';
      let num = 60;
      this.mobileCodeTimer = setInterval(() => {
        num--;
        this.earnCode = `${num}s`;
        if (num == 0) {
          clearInterval(this.mobileCodeTimer);
          this.sendMark = false;
          this.earnCode = '获取验证码';
          return;
        }
      }, 1000);
      let param = {"mobile":this.mobile,"platform":1,"type":4};
        const res = await sendMobileMessage(param);
        if (res.success == true) {
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
          this.earnCode = '获取验证码';
          this.sendMark = false;
          clearTimeout(this.mobileCodeTimer)
        }
      },
      /**
       *
       * 新手机号获取验证码
       */
      async sendMobileMessageCode2(){
        this.sendMark2 = true;
        this.earnCode2 = '60s';
        let num = 60;
        this.mobileCodeTimer2 = setInterval(() => {
          num--;
          this.earnCode2 = `${num}s`;
          if (num == 0) {
            clearInterval(this.mobileCodeTimer2);
            this.sendMark2 = false;
            this.earnCode2 = '获取新手机验证码';
            return;
          }
        }, 1000);
        let param = {"mobile":this.newMobile,"platform":1,"type":4,"beforeMobile":this.mobile};
        const res = await sendMobileMessage(param);
        if (res.success == true) {
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
          this.earnCode = '获取验证码';
          this.sendMark = false;
          clearTimeout(this.mobileCodeTimer2)
        }
      },
      /**
       * 判断手机号是否可用
       */
      async checkMobile(){
        if (!this.checkPhone()) {
          return
        }
        let param = {"mobile":this.newMobile};
        const res = await checkMobile(param);
        if(res.success){
          this.sendMobileMessageCode2();
        }else{
          Toast({
            message:res.errmsg,
            iconClass:'icon icon-fail'
          });
        }
      },
      /**
       * 更改手机号
       */
      async changeUserMobile(){
        if (!this.checkPhone()) {
          return
        }
        if(this.phoneCode == '' || this.phoneCode.trim() == '' || this.newPhoneCode == '' || this.newPhoneCode.trim() == ''){
          Toast({
            message:'请输入短信验证码!',
            iconClass:'icon icon-fail'
          });
          return
        }
        let param = {"oldMobile":this.mobile,"newMobile":this.newMobile,"mobileCode":this.phoneCode,"mobileNewCode":this.newPhoneCode};
        const result = await changeUserMobile(param);
        if(result.success){
          Toast({
            message:result.content,
            iconClass: 'icon icon-success'
          });
          setStore("access_token", '');
          setStore("refresh_token", '');
          setStore("access_overtime", '');
          setStore("refresh_overtime", '');
          setStore("local_access_overtime", '');
          setStore("local_refresh_overtime", '');
          sessionStorage.setItem("display", true);
          sessionStorage.setItem("TabbarSelectIndex",0);
          this.goTo('login');
        }else{
          Toast({
            message:result.errmsg,
            iconClass:'icon icon-fail'
          });
        }
      },
      goTo(name){
        this.$router.push({name:name})
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #changeMobile{
    padding: 0.1rem 0.5rem;
    .font(0.24rem);
    background: #fff;
    .oldMobile{
      margin-top: 0.4rem;
      .flex;
      .align;
      border:1px solid #d7d7d7;
      height:0.8rem;
      line-height: 0.8rem;
      .round;
      color:#333;
      margin-bottom: 0.4rem;
     p{
       height:100%;
       &:first-child{
         width:0.8rem;
         text-align: center;
         border-right: 1px solid #d7d7d7;
       }
       &:last-child{
         margin-left: 0.2rem;
       }
     }
      input{
        height: 0.76rem;
        width:80%;
        border: none;
        .font(0.24rem);
        padding-left: 0.2rem;
      }
    }
    .phoneCode {
      height: 0.8rem;
      width:100%;
      border:1px solid #d7d7d7;
      padding-left: 0.2rem;
      .round;
      .flex;
      input{
        height: 0.76rem;
        width:80%;
        border: none;
        .font(0.24rem);
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
    .lastBtn{
      margin-top: 0.5rem;
      p{
        background: @red;
        color:#fff;
        height:0.8rem;
        line-height: 0.8rem;
        .round;
        text-align: center;
        .font(0.24rem)
      }
    }
  }
</style>
