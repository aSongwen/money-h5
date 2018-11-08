<template>
  <div id="commission" >
    <div class="top">
      <div class="sumMoney">
        <span v-if="routerKey == 2">本金总计(元)</span>
        <span v-if="routerKey == 1">佣金收益(元)</span>
      </div>
      <div class="money">
        <div class="money-left" v-if="routerKey == 1">{{earnCoin}}</div>
        <div class="money-left" v-if="routerKey == 2">{{earnAmount}}</div>
        <div class="money-right" @click="getMoney">提现</div>
      </div>
    </div>
    <div class="mains">
      <!--1、样式控制显示区域高度-->
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <!--使用loadMore组件-->
        <mt-loadmore
          :top-method="loadTop"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          :auto-fill="false"
          @top-status-change="handleTopChange"
          @bottom-status-change="handleBottomChange"
          ref="loadmore">
          <ul>
      <li class="mainContent" v-for="(item,index) in items" v-if="item != null">
        <div class="content">
          <p class="content-left success" v-if="routerKey == 2 && item.financeItemCode==16">本金提现</p>
          <p class="content-left success" v-if="routerKey == 2 && item.financeItemCode==11">本金返现</p>
          <p class="content-left success" v-if="routerKey == 1 && item.financeItemCode==11">佣金返现</p>
          <p class="content-left success" v-if="item.financeItemCode==12">管理员操作</p>
          <p class="content-left success" v-if="item.financeItemCode==13">指定评价佣金</p>
          <p class="content-left success" v-if="item.financeItemCode==14">分佣佣金</p>
          <p class="content-left success" v-if="item.financeItemCode==15">系统奖励</p>
          <p class="content-left success" v-if="routerKey == 1 && item.financeItemCode==17">佣金提现</p>
          <p class="content-left success" v-if="routerKey == 1 && item.financeItemCode==20">投诉扣款佣金</p>
          <p class="content-left success" v-if="routerKey == 2 && item.financeItemCode==20">投诉扣款本金</p>
          <div class="content-center">{{item.auditStatus == 1?'系统处理中':item.auditStatus ==2?'审批成功':item.auditStatus ==3?'审批拒绝':''}}</div>
          <div class="content-right" v-if="routerKey == 1 && item.financeItemCode ==11">{{item.coin}}</div>
          <div class="content-right" v-if="routerKey == 1 && item.coin != null && item.financeItemCode !=11">{{item.coin}}</div>
          <div class="content-right" v-if="routerKey == 2 && item.financeItemCode ==11">{{item.amount}}</div>
          <div class="content-right" v-if="routerKey == 2 && item.amount != null && item.financeItemCode !=11">{{item.amount}}</div>
        </div>
        <div class="content">
          <p class="content-left" v-if="(item.financeItemCode==16||item.financeItemCode==17)&&item.tradingType==3">银行卡:{{item.card}}</p>
          <p class="content-left" v-if="item.financeItemCode==14">徒弟ID:{{item.promoterCode}}</p>
          <p class="content-left" v-if="(item.financeItemCode==16||item.financeItemCode==17)&&item.tradingType==2">微信钱包</p>
          <p class="content-left" v-if="item.financeItemCode==11||item.financeItemCode==13||item.financeItemCode==20">任务号:{{item.taskId}}</p>

        </div>
        <div class="content">
          <p class="content-left">{{item.realTime}}</p>
          <div>余额:{{item.current_amount!=null?item.current_amount:0}}</div>
        </div>
      </li>
          </ul>
        </mt-loadmore>
    </div>
    </div>
  </div>
