<template>
  <div id="bindInformation">
    <div class="bindItem" @click="pushChangeMobile">
      <p>手机号</p>
      <p>{{data.mobile==''?'还未绑定':data.mobile==null?'还未绑定':data.mobile}}</p>
    </div>
    <div class="bindItem">
      <p>旺旺号</p>
      <p>{{data.taobao}}</p>
    </div>
    <div class="bindItem" @click="pushBindIdCard">
      <p>身份证号</p>
      <p v-if="data.idCardNumber == '' || data.idCardNumber == null " style="color:#47a1f5">还未绑定</p>
      <p v-else>{{data.idCardNumber }}</p>
    </div>
    <div class="bindItem" @click="pushBindBankCard">
      <p>银行卡</p>
      <p v-if="data.bankCardNumber == '' || data.bankCardNumber == null " style="color:#47a1f5">还未绑定</p>
      <p v-else>{{data.bankCardNumber}}</p>
    </div>
    <div class="bindItem" @click="pushReviseQQ">
      <p>QQ</p>
      <p v-if="data.qq == '' || data.qq == null " style="color:#47a1f5">还未绑定</p>
      <p v-else>{{data.qq}}</p>
    </div>
    <div class="bindItem" @click="pushReviseWX">
      <p>微信</p>
      <p v-if="data.wechat == '' || data.wechat == null " style="color:#47a1f5">还未绑定</p>
      <p v-else>{{data.wechat}}</p>
    </div>
  </div>
</template>
<script>
  import {loadPromoterInfo} from '@/api/getData';
  import {Toast,MessageBox} from 'mint-ui'
  export default {
    data(){
      return {
        deviceType:'',
        data:'',
      }
    },
    mounted:function(){
      this.deviceType = sessionStorage.getItem("deviceType");
      this.loadPromoterInfo();
    },
    destroyed:function() {
      MessageBox.close(false);
    },
    methods:{
      async loadPromoterInfo(){
        let param = {"deviceType":this.deviceType,"headImage":null};
        const res = await loadPromoterInfo(param);
        if(res.success){
            this.data = res.content;
            sessionStorage.setItem("mobile",this.data.mobile);
            sessionStorage.setItem("idCardNumber",this.data.idCardNumber);
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      pushChangeMobile(){
        this.$router.push({name:'changeMobile'});
      },
      pushBindBankCard(){
        if(!this.data.idCardNumber){
          MessageBox.alert('您还未绑定身份证，绑定身份证后，才能绑定银行卡').then(action => {
            this.$router.push({name: 'bindIdCard'})
          });
        }else {
          this.$router.push({name: 'bindBankCard'})
        }
      },
      pushReviseQQ(){
        this.$router.push({name:'ReviseQQ'})
      },
      pushReviseWX(){
        this.$router.push({name:'ReviseWX'})
      },
      pushBindIdCard(){
        this.$router.push({name:'bindIdCard'})
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #bindInformation{
    background: #fff;
    padding:0 0.2rem;
    .bindItem{
      .flex;
      .between;
      .align;
      height:0.9rem;
      border-bottom: 1px solid #e5e5e5;
      position: relative;
      p{
        .font(0.26rem);
        color:#666;
        &:last-child{
          color:#333;
          padding-right: 0.35rem;
        }
      }
      &:first-child ::before,&:nth-child(4)::before,&:nth-child(5)::before,&:nth-child(6)::before{
        content:'';
        width:0.15rem;
        height:0.15rem;
        border-top: 1px solid #666;
        border-right: 1px solid #666;
        position: absolute;
        right:0.05rem;
        top:0.35rem;
        transform:rotate(45deg);
        -ms-transform:rotate(45deg); 	/* IE 9 */
        -moz-transform:rotate(45deg); 	/* Firefox */
        -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
        -o-transform:rotate(45deg); 	/* Opera */
      }
    }
  }
</style>
