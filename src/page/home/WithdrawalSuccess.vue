<template>
  <div id="WithdrawalSuccess">
    <div class="first">
      <div class="left">
        <img src="../../assets/msg_icon_01.png" alt="">
        <div class="border1"></div>
        <img src="../../assets/msg_icon_02.png" alt="">
        <div v-if="withdrawalType == 1" class="border1"></div>
        <div class="border2" v-else></div>
        <img v-if="withdrawalType == 1" src="../../assets/msg_icon_03.png" alt="">
        <img src="../../assets/msg_icon_05.png" alt="" v-else>
      </div>
      <div class="right">
        <p>发起提现申请</p>
        <div>
          <p>系统处理中</p>
          <span v-if="withdrawalType == 2">预计{{ date| dateformat('YYYY-MM-DD HH:mm:ss')}}钱到账</span>
        </div>
        <p>到账成功</p>
      </div>
    </div>
    <div class="second">
      <div>
        <p>提现金额</p>
        <p>￥{{amount}}</p>
      </div>
      <div>
        <p>手续费</p>
        <p>￥{{free}}</p>
      </div>
      <div>
        <p>到账方式</p>
        <p v-if="withdrawalType == 2">{{bankNameCard}}</p>
        <p v-if="withdrawalType == 1">微信钱包</p>
      </div>
    </div>
    <div class="lastBtn">
      <p @click="confirm">确定</p>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        date:0,
        free:'',
        amount:'',
        bankNameCard:'',
        status:3,
        withdrawalType:'',
      }
    },
    mounted:function(){
      this.getParams();
      if(this.withdrawalType == 2){
        var time =  parseInt(sessionStorage.getItem("time"));
        this.date =  (time + 7200000);
        this.bankNameCard = sessionStorage.getItem("bankNameCard");
      }
      this.free = sessionStorage.getItem("fee");
    },
    methods:{
      getParams(){
        this.amount = this.$route.query.amount;
        this.withdrawalType = this.$route.query.withdrawalType;
      },

      confirm(){
        this.$router.push({name:'Home'});
      }
    },
    watch :{
      '$route': 'getParams'
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #WithdrawalSuccess{
    background: @bgmWhite;
    .first{
      padding: 0.4rem 0;
      border-bottom: 0.2rem solid @bgmBlue;
      .flex;
      .left{
        width:15%;
        .flex;
        flex-direction: column;
        .align;
        img{
          width:0.48rem;
          height:0.48rem;
        }
        .border1{
          width:0.04rem;
          height:1rem;
          background: @red;
        }
        .border2{
          width:0.04rem;
          height:1rem;
          background: #ccc;
        }

      }
      .right{
        width:80%;
        p{
          .font(0.3rem);
          color:#333;
          margin-bottom: 1.05rem;
          &:last-child{
            margin-bottom: 0.2rem;
          }
        }
        div{
          margin-bottom: 0.65rem;
          p{
            margin-bottom: 0.2rem;
          }
          span{
            color:#666;
            .font(0.24rem);
          }
        }
      }
    }
    .second{
      padding:0.3rem 0.2rem;
      .font(0.26rem);
      color:#666;
      div{
        .flex;
        .between;
        margin-bottom: 0.3rem;
        color:#666;
        .font(0.26rem);
      }
    }
    .lastBtn{
      margin-top: 0.2rem;
      padding:0 12%;
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