</template>
<script>
  import { Toast,Spinner ,Loadmore,XHeader} from 'mint-ui';
  import {getStore,setStore,returnFloat} from "../../config/mUtils"
  import {queryPromoterFinance,getFinanceAccount} from '@/api/getData'
  import moment from "moment"
  export default {
    data(){
      return {
        pageNum:1,//当前页数
        pageSize:6,//每页大小
        pageTotal:0,//总条数
        routerKey: '',
        earnCoin: '',
        earnAmount: '',
        items : [],
        list: [],//数据列表
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,
      }
    },
    components: {
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    mounted:function(){
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.getToken();
      this.getParams();
      this.getFinanceAccount();
      this.queryPromoterFinance(this.pageNum,this.pageSize);
    },
    watch :{
      '$route': 'getParams'
    },

    methods:{
      handleTopChange(status) {
        console.log("handleTopChange",status);
        this.topStatus = status;
      },
      handleBottomChange(status) {
        console.log('handleBottomChange ', status);
        this.bottomStatus = status;
      },
      loadTop() {
        console.log('loadTop');
        setTimeout(() => {
          this.items = [];
          this.pageNum = 1;
          this.queryPromoterFinance(this.pageNum,this.pageSize);
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageNum++
          if (this.pageNum <= total) {
            this.queryPromoterFinance(this.pageNum,this.pageSize)
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      async getFinanceAccount() {
        let param = {};
        const res = await getFinanceAccount(param);
        if (res.success) {
          if(res.content != null) {
            this.financeAccount = res.content;
            this.earnCoin = this.returnFloat(this.financeAccount.earnCoin);
            this.earnAmount = this.returnFloat(this.financeAccount.earnAmount);
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      getMoney(){
        var type = null;
        if(this.routerKey == 1){
          type = 1;
        }else{
          type = 2;
        }
        this.$router.push({name:"weChatDeposit",query:{type:type}});
      },

      getParams(){
        this.routerKey = this.$route.query.pushKey;
      },

      countFees(data,index,routerKey){
        var total = 0;
        for(var i = 0 ;i<index;i++){
          if(routerKey==1) {
            total = total + data[i].coinChange;
          }else{
            total = total + data[i].amountChange;
          }
        }
        return total;
      },

      //获取数据
      async queryPromoterFinance(pageNum,pageSize){
        let financeItemType = null;
        if(this.routerKey == 1){
          financeItemType = 1;
        }else{
          financeItemType = 2;
        }
        let param = {"device":"mobile","financeItemType":financeItemType,"pageNum":pageNum,"pageSize":pageSize};
        const res = await queryPromoterFinance(param);
        if (res.success) {
          //获取返回的当前页和总数
          this.pageNum = res.content.page;
          this.pageTotal = res.content.total;
          if(res.content.total != 0 ) {
            var data = res.content.records;
            this.items  =  this.items.concat(data);
            for(var i = 0;i<data.length;i++){
              //设置银行卡
              if (data[i].tradingType == 3) {
                var card = data[i].payeeAccount;
                data[i].card = card.substr(card.length - 4);
              }
              //设置时间
              data[i].realTime = moment(data[i].gmtCreate).format("YYYY/MM/DD HH:mm:ss")
              var coinChange = parseFloat(data[i].coinChange);
              var amountChange = parseFloat(data[i].amountChange);
              if (coinChange != 0){
                data[i].coin = this.returnFloat(coinChange);
                if (data[i].coin > 0){
                  data[i].coin = '+' + data[i].coin;
                }
              }
              if (amountChange!=0){
                data[i].amount = this.returnFloat(amountChange);
                if (data[i].amount > 0) {
                  data[i].amount = '+' + data[i].amount;
                }
              } else {
                data[i].amount = 0;
              }
              if (coinChange != 0 && amountChange != 0){
                var countAll = coinChange + amountChange;
                if (countAll > 0) {
                  countAll = this.returnFloat(countAll);
                  data[i].countAll = '+' + countAll;
                }
              } else if (coinChange == 0) {
                  if(this.routerKey == 1) {
                    data[i].coin = this.returnFloat(data[i].rejectAmount);
                }else{
                    data[i].amount = this.returnFloat(data[i].rejectAmount);
                }
              }
              if(this.routerKey == 1) {
                data[i].current_amount = parseFloat(this.earnCoin) - this.countFees(data,i,this.routerKey);
              }else{
                data[i].current_amount = parseFloat(this.earnAmount) - this.countFees(data,i,this.routerKey);
              }
              data[i].current_amount = data[i].current_amount.toFixed(2);
            }
          }else {

          }
        } else {
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
  body {
    margin: 0;
    background-color: #fafafa;
  }
  ul,li{ padding:0;margin:0;list-style:none};
  .page-loadmore-wrapper {
    overflow: scroll; // 很重要
    -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
  }

  #commission{
    .top{
      height:2.1rem;
      background: #f3f6fe;
      padding:0.3rem 0 0 0.2rem;
      .sumMoney{
        color:#999;
        font-size:0.32rem;
        font-weight:bolder;
        margin-bottom:0.5rem;
      }
      .money{
        .flex;
        .between;
        .align;
        .money-left{
          color:#ff8634;
          font-size:0.64rem;
          margin-left:0.2rem;
        }
        .money-right{
          width:1.2rem;
          height:0.5rem;
          .round(5px);
          background: #f54545;
          text-align:center;
          line-height:0.5rem;
          font-size:0.24rem;
          color:#fff;
          margin-right:0.2rem;
        }
      }
    }
    .mains{
      height:100%;
      background:#fff;
      .mainContent{
        padding:0.34rem 0.2rem 0 0.2rem;
        border-bottom:1px solid #e5e5e5;
        .content{
          .flex;
          .align;
          .between;
          margin-bottom:0.3rem;
          color:#666;
          font-size:0.24rem;
          .content-center{
            color:#377e21;
          }
          .success{
            font-size:0.28rem;
            color:#333;
            font-weight: bolder;
          }
          .content-right{
            color:@org;
          }
        }
      }
    }
  }
</style>
