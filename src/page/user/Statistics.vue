<template>
  <div id="Statistics">
    <div class="top">
      <div :class="currentTab == 0 ? 'on' : '' " @click="getTabIndex($event)" :data-num = "0">{{preMonth}}月</div>
      <div :class="currentTab == 1 ? 'on' : '' " @click="getTabIndex($event)" :data-num = "1">{{currentMonth}}月</div>
      <div :class="currentTab == 2 ? 'on' : '' " @click="getTabIndex($event)" :data-num = "2">更多筛选</div>
    </div>
    <div class="searchTime">{{currYears}}年{{currMonths}}月</div>
    <div class="showMoney">
      <div class="money-left">
        <p>分佣笔数(笔)</p>
        <p>{{refereeSum}}</p>
      </div>
      <div class="money-left">
        <p>分佣金额(元)</p>
        <p>¥{{refereeMoney}}</p>
      </div>
    </div>
    <div class="blank"></div>
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
        <!--2、业务数据渲染-->
    <div class="content">
      <div class="contentItem" v-for="item in taskList" @click="pustDetails(item.promoterId)">
        <p class="name"><span>{{item.realName}}</span><span>(ID:{{item.code}})</span></p>
        <div class="progress">
          <div class="progressContainer">
            <div class="progress1" :style="{'width':item.progress+'%','background':item.bgColor}">
            </div>
          </div>
        </div>
        <div class="total">{{item.taskNum}}笔</div>
      </div>
    </div>
      </mt-loadmore>
    </div>
    <div class="fixedBtn"
         v-clipboard:copy="excelUrl"
         v-clipboard:success="onCopy"
         v-clipboard:error="onError">导出Excel</div>
    <!--弹窗内容-->
    <div v-if="moreFiltrate" id="moreFiltrate">
      <div class="displayNone" @click="moreFiltrate = false"></div>
      <div class="moreFiltrate">
        <div class="filtrateTop">
          <p>更多筛选</p>
          <img @click="moreFiltrate = false;isDateFlg=true" src="../../assets/btn_05.png" alt="">
        </div>
         <div class="moreContent">
           <p class="tit">查询时间</p>
           <div class="FiltrateTime">
             <p @click="popupDatePicker">{{isDate}}</p>
             <mt-popup
               v-model="popupVisible"
               position="bottom">
               <mt-picker :slots="slots" class="BankPicker" valueKey="1,2" @change="onValuesChange"></mt-picker>
             </mt-popup>
             <p @click="isTotals" :class="isTotal?'total1' : ''">累计</p>
           </div>
           <p class="tit tit2">查询人员</p>
           <div class="FiltrateName">
             <input type="number" v-model="keyWord" placeholder="请输入ID/手机号/姓名/备注">
           </div>
         </div>
        <div class="lastBtn">
          <p @click="ResetTask">重置</p>
          <p @click="searchTask">确定</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MessageBox,Picker,Popup,Toast,Spinner ,Loadmore,XHeader } from 'mint-ui';
  import {getStore,setStore} from "../../config/mUtils"
  import {countInvateTaskData,invateTaskList} from '@/api/getData'

  export default {
    components: {
      MessageBox,
      Picker,
      Popup,
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    data(){
      return {
        //导出链接
        excelUrl:"", //分页
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,
        //条件
        keyWord: "",
        pageIndex: 1,//当前页数
        pageSize: 20,//每页大小
        pageTotal:0,//总条数
        refereeMoney:0,
        refereeSum:0,

        dataTime:null,
        currMonths:new Date().getMonth() + 1,
        currYears: new Date().getFullYear(),
        preMonth: new Date().getMonth(),
        currentMonth: new Date().getMonth() + 1,
        currentTab:1,
        taskList:[
          /*{realName:"111",code:"123456",progress:"80",taskNum:"80",bgColor:""},
          {realName:"222",code:"123456",progress:"68",taskNum:"68",bgColor:""},*/
        ],
        moreFiltrate:false,
        isTotal:false,
        popupVisible:null,
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
        isDate:new Date().getFullYear()+"年"+(new Date().getMonth() + 1)+"月",
        isDateFlg:true

      }
    },
    mounted:function(){
      //导出链接
      this.excelUrl=this.index1.methods.getApi()+ 'pbs/api/promoter/export_referee_invate_task_data' +
        '?access_token=' + getStore("access_token")
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.showColor()
      this.countInvateTaskData()
      this.invateTaskList()

      var month=new Date().getMonth() + 1
      if(month<10){
        month="0"+month
      }
      this.slots.forEach((slot)=> {
        if (slot.values && slot.className == 'slot1') {
          for(var i=0;i<slot.values.length;i++){
            if(slot.values[i]==(new Date().getFullYear()+'年')){
              slot.defaultIndex=i;
              //slot.valueIndex=i;
            }
          }
        }
        if (slot.values && slot.className == 'slot3') {
          for(var i=0;i<slot.values.length;i++){
            if(slot.values[i]==( month+'月')){
              slot.defaultIndex=i;
            }
          }
        }
      })
    },
    methods:{

      popupDatePicker(){
        this.popupVisible = true
       // this.so

      },

      // 复制成功
      onCopy(e){
        console.log(e);
        MessageBox.confirm('', {
          message: '<p style="padding: 0.5rem 0">请复制到电脑浏览器，下载查阅EXCEL</p>',
          title: '提示',
          showConfirmButton:true,
          showCancelButton:true,
          cancelButtonClass:'cancelButton',
          confirmButtonClass:'confirmButton',
          confirmButtonText:'复制链接',
          cancelButtonText:'取消'
        }).then(action => {
          if (action == 'confirm') {
            Toast({
              message: '复制成功',
              iconClass: 'icon icon-success'
            });
          }
        }).catch(err => {
          if (err == 'cancel') {
            console.log('取消');
          }
        });
      },
      // 复制失败
      onError(e){
        console.log("复制失败");
      },
      //分页开始
      handleTopChange(status) {
        console.log(status);
        this.topStatus = status;
      },
      handleBottomChange(status) {
        console.log('handleBottomChange ', status);
        this.bottomStatus = status;
      },
      loadTop() {
        console.log('loadTop');
        setTimeout(() => {
          this.taskList=[]
          this.pageIndex=1
          this.countInvateTaskData()
          this.invateTaskList()
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        this.handleBottomChange("loading");
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageIndex++
          if (this.pageIndex <= total) {
            this.countInvateTaskData()
            this.invateTaskList()
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.handleBottomChange("loadingEnd");//数据加载完毕 修改状态码
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      /*--------------分页结束-------------------*/

      getTabIndex(e){
        this.currentTab = e.target.getAttribute('data-num');
        this.taskList=[]
        this.pageIndex=1
        if(this.currentTab == 2){
          this.moreFiltrates();
        }
        if(this.currentTab==0){
          this.isTotal=false
          this.currMonths=new Date().getMonth(),
          this.currYears=new Date().getFullYear(),
          this.currMonths=this.preMonth
          this.keyWord=""
          this.countInvateTaskData()
          this.invateTaskList()
        }
        if(this.currentTab==1){
          this.isTotal=false
          this.currMonths=new Date().getMonth()+1,
          this.currYears=new Date().getFullYear(),
          this.currMonths=this.currentMonth
          this.keyWord=""
          this.countInvateTaskData()
          this.invateTaskList()
        }
      },
      //进度条显示颜色
      showColor(){
        for(var i=0; i<this.taskList.length;i++){
          var item = this.taskList[i];
          var random = Math.floor(Math.random() * 1000000)
          if (random.toString().length != 6) {
            random = "0d8d67"
          }
          item.bgColor= '#' + random;
          if ((item.bgColor).substr(0, 2) == "#f") {
            item.bgColor = "#333333"
          }
          var sum = this.taskList[0].taskNum;
          var percent = (Number(item.taskNum) / Number(sum)) * 100
          item.progress = percent
        }
      },
      moreFiltrates: function () {
        this.moreFiltrate = true;
        console.log(this.slots)
      },
      //累计
      isTotals(){
        console.log('isTotal')
        this.isTotal = !this.isTotal;
      },
      onValuesChange(picker, values) {

        if(this.isDateFlg){
          var month=new Date().getMonth() + 1
          if(month<10){
            month="0"+month
          }
         // picker.values=['2018年','01月'];

          console.log(picker)
          this.isDate=new Date().getFullYear()+"年"+month+"月"
          this.isDateFlg=false
        }else {
          this.isDate = values[0]+values[1];
        }
      },
      pustDetails(id){
        this.$router.push({
          path:"/StatisticsDetails",
          name:'StatisticsDetails',
          query : {
            promoterId:id
          }
        })
      },

      //查询分佣总数
      async countInvateTaskData() {
        var data=this.currYears+"/"+this.currMonths;
        sessionStorage.setItem("date",data);
        this.dataTime = new Date(data).getTime();
        if(this.isTotal){
          this.dataTime=""
        }
        let param = {
          date: this.dataTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          promoteKeyWord: this.keyWord
        };
        const res = await countInvateTaskData(param);
        if (res.success) {
          if(res.content!=null) {
            this.refereeMoney = this.returnFloat(res.content.totalCoin)
            this.refereeSum = res.content.totalCount
          }else {
            this.refereeMoney =0
            this.refereeSum = 0
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询分佣列表
      async invateTaskList() {
        var data=this.currYears+"/"+this.currMonths
        this.dataTime = new Date(data).getTime();
        if(this.isTotal){
          this.dataTime=""
        }
        let param = {
          date: this.dataTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          promoteKeyWord: this.keyWord
        };
        const res = await invateTaskList(param);
        if (res.success) {
          if(res.content!=null) {
            this.pageIndex = res.content.page
            this.pageTotal = res.content.total

            for (var i = 0; i < res.content.records.length; i++) {
              this.taskList.push(res.content.records[i])
            }

            //判断是否可以上拉加载
            if (this.taskList.length >= res.content.total) {
              this.allLoaded = true
            } else {
              this.allLoaded = false
            }
          }else {
            this.taskList=[]
          }
          this.showColor()
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //按条件搜索
      searchTask() {
        this.taskList=[]
        //处理时间
        this.currYears=this.isDate.substring(0,4)
        this.currMonths=this.isDate.substring(5,7)
        this.isDate=this.isDate.replace(/年/g, '/');
        this.isDate=this.isDate.replace(/月/g, '');
        this.dataTime = new Date(this.isDate).getTime();
        this.countInvateTaskData()
        this.invateTaskList()
        this.moreFiltrate = false
        this.isDateFlg=true
      },
      //重置搜索条件
      ResetTask() {
        //处理时间
        this.currMonths=new Date().getMonth()+1
        this.currYears=new Date().getFullYear()
        var month=this.currMonths
        if(month<10){
          month="0"+month
        }
        this.isDate=this.currYears+"年"+month+"月"
        this.keyWord=""
        if(this.isTotal){
          this.isTotal=!this.isTotal
        }
        this.isDateFlg=true
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #Statistics{
    min-height:calc(100vh - 0.64rem);
    background:@bgmWhite;
    font-size:0.24rem;
    color:#666;
    .top{
      width:100%;
      height:0.8rem;
      position: fixed;
      top:0;
      left:0;
      .flex;
      .around;
      color:#666;
      background: #fff;
      font-size:0.26rem;
      div{
        width:1.28rem;
        height:0.8rem;
        line-height:0.8rem;
        text-align:center;
      }
      .on{
        color:#e3544c;
        border-bottom:0.02rem solid #e3544c;
      }
    }
    .searchTime{
      padding-top: 0.8rem;
      background:#f3f6fe;
      padding-left:0.2rem;
      line-height:0.4rem;
    }
    .showMoney{
      height:1.4rem;
      .flex;
      .align;
      padding:0.1rem 0;
      .money-left{
        width:50%;
        text-align:left;
        padding-left:0.8rem;
        border-right:0.02rem dashed #d7d7d7;
        p{
          &:nth-child(1){
            margin-bottom:0.3rem;
            font-size:0.26rem;
            color:#333;
          }
          &:nth-child(2){
            font-size:0.38rem;
            color:#e3544c;

          }
        }
      }
    }
    .blank{
      width:100%;
      height:0.1rem;
      background:#f3f6fe;
    }
    .content{
      padding:0 0.2rem 1rem;
      .contentItem{
        .flex;
        .align;
        height:0.9rem;
        border-bottom:0.02rem solid #d7d7d7;
        .name{
          width:2.4rem;
          span{
            &:first-child{
              display: inline-block;
              margin-right:0.1rem;
            }
          }
        }
        .progress{
          width:40%;
          .progressContainer{
            height: 0.2rem;
            width: 100%;
            .round(0.05rem);
            margin-left: 2%;
            background: #efeff4;
            .progress1{
              background-color: #1C8DE0;
              border-radius: 10px;
              height:0.2rem;
              b{
                color:#fff;
                font-weight: 100;
                font-size: 12px;
                position:absolute;
                left:40%;
              }

            }
          }
        }
        .total{
          .font(0.24rem);
          color:#666;
          margin-left: 0.5rem;
          float: right;
        }
      }
    }
    .fixedBtn{
      position: fixed;
      bottom: 0;
      left:0;
      width:100%;
      background: @red;
      color:#fff;
      height:0.98rem;
      line-height: 0.98rem;
      .font(0.26rem);
      text-align: center;
    }
  }
  .mint-msgbox-header{
    background:@red;
    height:0.8rem;
    line-height:0.8rem;
    padding:0;
    .mint-msgbox-title{
      color:#fff;
    }
  }
  .mint-msgbox-content{
    padding:0;
  }
  .mint-msgbox-btns{
    .around;
    .confirmButton{
      color:@red;
    }
  }
  #moreFiltrate{
    .displayNone{
      width:100%;
      height:100%;
      z-index:1000;
      position:absolute;
      top:0;
      left:0;
    }
    width:100%;
    height:100%;
    background-color:rgba(0, 0, 0, 0.5);
    z-index:1000;
    position:absolute;
    top:0;
    left:0;
    text-align:center;
    overflow: hidden;
    .flex;
    .justify;
    .align;
    .moreFiltrate{
      position: relative;
      z-index:1001 ;
      width:80%;
      height:5rem;
      background: #fff;
      text-align: left;
      color:#333;
      .round(0.2rem);
      .filtrateTop{
        .round(0.2rem 0.2rem 0 0);
        color:#fff;
        background: @red;
        height:0.8rem;
        line-height: 0.8rem;
        .font(0.30rem);
        text-align: center;
        position: relative;
        img{
          width:0.34rem;
          height:0.34rem;
          position: absolute;
          right:0.2rem;
          top:0.22rem;
          z-index: 13;
        }
      }
      .moreContent{
        .font(0.24rem);
        padding: 0.3rem 0.4rem 0;
        .tit{
          .font(0.26rem);
          margin-bottom: 0.3rem;
        }
        .tit2{
          margin-top: 0.4rem;
        }
        .FiltrateName{
          input{
            width:100%;
            height:0.6rem;
            .font(0.24rem);
            color:#999;
            padding-left: 0.2rem;
          }
        }
        .FiltrateTime{
          .flex;
          text-align: center;
          p{
            width:47%;
            border: 1px solid #d7d7d7;
            height:0.6rem;
            line-height: 0.6rem;
            .round;
            &:first-child{
              margin-right: 3%;
              text-align: left;
              padding-left: 0.2rem;
              position: relative;
              &:before{
                content: '';
                width:0;
                height:0;
                position: absolute;
                right:0.2rem;
                top:0.24rem;
                border-top: 0.15rem #333 solid;
                border-left: 0.13rem #fff solid;
                border-right: 0.13rem #fff solid;
              }
            }
          }
          .total1{
            color:@red;
            border: 1px solid @red;
          }
        }
      }
      .lastBtn{
        width:100%;
        border-top: 1px solid #d7d7d7;
        .flex;
        height:0.8rem;
        line-height: 0.8rem;
        text-align: center;
        position: absolute;
        bottom: 0;
        p{
          width:50%;
          color:@red;
          .font(0.26rem);
          &:first-child{
            border-right: 1px solid #d7d7d7;
            color:#666;
          }
        }
      }
    }
  }
  .picker{
    width:1000px;
    overflow-x: hidden;
  }

  .page-loadmore-wrapper {
    overflow: scroll; // 很重要
    -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
  }
</style>
