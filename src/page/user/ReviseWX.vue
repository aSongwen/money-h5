<template>
    <div id="ReviseQQ">
    <p class="ReviseTit" v-if="wechat != null">当前微信号：{{wechat}}</p>
    <div class="reviseInput">
      <input type="text" placeholder="请输入微信号" v-model="ReviseWX" oninput="if(value.length>11)value=value.slice(0,20)">
    </div>
    <div class="lastBtn">
      <p @click="changeUserWechat">保存</p>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui';
  import {changeUserWechat,loadPromoterInfo} from '@/api/getData';
  export default {
    components: {

    },
    data(){
      return {
        wechat:'',
        ReviseWX:'',
        userId:'',
        deviceType:'',
      }
    },
    mounted:function(){
      this.deviceType = sessionStorage.getItem("deviceType");
      this.loadPromoterInfo();
//      if(this.wechat == null) {
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML = '设置微信号';
//      }else{
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML ='修改微信号';
//      }
    },
    methods:{
      async loadPromoterInfo(){
        let param = {"deviceType":this.deviceType,"address":null,"headImage":null};
        const res = await loadPromoterInfo(param);
        if(res.success){
          this.wechat= res.content.wechat;
          this.userId = res.content.userId;
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      /**
       * 校验微信号
       */
      checkWechat:function(){
        if(this.ReviseWX == '' || this.ReviseWX.trim() == ''){
          Toast({
            message:'请输入正确的微信号',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        //emoji表情的验证
        var reg =/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;
        if(reg.test(this.ReviseWX)) {
          Toast({
            message:'请输入正确的微信号',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        return true;
      },

      async changeUserWechat(){
        if(!this.checkWechat()){
          return;
        }
        let param = {"wechat":this.ReviseWX,"userId":this.userId};
        const res = await changeUserWechat(param);
        if(res.success){
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
          this.loadPromoterInfo();
          this.ReviseWX = '';
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
  #ReviseQQ{
    padding: 0.6rem 0.7rem;
    background: #fff;
    text-align: center;
    .ReviseTit{
      .font(0.26rem);
      color:#333;
    }
    .reviseInput{
      margin-top: 0.4rem;
      input{
        width:90%;
        height:0.8rem;
        border: 1px solid #d7d7d7;
        padding: 0 0.2rem;
        .font(0.24rem);
        color:#999;
        .round;
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
