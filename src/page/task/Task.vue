<template>
  <div id="Task" >
    <div class="top">
      <div :class=" currentTab == index ? 'topItem on' : 'topItem' " @click="getTabIndex($event)" :data-num = "index" v-for="(item,index) in tabTitle">
        {{item}}
      </div>
    </div>
    <!--<div class="taskNum taskNum1">1</div>-->
    <div class="taskNum taskNum2" v-if="taskNum2 != null && taskNum2 > 0">{{taskNum2}}</div>
    <div class="taskNum taskNum3" v-if="taskNum4 != null && taskNum4 > 0">{{taskNum4}}</div>
    <div class="main">
      <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="changePage">
        <swiper-slide  >

          <!--1、样式控制显示区域高度-->
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" >
            <!--使用loadMore组件-->
            <!--<mt-loadmore-->
              <!--:top-method="loadTop"-->
              <!--:bottom-method="loadBottom"-->
              <!--:bottom-all-loaded="allLoaded"-->
              <!--:auto-fill="false"-->
              <!--@top-status-change="handleTopChange"-->
              <!--@bottom-status-change="handleBottomChange"-->
              <!--ref="loadmore0">-->
              <!--2、业务数据渲染-->
          <div  class="operation"><!-- v-if="currentTab == 0"-->
            <div class="noneOrder" v-if="notData">
              <img src="../../assets/photo02.png"/>
              <p class="content">您还没有相关的订单任务</p>
            </div>
            <div class="operationData" v-else="!notData" v-for="item in tasklist2">
              <div class="operationData-top">
                <div class="operationData-left">
                  <p class="number">任务号：{{item.id}}</p>
                  <p class="name">店铺名：{{item.web_store_name}}</p>
                </div>
                <div class="operationData-right"
                     v-clipboard:copy="item.id"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">
                  复制
                </div>
              </div>
              <div class="operationData-main">
                <div class="photo">
                  <img :src="item.main_image_url"/>
                </div>
                <div class="mainData">
                  <p>¥{{item.execute_price}}</p>
                  <p>垫付余额:{{returnFloat(item.price)}}</p>
                  <p>拍下数量:{{item.buy_count}}件</p>
                </div>
                <div class="operationBtn" @click="goToOperationalTask(item.id)">待操作</div>
              </div>
            </div>
          </div>
            <!--</mt-loadmore>-->
          </div>
        </swiper-slide>

        <swiper-slide  >
          <div class="noneOrder" v-if="notData">
            <img src="../../assets/photo02.png"/>
            <p class="content">您还没有相关的订单任务</p>
          </div>
          <!--1、样式控制显示区域高度-->
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-else="!notData">
            <!--使用loadMore组件-->
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              :auto-fill="false"
              @top-status-change="handleTopChange"
              @bottom-status-change="handleBottomChange"
              ref="loadmore1">
              <!--2、业务数据渲染-->
          <div class="operation" v-if="currentTab == 1">

            <div class="operationData"   v-for="item in tasklist2">
              <div class="warming" v-if="item.shokey_status==4">
                <img src="../../assets/icon_zysx.png"/>
                <span>{{item.fail_reason}}</span>
              </div>
              <div class="operationData-top">
                <div class="operationData-left">
                  <p class="number">任务号：{{item.id}}</p>
                  <p class="name">店铺名：{{item.web_store_name}}</p>
                </div>
                <div class="operationData-right">
                  <p v-clipboard:copy="item.id"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">复制</p>
                  <p v-if="auditType==1 && item.shokey_status==2">预计{{item.real_end_time}}完成审核 </p>
                  <p v-if="auditType==2  && item.shokey_status==2">等待商家审核 </p>
                </div>
              </div>
              <div class="operationData-main">
                <div class="photo">
                  <img :src="item.main_image_url"/>
                </div>
                <div class="mainData">
                  <p>¥{{item.execute_price}}</p>
                  <p>垫付余额:{{returnFloat(item.price)}}</p>
                  <p>拍下数量:{{item.buy_count}}件</p>
                </div>
                <div v-if="item.shokey_status==2" class="operationBtn waitCheck">待审核</div>
                <div class="operationBtn" @click="goToOperationalTask(item.id)" v-if="item.shokey_status==4">去修正</div>
              </div>
            </div>
          </div>
          </mt-loadmore>
        </div>
        </swiper-slide>

        <swiper-slide  >
          <div class="noneOrder" v-if="notData">
            <img src="../../assets/photo02.png"/>
            <p class="content">近1天暂无相关任务</p>
          </div>
          <!--1、样式控制显示区域高度-->
          <div class="page-loadmore-wrapper" ref="wrapper"  v-else="!notData">
            <!--使用loadMore组件-->
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              :auto-fill="false"
              @top-status-change="handleTopChange"
              @bottom-status-change="handleBottomChange"
              ref="loadmore2">
              <!--2、业务数据渲染-->
          <div  class="operation" v-if="currentTab == 2">

            <div class="operationData"  v-for="item in tasklist2">
              <div class="operationData-top">
                <div class="operationData-left">
                  <p class="number">任务号：{{item.id}}</p>
                  <p class="finish">完成时间：{{item.shokey_audit_time | dateformat('YYYY/MM/DD HH:mm:ss')}}</p>
                </div>
                <div class="operationData-right"
                     v-clipboard:copy="item.id"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">
                  复制
                </div>
              </div>
              <div class="operationData-main">
                <div class="photo">
                  <img :src="item.main_image_url"/>
                </div>
                <div class="mainData">
                  <p>¥{{item.execute_price}}</p>
                  <p>垫付余额:{{returnFloat(item.price)}}</p>
                  <p>拍下数量:{{item.buy_count}}件</p>
                </div>
                <div class="operationBtn waitCheck">已完成</div>
              </div>
            </div>
            <div class="one_day" v-if="!oneDayFlg">
              近1天任务已全部加载
            </div>
          </div>
            </mt-loadmore>
          </div>
        </swiper-slide>
        <swiper-slide  >
          <div class="noneOrder" v-if="notData">
            <img src="../../assets/photo02.png"/>
            <p class="content">您还没有相关的订单任务</p>
          </div>
          <!--1、样式控制显示区域高度-->
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-else="!notData">
            <!--使用loadMore组件-->
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              :auto-fill="false"
              @top-status-change="handleTopChange"
              @bottom-status-change="handleBottomChange"
              ref="loadmore3">
              <!--2、业务数据渲染-->
        <div class="operation" v-if="currentTab == 3">

            <div class="operationData"  v-for="item in tasklist2">
              <div class="warming" v-if="(item.shokey_status == 8 && item.complaintStatus == 1) ||
              (item.shokey_status == 8 && (item.complaintStatus == 2 || item.complaintStatus == '' ||
              item.complaintStatus == null ))">
                <img src="../../assets/icon_zysx.png"/>
                <span>{{item.fail_reason}}</span>
              </div>
              <div class="operationData-top">
                <div class="operationData-left">
                  <p class="number">任务号：{{item.id}}</p>
                  <p class="name">店铺名：{{item.web_store_name}}</p>
                </div>
                <div class="operationData-right"
                v-clipboard:copy="item.id"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">
                  复制
                </div>
              </div>
              <div class="operationData-main">
                <div class="photo">
                  <img :src="item.main_image_url"/>
                </div>
                <div class="mainData">
                  <p>¥{{item.execute_price}}</p>
                  <p v-if="item.comment.images.length>0">指定评价+晒图</p>
                  <p v-else>指定评价</p>
                 <!-- <p>垫付余额:{{item.price}}</p>-->
                  <!--<p>拍下数量:{{item.buy_count}}</p>-->
                </div>
                <div class="operationBtn" @click="EvaluationTask(item.id)" v-if="item.shokey_status==5">待操作</div>
                <div class="operationBtn waitCheck" v-if="item.shokey_status==6">待审核</div>
                <div class="operationBtn waitCheck" v-if="item.shokey_status == 8 && item.complaintStatus == 1">审核失败投诉中</div>
                <div class="operationBtn waitCheck" v-if="item.shokey_status == 8 && (item.complaintStatus == 2 || item.complaintStatus == '' || item.complaintStatus == null )">审核失败</div>
                <div class="operationBtn waitCheck" v-if="item.shokey_status==7">已完成</div>
              </div>
            </div>
          </div>
            </mt-loadmore>
          </div>
        </swiper-slide>
        <swiper-slide  >
          <div class="noneOrder" v-if="notData">
            <img src="../../assets/photo02.png"/>
            <p class="content">近1天暂无相关任务</p>
          </div>
          <!--1、样式控制显示区域高度-->
          <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-else="!notData">
            <!--使用loadMore组件-->
            <mt-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              :auto-fill="false"
              @top-status-change="handleTopChange"
              @bottom-status-change="handleBottomChange"
              ref="loadmore4">
              <!--2、业务数据渲染-->
          <div class="operation" v-if="currentTab == 4">

            <div class="operationData"  v-for="item in tasklist2">
              <div class="warming">
                <img src="../../assets/icon_zysx.png"/>
                <span>{{item.fail_reason}}</span>
              </div>
              <div class="operationData-top">
                <div class="operationData-left">
                  <p class="number">任务号：{{item.id}}</p>
                  <p class="name">完成时间：{{item.real_start_time | dateformat('YYYY/MM/DD HH:mm:ss')}}</p>
                </div>
                <div class="operationData-right"
                     v-clipboard:copy="item.id"
                     v-clipboard:success="onCopy"
                     v-clipboard:error="onError">
                  复制
                </div>
              </div>
              <div class="operationData-main">
                <div class="photo">
                  <img :src="item.main_image_url"/>
                </div>
                <div class="mainData">
                  <p>¥{{item.execute_price}}</p>
                  <p>垫付余额:{{returnFloat(item.price)}}</p>
                  <p>拍下数量:{{item.buy_count}}件</p>
                </div>
                <div class="operationBtn waitCheck">已失败</div>
              </div>
            </div>
          </div>
            </mt-loadmore>
          </div>
        </swiper-slide>
      </swiper>
    </div>

  </div>
