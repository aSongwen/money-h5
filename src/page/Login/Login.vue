	<template>
  <div id="login">
    <mt-header title="登录">
    </mt-header>
    <div class="loginImg"><img src="../../assets/img_touxiang.png"></div>
    <div class="loginContent">
      <div class="phoneCode phone"><input type="number" placeholder="请输入手机号" v-model="submitForm.phone" oninput="if(value.length>11)value=value.slice(0,11)"></div>
      <div class="phoneCode yzm">
        <input placeholder="请输入验证码"  v-model="submitForm.VerificationCode">
        <img :src="codeImgSrc" alt="${0}" @click="resetCodeImg">
      </div>
      <div class="phoneCode code">
        <input placeholder="请输入短信验证码"  v-model="submitForm.phoneCode">
          <mt-button class="getCode" :disabled="sendMark" @click="sendMobileMessageCode">{{earnCode}}</mt-button>
      </div>

      <mt-button type="danger" style="width:5rem;" @click="toLogin">登录</mt-button>
      <div class="invite">
        <span @click="goTo('Register')">邀请注册</span>
      </div>
    </div>

  </div>
</template>

<script>
  import { Toast,Field,Button } from 'mint-ui'
  import {sendMobileMessageCode,saveGpsInfo} from '@/api/getData'
  import {callPbsApi,callUmsApi} from '@/api/callApi'
  import {getStore,setStore} from "../../config/mUtils"
  import Mint from 'mint-ui'
  import MtButton from "../../../node_modules/mint-ui/packages/button/src/button.vue";
  export default {
    components: {MtButton},
    data(){
      return {
      	randomNo: '',
        codeImgSrc: '',
        sendMark:false,
        mobileCodeTimer:'',
        earnCode:'获取验证码',
        submitForm:{
          phone:null,
          VerificationCode:null,
          phoneCode:null
         }
       }
      },
    methods:{
    	/**
    	 * 校验手机号
    	 */
      checkPhone: function(){
      	var phone = this.submitForm.phone.trim();
      	if(phone == null || phone.length == 0){
      		Toast({
      			message:'请输入手机号!',
      			iconClass:'icon icon-fail'
      		});
      		return false;
      	}
      	var myreg = /^((1)+\d{10})$/;
      	if(!myreg.test(phone)){
      		Toast({
      			message:'手机号有误!',
      			iconClass:'icon icon-fail'
      		});
      		return false;
      	}
      	return true;
      },
      /**
       * 校验图片验证码
       */
      checkVerificationCode: function(){
      	var VerificationCode = this.submitForm.VerificationCode;
      	if(VerificationCode == null || VerificationCode.trim() == null){
      		Toast({
      			message:'请输入图片验证码!',
      			iconClass:'icon icon-fail'
      		});
      		return false;
      	}
      	return true;
      },

      async sendMobileMessageCode() {
        if (!this.checkPhone()) {
          return
        }
        if (!this.checkVerificationCode()) {
          return
        }
        var phone = this.submitForm.phone;
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
        let param = {
          "mobile": phone,
          "platform": 1,
          "type": 2,
          "verificationCode": this.submitForm.VerificationCode,
          "codeKey": this.randomNo
        };
        const res = await sendMobileMessageCode(param);
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
      async resetCodeImg(){
      var codeKey = Math.random()
     	this.codeImgSrc = '/ums/pub/user/v_code?codeKey=' + codeKey
     	this.randomNo = codeKey
      },

      async toLogin() {
        let me = this;

        var map = new AMap.Map('container', {
          resizeEnable: true
        });
        AMap.plugin('AMap.Geolocation', function() {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
//            buttonPosition:'RB',    //定位按钮的停靠位置
//            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
              me.login(result)
            }else{
              let msg = "";
              if (result.message =="Geolocation permission denied.") {
                msg = "为了能更好的为您提供安全服务，请允许授权!"
              } else if(result.message =="Get geolocation time out.") {
                msg = "请求获取位置信息超时，为了能更好的为您提供安全服务，请开启手机定位!"
              } else {
                msg = "系统异常"
              }
              Toast({
                message: msg,
                iconClass: 'icon icon-fail'
              });
            }
          });
        });
      },

      login: function(data){
        let me = this;
      	if (!me.checkPhone()) {
          return
        }
      	var phoneCode = me.submitForm.phoneCode;
      	if(phoneCode == null || phoneCode == ''){
      		Toast({
      			message:'请输入短信验证码!',
      			iconClass:'icon icon-fail'
      		});
      		return
      	}
        let param = {
          "mobile":me.submitForm.phone,
          "applicationId":6,
          "mobileCode":me.submitForm.phoneCode,
          "type":2,
          'latitude': data.position.lat,
          'longitude': data.position.lng,
          'address': data.formattedAddress
        };
        Mint.Indicator.open({//打开loading
          text: '登录中...',
          spinnerType: 'fading-circle'
        });
        callUmsApi('pub/user/login_by_mobile_H5', param, function (res) {
          if(res.data.success) {
            Mint.Indicator.close();
            setStore("access_token", res.data.content.access_token);
            setStore("refresh_token", res.data.content.refresh_token);
            setStore("access_overtime", res.data.content.access_overtime);
            setStore("refresh_overtime", res.data.content.refresh_overtime);
            var date = new Date().getTime();
            var local_access_overtime = date + 3000000;
            var local_refresh_overtime = date + 2592000000;
            setStore("local_access_overtime", local_access_overtime);
            setStore("local_refresh_overtime", local_refresh_overtime);
            me.goTo('Home');
          } else {
            Mint.Indicator.close();
            Toast({
              message: res.data.errmsg,
              iconClass: 'icon icon-fail'
            });
          }
        });
       },

       goTo(name){
        this.$router.push({name:name})
       },
       loadRemoteJs() {
         const s = document.createElement('script');
         s.type = 'text/javascript';
         s.src = 'https://webapi.amap.com/maps?v=1.4.10&key=ea668fcdf51c3f0ccdb16e8c2acbf80b';
         document.body.appendChild(s);
       }
    },
    watch:{


    },
    mounted(){
      this.resetCodeImg();
      var overTime = getStore("access_overtime");
      if(!overTime||overTime==''){
        this.goTo('login');
      }
      var currentTime = new Date().getTime();
      if(currentTime < overTime){
        this.goTo('Home');
      }
      this.loadRemoteJs();
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixin.less";
  @height:0.8rem;
  #login{
    width:100%;
    min-height:100vh;
    background:#f3f6fe;
    overflow-x: hidden;
    .mint-header{
      background: @red;
      height:0.54rem;
      font-size: 0.28rem;
      margin-bottom:0.3rem;
    }
    .loginImg{
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
          width:2rem;
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
        img{
          height:100%;
          width:2rem;
        }
        &:before{
          background:url("../../assets/icon_02.png")  no-repeat top left /0.3rem 0.3rem;
        }
      }
      .code{
        &:before{
          background:url("../../assets/icon_03.png") no-repeat top left/0.3rem 0.3rem;
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
        }
      }

      .invite{
        color:@blue;
        margin-top:0.4rem;
        font-size:0.24rem;
      }

    }
  }
</style>
