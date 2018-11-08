<template>
  <div id="Message">
    <div class="noneOrder" v-if="notData">
      <img src="../../assets/icon-m.png"/>
      <p class="content">暂时没有消息通知哦~</p>
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
        ref="loadmore">
        <ul>
    <li class="MessageLists" v-for="(item,index) in items" v-if="item != null">
      <div class="first">
        <p class="firstTit">{{item.title}}</p>
        <p>{{item.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
      </div>
      <div class="second" v-if="item.type==1" v-for="array in item.arry ">
        <p>{{array}}</p>
      </div>
      <div class="second" v-if="item.type==2">
        <p>{{item.content}}</p>
      </div>
      <p class="MessageDetails" :class="{'unread':unread == item.readed}" @click="pushDetails(item.id)">查看详情</p>
    </li>
      </ul>
      </mt-loadmore>
      <div style="height:0.8rem;"></div>
    </div>
  </div>
</template>
<script>
  import {queryUserMessage} from '@/api/getData';
  import { Toast,Spinner ,Loadmore,XHeader,Header} from 'mint-ui';
  export default {
    data(){
      return {
        notData:false,
        pageNum:1,//当前页数
        pageSize:5,//每页大小
        pageTotal:0,//总条数
        items : [],
        list: [],//数据列表
        topStatus: '',
        bottomStatus: '',
        wrapperHeight: 0 ,//区域高度
        allLoaded: false,
        //已读2 未读1
        unread:"",
      }
    },
    components: {
      'mt-spinner': Spinner,
      'mt-loadmore': Loadmore,
      'x-header': XHeader
    },
    mounted:function(){
//      document.getElementsByClassName("mintui-back").item(0).style.visibility="hidden"
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.queryUserMessage(this.pageNum,this.pageSize);
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
          this.queryUserMessage(this.pageNum,this.pageSize);
          this.$refs.loadmore.onTopLoaded();
          console.log('load top end');
        }, 2000);
      },
      loadBottom() {
        setTimeout(() => {
          let total = (this.pageTotal + this.pageSize -1) / this.pageSize;
          this.pageNum++;
          if (this.pageNum <= total) {
            this.queryUserMessage(this.pageNum,this.pageSize)
          } else {
            this.allLoaded = true; // 若数据已全部获取完毕
          }
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          console.log('loadBottom end, this.allLoaded = ', this.allLoaded);
        }, 1000);
      },

      pushDetails(id){
        this.$router.push({name:'MessageDetails',query:{id:id}});
      },

      async queryUserMessage(pageNum,pageSize){
        let param = {"page":pageNum,"pageSize":pageSize};
        const res = await queryUserMessage(param);
        if(res.success){
          this.pageNum=res.content.page
          this.pageTotal=res.content.total
          var data = res.content.records;
          if(this.pageTotal != 0){
            this.items  =  this.items.concat(data);
           for(var i=0;i<this.items.length;i++){
             if(this.items[i].type==1){
               this.items[i].arry = this.items[i].content.split(";");
             }
           }
          }else{
            this.notData = true;
          }
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
  body {
    margin: 0;
    background-color: #fafafa;
  }
  ul,li{ padding:0;margin:0;list-style:none};
  .page-loadmore-wrapper {
    overflow: scroll; // 很重要
    -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
  }
  #Message{
    /*margin-top: 0.2rem;*/
    min-height:calc(~"100vh - 0.9rem");
    padding: 0.2rem;
    .font(0.24rem);
    background:rgba(243,246,254,0.8);;
    .noneOrder{
      min-height:calc(100vh - 2.4rem);
      position:absolute;
      left:0;
      top:35%;
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
    .MessageLists{
      margin-bottom: 0.2rem;
      background:@bgmWhiteS;
      .round(0.2rem);
      padding: 0.3rem 0.2rem 0;
      color:#666;
      .font(0.24rem);
      .first{
        .flex;
        .align;
        .between;
        margin-bottom: 0.1rem;
        .firstTit{
          color:#333;
          .font(0.3rem);
          font-weight: bold;
        }
      }
      .second{
        p{
          margin-top: 0.3rem;
        }
      }
      .MessageDetails{
        color:#333;
        height:0.88rem;
        line-height: 0.88rem;
        border-top: 1px solid #d7d7d7;
        margin-top: 0.3rem;
      }
      .unread{
        position: relative;
        padding-left: 0.2rem;
        &:before{
          content: '';
          width:0.1rem;
          height:0.1rem;
          border-radius: 50%;
          background: @red;
          position: absolute;
          left:0;
          top:0.38rem;
        }
      }
    }
  }
</style>