</template>
<script>
  import { Header,Toast,Spinner ,Loadmore,XHeader } from 'mint-ui';
  import Tabbar  from '@/components/Tabbar';
  import {getPromoteTasksCount,getPromoteTasks,getProp} from '@/api/getData'
  export default {
    components: {
      Tabbar,
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    data(){
      const that =this
      return {
        list: [],//数据列表
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,

        taskType:1,//订单类型
        pageNum:1,//当前页数
        pageSize:5,//每页大小
        pageTotal:0,//总条数
        taskNum2:null,
        taskNum4:null,
        tasklist2:[],
        auditType:null,
        currentTab:0,
        bannerIndex:"",
        tabTitle:["待操作","待审核","已完成","评价任务","失败任务"],
        taskNum:["1","2","3"],
        notData:false,   //待操作无数据
        oneDayFlg:false,   //一天描述语
        swiperOption:{
          autoplay:false,
          speed:400,
          on:{
            slideChangeTransitionEnd:function(){
              that.currentTab = this.activeIndex;
              that.loadTabData(this.activeIndex);
            },

          }
        }
      }
    },
    mounted:function(){
//      document.getElementsByClassName("mintui-back").item(0).style.visibility="hidden"
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      document.getElementsByClassName("on").item(0).click()
      //this.getPromoteTasksCount()
      // this.getPromoteTasks2(1,1,this.pageSize);
      //this.getParams();
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods:{
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
          this.tasklist2=[]
          this.pageNum=1
          this.getPromoteTasks2(this.taskType,this.pageNum,this.pageSize)
          if(this.currentTab==0){
            this.$refs.loadmore0.onTopLoaded();
          }else if(this.currentTab==1){
            this.$refs.loadmore1.onTopLoaded();
          }else if(this.currentTab==2){
            this.$refs.loadmore2.onTopLoaded();
          }else if(this.currentTab==3){
            this.$refs.loadmore3.onTopLoaded();
          }else if(this.currentTab==4){
            this.$refs.loadmore4.onTopLoaded();
          }
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        this.handleBottomChange("loading");
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageNum++
          if (this.pageNum <= total) {
            this.getPromoteTasks2(this.taskType,this.pageNum,this.pageSize)
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.handleBottomChange("loadingEnd");//数据加载完毕 修改状态码
          this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          this.$refs.loadmore2.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          this.$refs.loadmore3.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          this.$refs.loadmore4.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      //分页结束
      /*---------------------------------*/
      //查询各个状态订单数量
      async getPromoteTasksCount() {
        let param = {
          shokeyStatus: "2,4"
        };
        const res = await getPromoteTasksCount(param);
        if (res.success) {
          for (var key in res.content) {
            if (key == 2) {
              this.taskNum2 = res.content[key]
            } else if (key == 4) {
              this.taskNum4 = res.content[key]
            }
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询推手订单
      async getPromoteTasks2(status, pageNum, size) {
        let param = {
          shokeyStatus:status,
          pageNum: pageNum,
          pageSize: size
        };
        const res = await getPromoteTasks(param);
        if (res.success) {
          this.pageNum=res.content.page
          this.pageTotal=res.content.total
          for(var i = 0; i < res.content.records.length; i++){
            res.content.records[i].real_end_time = this.formatTime5(new Date(res.content.records[i].real_end_time))
          }
          for (var i=0;i<res.content.records.length; i++){
            this.tasklist2.push(res.content.records[i])
          }

          //判断是否可以上拉加载
          if(this.tasklist2.length>=res.content.total){
            this.allLoaded=true
            if(res.content.total!=0){
              this.oneDayFlg=true
            }
          }else {
            this.allLoaded=false
          }
          if(res.content.total<=0){
            this.notData=true
          }else {
            this.notData=false
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询订单审核方式
      async getProp() {
        let param = {
          code:'merchant.audit_type'
        };
        const res = await getProp(param);
        if (res.success) {
          this.auditType=res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      formatTime5 : function (date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return hour+":"+minute
      },
      // 复制成功
      onCopy(e){
        console.log(e);
        Toast({
          message: '复制成功',
          iconClass: 'icon icon-success'
        });
      },
      // 复制失败
      onError(e){
        console.log("复制失败");
      },
      getTabIndex(e){
        this.currentTab = e.target.getAttribute('data-num')
        this.loadTabData(this.currentTab);


      },

      loadTabData(currentTab){
        this.currentTab =currentTab;
        this.swiper.slideTo(this.currentTab,400,false)
        this.tasklist2=[]
        this.getPromoteTasksCount()
        if(this.currentTab == 0){
          this.taskType=1
          this.getPromoteTasks2(this.taskType,1,this.pageSize)
        }
        if(this.currentTab == 1){
          this.taskType=2
          this.getPromoteTasks2(this.taskType,1,this.pageSize)
          this.getProp()
        }
        if(this.currentTab == 2){
          this.taskType=3
          this.getPromoteTasks2(this.taskType,1,this.pageSize)
        }
        if(this.currentTab == 3){
          this.taskType=4
          this.getPromoteTasks2(this.taskType,1,this.pageSize)
        }
        if(this.currentTab == 4){
          this.taskType=5
          this.getPromoteTasks2(this.taskType,1,this.pageSize)
        }
      },
      changePage(index){
        this.currentTab= index;
      },
      goToOperationalTask(id){
        this.$router.push({
          path:"/OperationalTask",
          name:'OperationalTask',
          query : {
            id:id
          }
        })
      },
      EvaluationTask(id){
        this.$router.push({
          path:"/EvaluationTask",
          name:'EvaluationTask',
          query : {
            id:id
          }
        })
      },
      getParams(){
        var currentTab = this.$route.query.currentTab;
        if(currentTab != ''){
          this.currentTab = currentTab
        }
      },
      goTo(name){
        this.$router.push({name:name})
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #Task{
    /*background: #f3f6fe;*/
    position:relative;
    .top{
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:0.8rem;
      background:#fff;
      font-size:0.28rem;
      z-index:2;
      .flex;
      .align;
      .topItem{
        position:relative;
        width:19%;
        height:101%;
        color:#333;
        .justify;
        .align;
        .flex;
        &:nth-child(4){
          width:21.5%;
        }
        &:nth-child(5){
          width:21.5%;
        }
      }
      .on{
        color:#f54848;
        border-bottom:2px solid #f54848;
      }
    }
    .taskNum{
      width:0.26rem;
      height:0.26rem;
      color:#fff;
      line-height:0.26rem;
      background:#f54848;
      .round(50%);
      font-size:0.24rem;
      position:fixed;
      top:0.1rem;
      left:2.2rem;
      text-align:center;
      z-index:2
    }
    .taskNum1{
      left:1.04rem;
    }
    .taskNum2{
      left:2.2rem;
    }
    .taskNum3{
      left:4.85rem;
    }
    .main{
      width:100%;
      min-height:calc(100vh - 2.4rem);
      background:@bgmBlueS;
      margin-top:0.8rem;
      .noneOrder{
        min-height:calc(100vh - 2.4rem);
        position:absolute;
        left:0;
        top:3rem;
        right:0;
        bottom:0;
        text-align: center;
        img{
          width:1.6rem;
          margin-bottom:0.4rem;
        }
        .content{
          font-size:0.28rem;
          color:#666;
        }
      }
      .operation{

        .operationData{
          margin-bottom:0.2rem;
          font-size:0.24rem;
          color:#333;
          &:nth-child(1){
            margin-top:0.2rem;
          }
          .warming{
            width:100%;
            background:#ffc3c3;
            height:0.6rem;
            line-height:0.6rem;
            padding-left:0.2rem;
            img{
              width:0.26rem;
              margin-right:0.1rem;
              vertical-align: middle;
            }
            span{
              font-size:0.24rem;
              color:#f54848;
            }
          }
          .operationData-top{
            .flex;
            .between;
            padding:0.2rem 0.2rem 0.19rem 0.2rem;
            background: @bgmWhiteS;
            .operationData-left{
              font-size:0.24rem;
              .number{
                margin-bottom:0.24rem;
              }
              .name{
               color:#f54848;
              }
              .finish{
                color:#666;
              }
            }
            .operationData-right{
              text-align:right;
              color:#47a1f5;
              p{
                &:nth-child(1){
                  color:#47a1f5;
                  margin-bottom:0.2rem;
                }
                &:nth-child(2){
                  color: #f54848;
                }
              }
            }
          }
          .operationData-main{
            border-top:1px solid #e5e5e5;
            padding:0.2rem 0.2rem;
            background: @bgmWhiteS;
            .flex;
            .between;
            .photo{
              width:2rem;
              .round(5px);
              img{
                width:100%;
              }
            }
            .mainData{
              p{
                color:#333;
                font-size:0.24rem;
                &:nth-child(1){
                  color:#ff8634;
                  font-size:0.34rem;
                  margin-bottom:0.2rem;
                  margin-top:0.2rem;
                }
                &:nth-child(2){
                  margin-bottom:0.15rem;
                }
              }
            }
            .operationBtn{
              width:1.7rem;
              height:0.6rem;
              background:@red;
              .round(0.1rem);
              text-align: center;
              line-height:0.6rem;
              color:#fff;
              font-size:0.24rem;
              margin-top:1.2rem;
            }
            .waitCheck{
              background:#d7d7d7;
            }
          }
        }
      }
    }

    .page-loadmore-wrapper {
      overflow: scroll; // 很重要
      -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
      padding-bottom:0.9rem;
    }

    .one_day{
      text-align: center;
      font-size: 0.28rem;
      color: #666;
    }

  }
  .mint-indicator-wrapper{
    z-index:99;
  }
</style>
