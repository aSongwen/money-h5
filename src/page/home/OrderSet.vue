<template>
  <div id="OrderSet" >
    <p class="title">任务金额</p>
    <p class="highMoney">最高金额</p>
    <div class="inputBox">
      <input type="number" disabled v-model="input1"> ~
      <input type="number" v-model="input2">
    </div>
    <div class="inputBox">
      <p @click="savePromoterConfig">保存</p>
    </div>
  </div>
</template>
<script>
  import {getStore,setStore} from "../../config/mUtils"
  import {getPromoterConfig,getBgmarkUrl,savePromoterConfig} from '@/api/getData'
  import { Toast} from 'mint-ui'
  export default {
    components: {
    },
    data(){
      return {
        input1:0,
        input2: '',
        id : '',
        promoterId : '',
        bgmarkUrl:null,//水印背景
      }
    },
    mounted:function(){
     this.getPromoterConfig();
     this.getBgmarkUrl();
    },
    methods:{

      async getPromoterConfig(){
        let param = {};
        const res = await getPromoterConfig(param);
        if(res.success){
          if(res.content){
             this.input2 = res.content.maxTaskMoney;
             this.id = res.content.id;
             this.promoterId = res.content.promoterId;
          }
        }else {
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
          this.bgmarkUrl=bgmarkUrl
          return
        }
        let param = {
          "reload": true,  //忽略后台缓存重新生成图片
          "color": [215, 215, 215], //字体颜色
          "size": 24,      //字体大小,值越小,字体越大
          "density": 18,   //水印密度,值越大越密集
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
      //校验输入的最大值
      checkMax: function(){
     // var myreg = /^(\-|\+)?\d+(\.\d+)?$/;
        var myreg = /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/;

      if((this.input2 != null && this.input2!="") && !myreg.test(this.input2)){
        Toast({
          message: "请输入正确金额",
          iconClass: 'icon icon-fail'
        });
        return false;
      }
      if((this.input2 != null && this.input2!="") && this.input2 ==0){
        Toast({
          message: "最高价不能为零",
          iconClass: 'icon icon-fail'
        });
        return false;
      }
        if ((this.input2 != null && this.input2!="") && (this.input1 != null && this.input1!="")) {
         var min = parseFloat(this.input1);
         var max = parseFloat(this.input2);
          if (min > max) {
            Toast({
              message: "最小金额不能超过最大金额",
              iconClass: 'icon icon-fail'
            });
            return false;
          }
        }
        return true;
  },
      async savePromoterConfig(){
        if(!this.checkMax()){
          return;
        }
        let param = {"id":this.id,"promoterId":this.promoterId,"maxTaskMoney":this.input2,"minTaskMoney":this.input1,"type":1};
        const res = await savePromoterConfig(param);
        if(res.success){
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
          this.$router.push({name:'Home'});
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #OrderSet{
    overflow: hidden;
    background: @bgmWhite;
    padding: 0.3rem 0.2rem;
    height:100vh;
    .title{
      color:#333;
      .font(0.3rem);
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 0.3rem;
    }
    .highMoney{
      .font(0.28rem);
      color:#666;
      padding: 0.3rem 0;
    }
    .inputBox{
      .flex;
      .align;
      .justify;
      input{
        width:2rem;
        height:0.7rem;
        text-align: center;
        border: 1px solid #e5e5e5;
        .round;
        margin:0 0.2rem;
        .font(0.24rem);
        &:first-child{
          background: #d7d7d7;
        }
      }
      p{
        margin-top: 1rem;
        width:80%;
        background: @red;
        height:0.8rem;
        line-height: 0.8rem;
        .round;
        color:#fff;
        font-size: 0.24rem;
        text-align: center;
      }
    }
  }
</style>
