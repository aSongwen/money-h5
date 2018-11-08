<template>
  <div>
    <div id="home">
      <div class="headerTop" @click="pushNotice">
        <div>
          <img src="../../assets/icon_gonggao.png"/>
          <span class="announcement">公告:</span>
        </div>
        <mt-swipe :show-indicators="false" :auto="5000" class="headerSwiper">
          <mt-swipe-item v-for="item in notics" :key="item.id">{{item.title}}</mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="main">
        <div class="mainTop">
          <div class="mainTop-left">
            <img :src="userInfo.headImage" v-if="userInfo!=null">
          </div>
          <div class="mainTop-right" v-if="login">
            <p class="notLogin">
              还没登录？
            </p>
            <p class="login" @click="goToLogin">去登录/注册</p>
          </div>
          <div class="mainTop-right">
            <p class="notLogin">
              <span v-if="userInfo != null">{{userInfo.mobile}}</span>
            </p>
            <p class="idCard"><span v-if="userInfo != null">ID:{{userInfo.code}}</span></p>
          </div>
        </div>
        <div class="mainContent">
          <div class="mainContent-left" @click="toCommission">
            <p class="commission">佣金收益(元)</p>
            <p class="money"><span v-if="financeAccount!=null">{{returnFloat(financeAccount.earnCoin)}}</span></p>
          </div>
          <div class="mainContent-left mainContent-right" @click="pushCommission">
            <p class="commission">本金总计(元)</p>
            <p class="money"><span v-if="financeAccount!=null">{{returnFloat(financeAccount.earnAmount)}}</span></p>
          </div>
        </div>

        <div class="mainSwiper">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in bannerImgs" :key="item.id">
              <img :src="item"/>
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div class="OrdersNum">
        <div class="content today">
          <p>今日已接</p>
          <p><span v-if="taskStatistics!=null">{{taskStatistics.todayCount}}</span>/
            <span v-if="taskStatistics!=null">{{taskStatistics.dayMaxBuys}}</span></p>
        </div>
        <div class="content week">
          <p>7天已接</p>
          <p><span v-if="taskStatistics!=null">{{taskStatistics.weekCount}}</span>/
            <span v-if="taskStatistics!=null">{{taskStatistics.weekMaxBuys}}</span></p>
        </div>
        <div class="content month">
          <p>30天已接</p>
          <p><span v-if="taskStatistics!=null">{{taskStatistics.monthCount}}</span>/
            <span v-if="taskStatistics!=null">{{taskStatistics.monthMaxBuys}}</span></p>
        </div>
      </div>
      <div class="getOrder">
        <img @click="pushOrderSet" src="../../assets/icon_shezhi.png"/>
        <p @click="pushOrderSet">接单设置</p>
        <div class="time"><span v-if="takingStatus">{{callinTime}}</span></div>
      </div>
      <div class="calcTime">
        <div class="calcBtn" @click="getTaking">
          <span class="text" v-if="!takingStatus">接单</span>
          <span class="text" v-if="takingStatus">接单中</span>
        </div>
        <div class="stop" v-if="takingStatus" @click="stopTaking">
          <span class="text">停止</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import { Toast ,MessageBox, Indicator,Swipe, SwipeItem} from 'mint-ui'
  import {getStore,setStore} from "../../config/mUtils"
  import {getBannerFlag,getBanner,getFileUrl,getBgmarkUrl,querySystemMessage,
    loadPromoterInfo,getFinanceAccount,countPromoterTasks,saveGpsDay,grabTask} from '@/api/getData'
  import {addHomeListener,removeListener} from '../../utils/pageStatus'

  export default {
    components: {
    },
    data(){
      return {
        deviceType:null,//设备名称
        userInfo:null,//用户详情
        financeAccount:null,//财务账号
        taskStatistics:null,//接单量统计
        notics: [],//公告
        bannerImgs:[],//轮播图
        bgmarkUrl:null,//水印背景
        login:false,
        takingStatus:false,//接单按钮状态
        takingtime:null,//停止定时器
        callinTime: "00:00:00",//计时时间
        timer: null,//计时时间
      }
    },
    methods:{
     //首页判断跳转
     directToFunc: function () {
       var users = this.userInfo
       if (users != null && users.status == 2) {
         //限制访问页面
         this.goTo("RestrictAccess")
       }
       if (users != null && users.identity != null) {
         if (users != null && users.identity != null && users.identity == 2) {
           if (users.bindStatus == 5) {
             //待审核
             this.goTo("Register3")
             return
           } else if (users.bindStatus == 0 || users.bindStatus == 3) {
             //绑定订单号
             this.goTo("Register2")
             return
           } else if (users.bindStatus == 1 || users.bindStatus == 4) {
             //待同步订单号
             this.goTo("Register3")
             return
           }
         }
       }
       this.countPromoterTasks()
     },
      //查询用户详情
      async loadPromoterInfo() {
        let param = {
          deviceType: this.deviceType,
          headImage: null,
          address: null,
        };
        const res = await loadPromoterInfo(param);
        if (res.success) {
          this.userInfo=res.content;
          this.token.user=res.content;
          sessionStorage.setItem("taobao",res.content.taobao);
          this.directToFunc()
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询用户财务账号
      async getFinanceAccount() {
        let param = {};
        const res = await getFinanceAccount(param);
        if (res.success) {
          if(res.content != null) {
            this.financeAccount = res.content;
            sessionStorage.setItem("earnCoin",this.returnFloat(this.financeAccount.earnCoin));
            sessionStorage.setItem("earnAmount",this.returnFloat(this.financeAccount.earnAmount));
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询用户接单量
      async countPromoterTasks() {
        let param = {
          promoterId: this.userInfo.userId
        };
        const res = await countPromoterTasks(param);
        if (res.success) {
          this.taskStatistics=res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //是否需要拉取banner图
      async getBannerFlag() {
        let param = {};
        const res = await getBannerFlag(param);
        if (res.success) {
          //this.bannerImgs=JSON.parse(getStore("bannerImgs"));
          //判断缓存中是否存在banner图
          //if(this.bannerImgs==null || this.bannerImgs.length<=0 || this.bannerImgs=='null'){
            this.bannerImgs=[]
            this.getBanner();
          //}
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
          this.invitePhone = "";
        }
      },
      //查询banner图
      async getBanner() {
        let param = {
          status:1
        };
        const res = await getBanner(param);
        if (res.success) {
          for(var i=0;i<res.content.length;i++){
            this.getFileUrl(res.content[i].imageUrl)
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //通过id获取文件地址
      async getFileUrl(fileId) {
        let param = {
          fileId:fileId
        };
        const res = await getFileUrl(param);
        if (res.success) {
          this.bannerImgs.push(res.content.fileUrl);
          setStore("bannerImgs",this.bannerImgs);
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询系统公告
      async querySystemMessage() {
        let param = {
          applicationId:6,
          appId:"",
          status:1,
          page: 1,
          pageSize: 4
        };
        const res = await querySystemMessage(param);
        if (res.success) {
          this.notics=res.content.records;
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //上报位置信息
      async saveGpsDay() {
        let param = {
          address:"",
          latitude: "",
          longitude: ""
        };
        const res = await saveGpsDay(param);
        if (res.success) {
          setStore("gpsDay","")
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //获取背景水印图
      async getBgmarkUrl() {
        //水印图片失效时间
        let bgmarkDay = getStore("bgmarkDay");
        let bgmarkUrl = getStore('bgmarkUrl');
        let nowDay = new Date().getTime();
        //未失效使用缓存地址
        if (bgmarkDay && bgmarkUrl && bgmarkDay > nowDay) {
          console.log("水印加载")
          console.log(bgmarkUrl)
          this.bgmarkUrl=bgmarkUrl
          return
        }
        let param = {
          "reload": true,  //忽略后台缓存重新生成图片
          "color": [215, 215, 215], //字体颜色
          "size": 38,      //字体大小,值越小,字体越大
          "density": 40,   //水印密度,值越大越密集
        };
        const res = await getBgmarkUrl(param);

        if (res.success) {
          res.content.backgroupUrl = res.content.backgroupUrl.replace("http", "https");
          var url = res.content.backgroupUrl;
          //url中截取图片失效时间,如果没有默认30天失效
          let expires = 0;
          if (url.indexOf("Expires") > -1) {
            expires = url.substring(url.indexOf("Expires=") + 8);
            if (expires.length >= 10) {
              expires = parseInt(expires.substring(0, 10)) * 1000;
            }
          } else {
            expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
          }
          setStore('bgmarkDay', expires);
          setStore('bgmarkUrl', url);
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      getDeviceType: function () {
        var app=navigator.appVersion;
        // 根据括号进行分割
        var left=app.indexOf('(');
        var right=app.indexOf(')');
        var str=app.substring(left+1,right);
        // console.log(str+'裁剪过后的');
        var Str=str.split(";");
        // 手机型号--苹果 iPhone
        var Mobile_Iphone=Str[0];
        // 手机型号--安卓
        var Mobile_Android=Str[2];
        // 红米手机等特殊型号处理 匹配字符
        var res=/Android/;
        var reslut=res.test(Mobile_Android);
        // 根据设备型号判断设备系统
        if(Mobile_Iphone=='iPhone'){
          this.deviceType=Mobile_Iphone;
          // alert('访问设备型号'+Mobile_Iphone+'系统版本'+Str[1].substring(4,19));
        }else if(Mobile_Iphone=='Linux'){
          if(reslut){
            this.deviceType=Str[4].substring(0,9);
            // alert('访问设备型号'+Str[4].substring(0,9)+'系统版本'+Str[2]);
          }else{
            this.deviceType=Mobile_Android.substring(0,9);
            // alert('访问设备型号'+Mobile_Android.substring(0,9)+'系统版本'+Str[1]);
          }
        }else if(Mobile_Iphone=='iPad'){
          this.deviceType=Str[0];
          // alert('访问设备'+Str[0]+'系统版本'+Str[1].substring(4,12));
        }
        sessionStorage.setItem("deviceType",this.deviceType);
      },
      //接单
      getTaking : function() {
        if(!this.takingStatus) {
          this.grabTask();
          var takingtime = setInterval(() => {
            this.grabTask();
          }, 10000)
          this.takingtime = takingtime
        }
      },
      //调用接单接口
      async grabTask() {
        var bool = this.getToken();
        if (bool == 0) {
          if (this.callinTime == '00:00:00') {
            this.startTime(true)
          }
          this.takingStatus = true
          let param = {};
          const res = await grabTask(param);
          if (res.success) {
            if(res.content!=null){
              this.resetTime()
              this.token.task = res.content
              clearInterval(this.takingtime);
              this.takingStatus=false
              this.$router.push({name:'Send'})
            }
          } else {
            if(res.errmsg!="账号状态异常 ,无法抢单!"){
              this.resetTime()
              this.takingStatus=false
              clearInterval(this.takingtime);
              Toast({
                message: res.errmsg,
                iconClass: 'icon icon-fail'
              });
            }
          }
        } else if (bool == 1) {
          this.takingStatus = true
          this.token.methods.refreshToken();
        } else {
          console.log('未知错误')
        }
      },
      //停止接单
      stopTaking(){
        this.resetTime()
        clearInterval(this.takingtime);
        this.takingStatus=false
      },
      //开始计时
      startTime: function (bolean) {
        let _this = this
        let hour, minute, second
        hour = minute = second = 0
        if (bolean === true) {
          _this.timer = setInterval(function () {
            if (second >= 0) {
              second = second + 1
            }
            if (second >= 60) {
              second = 0
              minute = minute + 1
            }
            if (minute >= 60) {
              minute = 0
              hour = hour + 1
            }
            let hour_time, minute_time, second_time
            hour_time = minute_time = second_time = ''
            if (hour < 10) {
              hour_time='0'+hour
            }else {
              hour_time=hour
            }
            if (minute < 10) {
              minute_time='0'+minute
            }else {
              minute_time=minute
            }
            if (second < 10) {
              second_time='0'+second
            }else {
              second_time=second
            }
            _this.callinTime = hour_time + ':' + minute_time + ':' + second_time
          }, 1000)
        } else {
          window.clearInterval(_this.timer)
        }
      },
      //重置计时
      resetTime: function () {
        window.clearInterval(this.startTime(false))
        let hour, minute, second
        hour = minute = second = 0
        this.callinTime = '00:00:00'
      },
      goTo(name){
        this.$router.push({name:name})
      },
      pushOrderSet(){
        this.$router.push({name:'OrderSet'})
      },
      pushNotice(){
        this.$router.push({name:'Notice'})
      },
      goToLogin(){
        removeStore("access_token")
        this.$router.push({name:'Login'})
      },
      async toCommission(){
        this.$router.push({
          name:'Commission',
          query:{pushKey : 1}
        })
      },
      async pushCommission(){
        this.$router.push({
          name:'Commission',
          query:{pushKey : 2}
        })
      }
    },
    watch:{


    },
    mounted(){
//      document.getElementsByClassName("mintui-back").item(0).style.visibility="hidden"
      addHomeListener()
      this.getToken()
      this.getDeviceType()
      this.loadPromoterInfo()
      this.getFinanceAccount()
      this.getBannerFlag()
      this.querySystemMessage()
      this.getBgmarkUrl()

    },
    //离开当前页面后执行
    destroyed: function () {
      clearInterval(this.takingtime);//停止接单
      removeListener();
    },
  }
</script>

<style lang="less" scoped>
  @import "../../style/mixin.less";
  #home{
    height:calc(100vh - 0.9rem);
    background: @bgmWhite;
    .headerTop{
      height:0.70rem;
      background:#fff;
      overflow-x: hidden;
      .flex;
      .align;
      img{
        width:0.24rem;
        height:0.24rem;
        margin:0 0.1rem 0 0.2rem;
      }
      .announcement{
        font-size:0.24rem;
        color:@gray;
        font-weight:bolder;
      }
      .headerSwiper{
        width: calc(100% - 1.2rem);
        line-height:0.7rem;
        .font(0.24rem);
      }
    }
    .main{
      background:#f54848;
      .mainTop{
        height:1.4rem;
        background: @red;
        padding:0 0.2rem;
        .flex;
        .align;
        .mainTop-left {
          width: 0.9rem;
          height: 0.9rem;
          margin-right:0.3rem;
          .round(50%);
          border:0.04rem solid #dc3232;
          img{
            width:100%;
            .round(50%);
          }
        }
        .mainTop-right{
          color:#fff;
          .notLogin{
            font-size:0.24rem;
            margin-bottom:0.15rem;
          }
          .login{
            font-size:0.28rem;
            color:#f5b647;
          }
          .idCard{
            color:#fff;
            font-size:0.24rem
          }
        }
      }
      .mainContent{
        height:1.3rem;
        background:#f94d4d;
        padding:0.1rem 0;
        .flex;
        .mainContent-left{
          width:50%;
          border-right:1px dashed #fdb8b8;
          text-align:center;
          padding-top:0.1rem;
          .commission{
            color:#fff;
            font-size:0.26rem;
            margin-bottom:0.2rem;
          }
          .money{
            font-size:0.38rem;
            color:#f6f6f6;
          }
        }
        .mainContent-right{
          border-right:0;
        }
      }
      .mainSwiper{
        height:1.8rem;
        img{
          width:100%;
        }
      }
    }
    .OrdersNum {
      background: #fff;
      font-size: 0.18rem;
      color: #fff;
      height: 0.7rem;
      .flex;
      .align;
      .around;
      .content {
        .flex;
        .around;
        .align;
        width: 30%;
        height: 0.4rem;
        .round(0.2rem);
        .font(0.22rem)
      }
      .today {
        background: #23b6fc;
      }
      .week {
        background: #fcb43c;
      }
      .month {
        background: #36d3a6;
      }
    }
    .getOrder {
      padding: 0.3rem 0 0.1rem 0.2rem;
      .flex;
      .align;
      position:relative;
      img {
        width: 0.34rem;
        margin-right: 0.1rem;
      }
      p {
        color: #47a1f5;
        font-size: 0.24rem;
        margin-right: 0.1rem;
      }
      .time {
        font-size: 0.22rem;
        color: #666;
        position:absolute;
        left:50%;
        transform: translateX(-50%);
      }
    }
    .calcTime {
      width: 100%;
      height: 1.6rem;
      .flex;
      .justify;
      position: relative;
      .calcBtn {
        width: 1.6rem;
        height: 1.6rem;
        background: #f54848;
        line-height: 1.6rem;
        text-align: center;
        .round(50%);
        .text {
          color: #fff;
          font-size: 0.36rem;
        }
      }
      .stop {
        width: 0.8rem;
        height: 0.8rem;
        background: #f54848;
        line-height: 0.8rem;
        text-align: center;
        .round(50%);
        position: absolute;
        right: 0.4rem;
        bottom: 0;
        .text {
          color: #fff;
          font-size: 0.24rem;
        }
      }
    }
  }
</style>
