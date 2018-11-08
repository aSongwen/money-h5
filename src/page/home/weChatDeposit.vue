<template>
  <div id="weChatDeposit">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">
        <p class="tit">提到微信钱包</p>
        <p class="tit2">{{wx_deadLine}}</p>
      </mt-tab-item>
      <mt-tab-item id="2">
        <p class="tit">提到银行卡</p>
        <p class="tit2">{{bank_deadLine}}</p>
      </mt-tab-item>
    </mt-navbar>
    <div class="content">
      <div v-if="bankNameCard !='' || selected == 1">
        <div class="first">
          <p v-if="type==1">{{selected==1?'提现佣金':bankNameCard}}</p>
          <p v-if="type==2">{{selected==1?'提现本金':bankNameCard}}</p>
          <div class="first_1"><span>￥</span>
            <input type="number" v-model="enuserMoney">
          </div>
        </div>
        <div class="second" v-if="userInfo !=null && userInfo.identity==1 && userInfo.bindStatus == 2">
          <p v-if="type==1">佣金余额：<span>{{earnCoin}}</span></p>
          <div class="second-1">
            <p v-if="type==2">本金余额：<span>{{earnAmount}}</span></p>
            <p v-if="type==1">当月可提现余额（元）：<span>{{coin}}</span></p>
            <p class="allBtn" @click="getAllMoney">全部提现</p>
          </div>
        </div>
        <div class="second" v-if="userInfo !=null && (userInfo.identity!=1 || userInfo.bindStatus != 2)">
          <div class="second-1">
            <p v-if="type==1">佣金余额：<span>{{earnCoin}}</span></p>
            <p v-if="type==2">本金余额：<span>{{earnAmount}}</span></p>
            <p class="allBtn" @click="getAllMoney">全部提现</p>
          </div>
        </div>
        <div class="third">
          <p @click="pushCode">{{selected==1?'提到微信钱包':'提到银行卡'}}</p>
        </div>
        <div class="detailsBtn">
          <p @click="pushDetails">提现明细</p>
        </div>
      </div>
      <div v-if="bankNameCard == '' && selected ==2" class="fourth">
        <img class="img1" src="../../assets/img_wubangding.png" alt="">
        <p>您还未绑定银行卡，点击下方按钮添加吧</p>
        <img class="img2" src="../../assets/btn_tianjia.png" alt="" @click="pushbindBankCard">
      </div>
      <div class="tips" v-if="selected == 1">
        <p>微信提现说明：</p>
        <p>1.提现金额最低{{minWithdrawAmount}}元；</p>
        <p>2.申请提现后预计会在10分钟内到账；</p>
        <p>3.提现打款至微信钱包（微信钱包需要已通过银行卡实名认证）</p>
      </div>
      <div class="tips" v-else>
        <p>银行卡提现说明：</p>
        <p>1.提现金额最低{{miniBankWithdrawAmount}}元；</p>
        <p>2.申请提现后预计会在8小时左右到账（工作日）；</p>
        <p>3.请确保银行卡开户人姓名和身份证一致，否则将转账失败</p>
      </div>
    </div>
    <div id="loading" v-if="loading">
      <div>
        <img src="../../assets/5-121204193R5-50.gif" alt="">
        <p>提现中...</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { Navbar, TabItem,Toast , MessageBox,Header} from 'mint-ui';
  import {getStore,setStore} from "../../config/mUtils";
  import {getWithdrawFee,getMiniappsNotice,countEnableWithdrawCoin,loadPromoterInfo,withdrawWechatPublic,getBindWechatStatus,promoterWithdraw} from '@/api/getData';
  export default {
    components: {
      Toast
    },
    data(){
      return {
        userInfo:null,
        selected:'1',
        minWithdrawAmount:'',
        fee:'',
        miniBankWithdrawAmount:'',
        type:'',
        wx_deadLine:'',
        bank_deadLine:'',
        coin:'',
        earnCoin:'',
        earnAmount:'',
        deviceType:'',
        bankNameCard:'',
        enuserMoney:'',
        wechat:'',
        loading:false
      }
    },
    mounted:function(){
      this.deviceType = sessionStorage.getItem("deviceType");
      this.earnCoin = sessionStorage.getItem("earnCoin");
      this.earnAmount = sessionStorage.getItem("earnAmount");
      this.getParams();
      this.loadPromoterInfo();
      this.getWithdrawFee();
      this.getMiniappsNotice();
      this.countEnableWithdrawCoin();

    },
    watch :{
      '$route': 'getParams'
    },
    destroyed:function() {
      MessageBox.close(false);
    },
    methods:{
      pushbindBankCard(){
        this.$router.push({name: 'bindBankCard'});
      },

      getParams(){
        this.type = this.$route.query.type;
      },
      pushDetails(){
        let detailsType = null;
        if(this.type == 1){
          detailsType = 1;
        }else{
          detailsType = 2;
        }
        this.$router.push({name: 'depositDetails',query:{detailsType:detailsType}});
      },

      //校验输入提现金额
      checkEnuserMoney : function () {
        if(this.enuserMoney == '' || this.enuserMoney.trim() == '') {
          this.loading = false;
          Toast({
            message: "金额不能为空",
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(!exp.test(this.enuserMoney)){
          this.loading = false;
          Toast({
            message: "金额不正确，请输入正确的金额",
            iconClass: 'icon icon-fail'
          });
          return false;
        }
        if(this.enuserMoney <= 0){
          this.loading = false;
          Toast({
            message: "金额不能小于0",
            iconClass: 'icon icon-fail'
          });
          return false;
        }
       return true;
      },

      async pushCode(){
        this.loading = true
        if(this.selected ==1) {
          let params = {};
          const res1 = await getBindWechatStatus(params);
          if (res1.success) {
            if (res1.content == 0) {
              this.loading = false
              MessageBox.alert('为了您的账号安全，完成微信绑定后，即可提现',{title:"提示"},{confirmButtonText:"绑定"}).then(action => {
                this.$router.push({name: 'bindWeChat', query: {type: this.type}})
              });
            } else {
              if(!this.checkEnuserMoney()) {
                return;
              }
              if(this.enuserMoney < this.minWithdrawAmount ){
                this.loading = false
                Toast({
                  message: "金额不能低于最小额度"+this.minWithdrawAmount+"元",
                  iconClass: 'icon icon-fail'
                });
                return;
              }
              var confirmType = null;
              if (this.type == 1) {
                confirmType = 1;
              } else {
                confirmType = 2
              }
              let param = {"money": this.enuserMoney, "type": confirmType};
              const res = await withdrawWechatPublic(param);
              if (res.success) {
                this.loading = false
                Toast({
                  message: "提现成功",
                  iconClass: 'icon icon-success'
                });
                this.$router.push({name: 'WithdrawalSuccess',query:{"amount":this.enuserMoney,"withdrawalType":1}});
              } else {
                this.loading = false
                if(res.errmsg==null || res.errmsg==""){
                  res.errmsg="提现失败"
                }
                Toast({
                  message: res.errmsg,
                  iconClass: 'icon icon-fail'
                });
              }
            }
          } else {
            this.loading = false
            Toast({
              message: res1.errmsg,
              iconClass: 'icon icon-fail'
            });
          }
        }else {
      //    if (this.bankNameCard == '' || this.bankNameCard.trim().length ==0) {
      //      this.loading = false
      //      MessageBox.confirm('只有先绑定银行卡，才可以提现').then(action => {
      //        this.$router.push({name: 'bindInformation'})
      //      });
      //    } else {
          if(!this.checkEnuserMoney()) {
            return;
          }
          if (this.enuserMoney < this.miniBankWithdrawAmount) {
              this.loading = false
              Toast({
                message: "金额不能低于最小额度" + this.miniBankWithdrawAmount + "元",
                iconClass: 'icon icon-fail'
              });
              return;
            }
            var payeeType = null;
            if (this.type == 1) {
              payeeType = 1;
            } else {
              payeeType = 2
            }
            let data = {"amount": this.enuserMoney, "tradingType": 3, "withdrawType": payeeType};
            const result = await promoterWithdraw(data);
            if (result.success) {
              this.loading = false
              Toast({
                message: "提现成功",
                iconClass: 'icon icon-success'
              });
              sessionStorage.setItem("time",result.content.time);
              this.$router.push({name: 'WithdrawalSuccess',query:{"amount":this.enuserMoney,"withdrawalType":2}});
            } else {
              this.loading = false
              Toast({
                message: result.errmsg,
                iconClass: 'icon icon-fail'
              });
            }
          }
        },

      async getWithdrawFee(){
        let param = {};
        const res = await getWithdrawFee(param);
        if(res.success){
          var data = res.content;
          if(data != null) {
            this.minWithdrawAmount = data.minWithdrawAmount;
            this.fee = data.fee;
            sessionStorage.setItem("fee",this.fee);
            this.miniBankWithdrawAmount = data.miniBankWithdrawAmount;
          }
        }
      },
      async getMiniappsNotice(){
        let param = {"code":"0,1"};
        const res = await getMiniappsNotice(param);
        if(res.success){
          var data = res.content;
          if(data != null){
            this.wx_deadLine = data['0'];
            this.bank_deadLine = data['1'];
          }
        }
      },
      async countEnableWithdrawCoin(){
        let param = {};
        const res = await countEnableWithdrawCoin(param);
        if(res.success){
          var data = res.content;
          if(data != null){
            this.coin = this.returnDouble(data.coin);
          }
        }
      },

      //截取保留两位小数
      returnDouble : function (value) {
        var value = Math.floor(parseFloat(value) * 100) / 100;
        var xsd = value.toString().split(".");
        if (xsd.length == 1) {
          value = value.toString() + ".00";
          return value;
        }
        if (xsd.length > 1) {
          if (xsd[1].length < 2) {
            value = value.toString() + "0";
          }
          return value;
        }
      },
      async loadPromoterInfo(){
        let param = {
          deviceType: this.deviceType,
          headImage: null
        };
        const res = await loadPromoterInfo(param);
        if (res.success) {
          var data = res.content;
          this.userInfo = res.content;
          if(data != null){
            if(data.bankName != '' && data.bankCardNumber != '') {
              this.bankNameCard = data.bankName + "(" + data.bankCardNumber.substring(data.bankCardNumber.length - 4) + ")";
              sessionStorage.setItem("bankNameCard",this.bankNameCard);
            }
            this.wechat = data.wechat;
          }
        }
      },
      async getAllMoney () {
        if (this.type == 1) {
          this.enuserMoney = this.coin;
        }else{
          this.enuserMoney = this.earnAmount;
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #weChatDeposit{
    .mint-navbar{
      .tit,.tit2{
        color:#333;
        .font(0.30rem)
      }
      .tit2{
        .font(0.24rem);
        margin-top: 0.2rem;
      }
    }
    .mint-navbar .mint-tab-item.is-selected {
      border-bottom: 2px solid @red;
      color: #333;
      margin-bottom: -3px;
    }
    .mint-navbar .mint-tab-item{
      padding: 0.2rem 0;
    }
    .content{
      margin-top: 10px;
      background: @bgmWhite;
      padding: 0.2rem;
      .first{
        border-bottom: 1px solid #e5e5e5;
        width:100%;
        p{
          .font(0.3rem);
          color:#666;
          margin-bottom: 0.2rem;
        }
        .first_1{
          .flex;
          .align;
          span{
            .font(0.58rem)
          }
          input{
            height:0.8rem;
            .font(0.3rem);
            border: none;
          }
        }
      }
      .second{
        width:100%;
        .font(0.24rem);
        margin-top: 0.2rem;
        color:#666;
        span{
          color:#333;
          .font(0.28rem);
        }
        div{
          padding: 0.3rem 0;
          .flex;
          .align;
          .between;
        }
        .allBtn{
          color:@blue;
        }
      }
      .third{
        width:100%;
        .flex;
        .justify;
        padding-top: 0.4rem;
        p{
          background: @red;
          color:#fff;
          .font(0.24rem);
          width:70%;
          height:0.8rem;
          text-align: center;
          line-height: 0.8rem;
          .round;
        }
      }
      .fourth{
        width:100%;
        border: 0.01rem solid #e5e5e5;
        .round;
        .flex;
        .align;
        flex-direction: column;
        p{.font(0.3rem);color:#666;margin-top: 0.4rem}
        .img1{
          width:1.6rem;
          height:1.6rem;
          margin-top: 0.4rem;
        }
        .img2{
          width:0.86rem;
          height:0.86rem;
          margin-top: 0.82rem;
          margin-bottom: 0.4rem;
        }
      }
      .detailsBtn{
        margin-top: 0.4rem;
        p{
          display: inline-block;
          color:@blue;
          .font(0.24rem);
          float: right;
        }
      }
      .tips{
        margin-top: 0.9rem;
        color:#333;
        .font(0.24rem);
        p{
          line-height: 0.64rem;
        }
      }
    }
  #loading{
    width:100vw;
    height:100vh;
    position: absolute;
    top:0;
    left:0;
    .flex;
    .align;
    .justify;
    color:#fff;
    div{
      .round(0.1rem);
      .flex;
      .align;
      .justify;
      flex-direction: column;
      width:2rem;
      height:2rem;
      background: rgba(0,0,0,.7);
      p{
        margin-top: 0.3rem;
        .font(0.24rem);
      }
      img{
        width:0.66rem;
        height:0.66rem;
      }
    }
  }
  }
</style>
