<template>
  <div id="StatisticsDetails">
    <div class="detailsTop">
      <div class="first">
        <p>{{data.realName}}</p>
        <p>ID:{{data.code}}</p>
      </div>
      <div class="second">
        <p @click="popupDatePicker">{{isDate}}</p>
        <mt-popup
          v-model="popupVisible"
          position="bottom">
          <mt-picker :slots="slots" class="BankPicker" @change="onValuesChange" ref="picker"></mt-picker>
        </mt-popup>
      </div>
      <div class="first">
        <p>任务总数</p>
        <p>{{pageTotal}}</p>
      </div>
    </div>
    <div class="detailsLists">
      <div class="first">
        <p>任务时间</p>
        <p>任务号</p>
      </div>
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
          <div class="second" v-for="(item,index) in items" >
            <p>{{item.realStartTime | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
            <p>{{item.id}}</p>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
  import { Toast,Spinner ,Loadmore,XHeader } from 'mint-ui';
  import {loadPromoterInfo,queryMini} from '@/api/getData'
  export default {
    data(){
      return {
        pageNum:1,//当前页数
        pageSize:20,//每页大小
        pageTotal:'',//总条数
        data:'',
        promoterId:'',
        list: [],//数据列表
        items:[],
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,
        popupVisible:false,
        slots: [
          {
            flex: 1,
            values: [ '2017年', '2018年', '2019年', '2020年','2021年','2022年','2023年'],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        isDate:'',
      }
    },
    components: {
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    mounted:function(){
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.isDate = this.getFormatDate(sessionStorage.getItem("date"));
      var arry = this.isDate.split("年");
      this.$refs.picker.setValues([arry[0]+'年',arry[1]]);
      this.getParams();
      this.loadPromoterInfo();
    //  this.queryMini(this.pageNum,this.pageSize);
      },
    methods: {
      popupDatePicker(){
        this.popupVisible = true;

      },
      onValuesChange(picker, values) {
        this.isDate = values[0] + values[1];
        this.pageNum=1
        this.items=[]
        this.queryMini(this.pageNum,this.pageSize);
      },

      handleTopChange(status) {
        console.log("handleTopChange", status);
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
          this.queryMini(this.pageNum, this.pageSize);
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize - 1) / this.pageSize;
          this.pageNum++
          if (this.pageNum <= total) {
            this.queryMini(this.pageNum, this.pageSize)
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      getParams() {
        this.promoterId = this.$route.query.promoterId;
      },

      async loadPromoterInfo() {
        let param = {"promoterId": this.promoterId};
        const res = await loadPromoterInfo(param);
        if (res.success) {
          this.data = res.content;
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      async queryMini(pageNum,pageSize) {
        let array = this.getMonthScope(this.isDate);
        let param = {
        "page": pageNum,
          "limit": pageSize,
          "promoterId": this.promoterId,
         "realStartTimeStart":array[0],
          "realStartTimeEnd":array[1]
        };
        const res = await queryMini(param);
        if(res.success){
          //获取返回的当前页和总数
          this.pageNum = res.content.page;
          this.pageTotal = res.content.total;
          var data = res.content.records;
          for (var i=0;i<res.content.records.length; i++){
            this.items.push(res.content.records[i])
          }
          //判断是否可以上拉加载
          if(this.items.length>=res.content.total){
            this.allLoaded=true
          }else {
            this.allLoaded=false
          }
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //获取开始时间和结束时间
      getMonthScope: function (date) {
        var arry = new Array();
        var date1 = date.replace("年","-");
        var date2 = date1.replace("月","");
        var array = date2.split("-");
        var dayTime = new Date(array[0], array[1], 1);
        var year = dayTime.getFullYear();
        var month = dayTime.getMonth();
        arry.push(year + '-' + month + '-01 00:00:00');   //当月第一天
        var day = new Date(year, month, 0);
        arry.push(year + '-' + month + '-' + day.getDate() + ' 23:59:59');   //当月最后一天
        return arry;
     },
      //转换传递的时间
      getFormatDate:function(date){
        var newDate = date.split("/");
        if(newDate[1]<10){
          newDate[1]="0"+newDate[1];
        }
        return newDate[0]+"年"+newDate[1]+"月";
      }
      //获取当前系统时间
     // getNowFormatDate:function(){
     //   var date = new Date();
     //   var year = date.getFullYear();
     //   var month = date.getMonth();
     //   if (month >= 1 && month <= 9) {
     //     month = "0" + month;
     //   }
     //   var currentdate = year + "年" + month + "月";
     //   return currentdate;
     // }
   },
    watch :{
      '$route': 'getParams'
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
  #StatisticsDetails{
    background: @bgmWhite;
    .detailsTop{
      border-bottom: 0.1rem solid @bgmBlue;
      padding: 0.25rem 0.2rem;
      .flex;
      .around;
      .first,.second{
        width:20%;
        .font(0.26rem);
      }
      .first{
        p{
          color:#666;
          .font(0.24rem);
          &:first-child{
            color:#333;
            .font(0.26rem);
            margin-bottom: 0.2rem;
          }
        }
      }
      .second{
        color:#666;
        .font(0.24rem);
        width:38%;
        p {
          border: 1px solid #d7d7d7;
          height: 0.7rem;
          line-height: 0.7rem;
          .round;
          &:first-child {
            margin-right: 3%;
            text-align: left;
            padding-left: 0.2rem;
            position: relative;
            &:before {
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              right: 0.2rem;
              top: 0.3rem;
              border-top: 0.15rem #333 solid;
              border-left: 0.13rem #fff solid;
              border-right: 0.13rem #fff solid;
            }
          }
        }
      }
    }
    .detailsLists{
      .first{
        .flex;
        height:0.6rem;
        line-height: 0.6rem;
        border-bottom:0.01rem solid #e5e5e5;
        font-weight: bold;
        p{
          width:50%;
          text-align: center;
          color:#333;
          .font(0.26rem);
        }
      }
      .second{
        color:#333;
        .font(0.24rem);
        .flex;
        height:0.9rem;
        line-height: 0.9rem;
        padding: 0 0.2rem;
        p{
          width:50%;
          text-align: center;
          border-bottom:0.01rem solid #e5e5e5;
        }
      }
    }
    .picker{
      width:1000px;
      overflow-x: hidden;
    }
  }
</style>
