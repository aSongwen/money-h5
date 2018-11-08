<template>
  <div id="depositDetails" >
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
    <ul v-for="(item,index) in items" v-if="item != null">
      <li>
        <div class="first">
          <p v-if="detailsType == 1">佣金提现</p>
          <p v-if="detailsType == 2">本金提现</p>
          <p >{{item.status == 1?'系统处理中':item.status ==2?'':item.status ==3?'审核未通过':''}}</p>
          <span>{{item.amount}}</span>
        </div>
        <p class="second" v-if="item.tradingType==2">微信钱包</p>
        <p class="second" v-if="item.tradingType==3">银行卡{{item.card}}</p>
        <p class="third">{{item.realTime}}</p>
      </li>
    </ul>
      </mt-loadmore>
    </div>
  </div>
</template>
<script>
  import { Toast,Spinner ,Loadmore,XHeader} from 'mint-ui';
  import {queryPromoterFinanceCert} from '@/api/getData';
  import moment from "moment"
  export default {
    components: {
    },
    data(){
      return {
        pageNum:1,//当前页数
        pageSize:6,//每页大小
        pageTotal:0,//总条数
        detailsType:'',
        items:[],
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
      this.getParams();
      this.queryPromoterFinanceCert(this.pageNum,this.pageSize);
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
          this.queryPromoterFinanceCert(this.pageNum,this.pageSize);
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageNum++
          if (this.pageNum <= total) {
            this.queryPromoterFinanceCert(this.pageNum,this.pageSize)
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      getParams(){
        this.detailsType = this.$route.query.detailsType;
      },
      async queryPromoterFinanceCert(pageNum,pageSize){
        let withdrawType = null;  //提现类型，1:佣金提现，2:本金提现
        if(this.detailsType == 1){
          withdrawType = 1;
        }else{
          withdrawType = 2;
        }
        let param = {"pageNum":pageNum,"pageSize":pageSize,"withdrawType":withdrawType};
        const res = await queryPromoterFinanceCert(param);
        if(res.success){
          this.pageNum=res.content.page;
          this.pageTotal=res.content.total;
          var data = res.content.records;
          if(data != null){
            this.items  =  this.items.concat(data);
            this.items.forEach(obj => {
              if (obj.payeeAccount) {
                obj.card = obj.payeeAccount.substring(obj.payeeAccount.length - 4);
              }
              obj.realTime = moment(obj.gmtCreate).format("YYYY/MM/DD HH:mm:ss")
            })
          }else {

          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      }
    },
    watch:{
      "$route":"getParams"
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
  #depositDetails{
    background: #fff;
    ul{
      padding: 0 0.2rem;
      li{
        border-bottom: 1px solid #e5e5e5;
        padding: 0.34rem 0;
        .first{
          .flex;
          .between;
          font-weight: bold;
          margin-bottom: 0.4rem;
          .font(0.28rem);
          p{
            color:#333;
          }
          span{
            color:@org;
            .font(0.28rem);
          }
          .status{
            color:#333;
            font-weight: 100;
          }
          .status1{
            color:#377e21;
            font-weight: 100;
          }
          .status2{
            color:@red;
            font-weight: 100;
          }
        }
        .second{
          color:#666;
          .font(0.24rem)
        }
        .third{
          margin-top: 0.3rem;
          .font(0.24rem)
        }
      }
    }

  }
</style>
