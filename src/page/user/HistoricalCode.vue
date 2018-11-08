<template>
  <div id="HistoricalCode">
    <div class="notData" v-if="notData">暂无可用邀请码</div>
    <div class="content">
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
      <div class="contentItem"  v-for="item in codeList">
        <div class="content-left">
          <p>{{item.code}}</p>
          <p>{{item.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
        </div>
        <div class="content-right">
          <span class="copy"
                v-clipboard:copy="item.code"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError">复制</span>
          <span>未使用</span>
        </div>
      </div>
      <div class="more">已无更多内容</div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
  import { Toast,Spinner ,Loadmore,XHeader} from 'mint-ui';
  import {queryPromoterCode} from '@/api/getData'

  export default {
    components: {
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    data(){
      return {
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,

        pageNum:1,//当前页数
        pageSize:15,//每页大小
        pageTotal:0,//总条数
        notData:false,
        codeList:[]
      }
    },
    mounted:function(){
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.queryPromoterCode()
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
          this.codeList=[]
          this.pageNum=1
          this.queryPromoterCode()
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        this.handleBottomChange("loading");
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageNum++
          if (this.pageNum <= total) {
            this.queryPromoterCode()
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.handleBottomChange("loadingEnd");//数据加载完毕 修改状态码
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },
      //分页结束
      /*---------------------------------*/
      //设置备注名称
      async queryPromoterCode() {
        let param = {
          page: this.pageNum,
          pageSize: this.pageSize,
          used: false
        };
        const res = await queryPromoterCode(param);
        if (res.success) {
          for (var i=0;i<res.content.records.length; i++){
            this.codeList.push(res.content.records[i])
          }
          this.pageNum=res.content.page
          this.pageTotal=res.content.total
          //判断是否可以上拉加载
          if(this.codeList.length>=res.content.total){
            this.allLoaded=true
          }else {
            this.allLoaded=false
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
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
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #HistoricalCode{
    .notData{
      min-height:calc(100vh - 0.64rem);
      color:#333;
      padding-top:1.2rem;
      width:1.7rem;
      margin:0 auto;
    }
    .content{
      padding:0 0.2rem;
      min-height:calc(100vh - 0.64rem);
      background: #fff;
      .contentItem{
        color:#333;
        font-size:0.24rem;
        .flex;
        .between;
        .align;
        border-bottom:0.02rem solid #d7d7d7;
        padding:0 0.2rem;
        height:0.9rem;
        .content-left{
          p{
            color:#666;
            &:first-child{
              margin-bottom:0.1rem;
              color:#333;
              font-size:0.28rem;
            }
          }
        }
        .content-right{
          span {
            margin-right: 0.4rem;
            display: inline-block;
          }
          img{
            width:0.38rem;
            margin-right:0.2rem;
          }
          .copy{
            color:#47a1f5;
          }
        }
      }
      .more{
        width:1.5rem;
        margin:0.3rem auto 0;
        color:#333;
        font-size:0.24rem;
      }
    }

    .page-loadmore-wrapper {
      overflow: scroll; // 很重要
      -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
    }

  }

</style>
