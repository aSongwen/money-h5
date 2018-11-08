<template>
  <div id="ReviseQQ">
   <p class="ReviseTit" v-if="QQ != null">当前QQ号：{{QQ}}</p>
    <div class="reviseInput">
      <input type="number" placeholder="请输入QQ号" v-model="reviseQQ" onkeyup="this.value=this.value.replace(/[^\d]/g,'')" oninput="if(value.length>11)value=value.slice(0,15)"/>
    </div>
    <div class="lastBtn">
      <p @click="changeUserQQ">保存</p>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui';
  import {changeUserQQ,loadPromoterInfo} from '@/api/getData';
  export default {
    data(){
      return {
        QQ:'',
        reviseQQ:'',
        userId:'',
        deviceType:'',
      }
    },
    mounted:function(){
      this.deviceType = sessionStorage.getItem("deviceType");
      this.loadPromoterInfo();
//      if(this.QQ == null) {
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML = '设置QQ';
//      }else{
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML ='修改QQ';
//      }
    },
    methods:{

      async loadPromoterInfo(){
        let param = {"deviceType":this.deviceType,"address":null,"headImage":null};
        const res = await loadPromoterInfo(param);
        if(res.success){
          this.QQ= res.content.qq;
          this.userId = res.content.userId;
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },

      /**
       * 校验qq号
       */
      checkQQ:function(){
        if(this.reviseQQ == null || this.reviseQQ.trim() == null){
          Toast({
            message:'请输入正确的qq号',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        var reg =/^\d{5,15}$/;
        if(!reg.test(this.reviseQQ)){
          Toast({
            message:'请输入正确的qq号',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        return true;
      },

      async changeUserQQ(){
        if(!this.checkQQ()){
          return;
        }
        let param = {"qq":this.reviseQQ,"userId":this.userId};
        const res = await changeUserQQ(param);
        if(res.success){
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
          this.loadPromoterInfo();
          this.reviseQQ = '';
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
