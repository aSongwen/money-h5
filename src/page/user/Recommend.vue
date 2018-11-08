<template>
  <div id="recommend">
    <div class="top">
      <p>累计推荐奖励</p>
      <p @click="goTo('Statistics')"><span>{{coinMoney}}</span>元</p>
    </div>
    <div class="InvitationCode">
      <div class="InvitationCode-top">
        <div class="InvitationCode-text" v-if="newCode == ''">暂无邀请码</div>
        <div class="InvitationCode-text1" v-else>
          <!--<img :src="newCodeImg"/>-->
          <p>{{newCode}}<span>未使用</span></p>
        </div>
        <div class="InvitationCode-btn" @click="createPromoterCode">
          生成邀请码
        </div>
      </div>
      <div class="inviteWechat">
        <div class="inviteWechat-left">
          <span>已生成</span>
          <span>
            {{hasCode}}/{{codeCount}}
          </span>
        </div>
        <div class="inviteWechat-left inviteWechat-right">
          <span @click="goTo('HistoricalCode')">历史邀请码</span>
          <div class="imgbox">
            <img src="../../assets/more.png"/>
          </div>
        </div>
      </div>
    </div>
    <div class="black"></div>
    <div class="content">
      <div class="content-title">
        <div :class="currentTab == 0?'activated on': 'activated' " @click="getTabIndex($event)" :data-num = "0">
          未激活用户[{{failNum}}]
        </div>
        <div :class="currentTab == 1?'activated active': 'activated' " @click="getTabIndex($event)" :data-num = "1">
          已激活用户[{{successNum}}]
        </div>
      </div>
      <div class="notData" v-if="notData">暂无数据</div>
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
      <div class="activatedUser" v-for="item in myRecommendList">
        <div class="activatedUser-item">
          <div class="itemLeft">
            <img src="../../assets/img_touxiang.png" v-if="item.headImage==null || item.headImage==''"/>
            <img :src="item.headImage"  v-else/>
            <p class="realName">{{item.real_name}}</p>
          </div>
          <div class="itemRight">
            <p>
              <span class="phoneCard">{{item.name}}</span>
              <a :href="'tel://'+item.name"><img src="../../assets/icon_phone.png" class="phone"/></a>
            </p>
            <p>
              <span class="phoneCard">备注:</span><span class="noteContent">{{item.note}}</span>
              <img src="../../assets/icon_bj.png" class="phone" @click="searchNote(item.id)"/>
            </p>
            <p v-if="currentTab == 0 && item.audit_status==0">状态:<span class="SingleNum">待填写订单号</span></p>
            <p v-if="currentTab == 0 && item.audit_status==1">状态:<span class="SingleNum">待同步订单数据</span></p>
            <p v-if="currentTab == 0 && item.audit_status==2">状态:<span class="SingleNum">安全员审核成功</span></p>
            <p v-if="currentTab == 0 && item.audit_status==3">状态:<span class="SingleNum">自动审核失败</span></p>
            <p v-if="currentTab == 0 && item.audit_status==4">状态:<span class="SingleNum">待安全员审核</span></p>
            <p v-if="currentTab == 0 && item.audit_status==5">状态:<span class="SingleNum">安全员审核失败</span></p>
            <p>平台ID:{{item.code}}</p>
            <p v-if="currentTab == 1">{{item.lastMonthLabel}}:{{item.lastMonthAmount}}笔;{{item.currentMonthLabel}}:{{item.currentMonthAmount}}笔</p>
            <p v-if="currentTab == 1">任务总计:{{item.orders}}笔</p>
            <p>注册时间：{{item.registerTime | dateformat('YYYY-MM-DD')}}</p>
          </div>
          <div class="delBtn" v-if="currentTab == 0" @click="deleteRecommends(item.id)">移除成员</div>
        </div>
      </div>
        </mt-loadmore>
      </div>
    </div>
    <div class="icon" v-if="currentTab == 1">
      <div class="search" @click="searchItem" v-if="!searchFlg">
        <img src="../../assets/icon_sousuo.png">
      </div>
      <div class="search" @click="refresh" v-if="searchFlg">
        <img src="../../assets/icon_shuaxin.png">
      </div>
    </div>
  </div>
</template>
<script>
  import { MessageBox,Toast,Header,Spinner ,Loadmore,XHeader } from 'mint-ui';
  import {promoterCodeCount,getRewardMoney,queryInviteCode,myRecommends,deleteRecommends,
    updatePromoterInfo,createPromoterCode} from '@/api/getData'

  export default {
    components: {
      MessageBox,
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

        myRecommendList:null,//推荐de人
        successList:[],//推荐de人
        failList:[],//推荐de人
        failNum:0,//推荐人待审核数
        successNum:0,//推荐人已通过数
        keyword:null,//推荐人搜索
        pageNum:1,//当前页数
        pageSize:5,//每页大小
        pageTotal:0,//总条数
        commendType:false,
        currentNum:1,
        newCode:"",
        newCodeImg:"",
        coinMoney:0,
        hasCode:0,
        codeCount:0,
        currentTab:0,
        notData:false,
        searchFlg:false,//控制刷新按钮显示
        createCodeFlg:true//解决连点生成邀请码
      }
    },
    mounted:function(){
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.promoterCodeCount()
      this.getRewardMoney()
      this.queryInviteCode()
      this.myRecommends()
    },
    methods:{
      getTabIndex(e){
        this.currentTab = e.target.getAttribute('data-num')
        this.pageNum=1
        this.keyword=""
        this.myRecommendList=[]
        if(this.currentTab==0){
          this.commendType=false
          this.failList=[]
          this.myRecommends()
        }
        if(this.currentTab==1){
          this.commendType=true
          this.successList=[]
          this.myRecommends()
        }
      },
      goTo(name){
        this.$router.push({name:name})
      },
      searchItem(){
        MessageBox.prompt(' ', '已激活用户搜索', {inputPlaceholder: '请输入ID/手机号/姓名/备注'}).then(({ value, action }) => {
          console.log(value)
          this.keyword=value
          this.pageNum=1
          this.successList=[]
          this.myRecommends()
          this.searchFlg=true
        })
      },
      searchNote(promoterId){
        MessageBox.prompt(' ', '编辑备注', {inputPlaceholder: ''}).then(({ value, action }) => {
          console.log(value)
          this.updatePromoterInfo(value,promoterId)
        })
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
          if(this.currentTab==0){
            this.commendType=false
            this.failList=[]
          }else {
            this.commendType=true
            this.successList=[]
          }
          this.pageNum=1
          this.myRecommends()
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
            if(this.currentTab==0){
              this.commendType=false
            }else {
              this.commendType=true
            }
            this.myRecommends()
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
      async updatePromoterInfo(note,promoterId) {
        let param = {
          note: note,
          promoterId: promoterId
        };
        const res = await updatePromoterInfo(param);
        if (res.success) {
          if(this.currentTab==0){
            this.commendType=false
            this.failList=[]
          }else {
            this.commendType=true
            this.successList=[]
          }
          this.myRecommends()
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //推荐人统计
      async promoterCodeCount() {
        let param = {};
        const res = await promoterCodeCount(param);
        if (res.success) {
          this.hasCode=res.content.used
          this.codeCount=res.content.total
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //累计推荐金额
      async getRewardMoney() {
        let param = {};
        const res = await getRewardMoney(param);
        if (res.success) {
          this.coinMoney=res.content.coin
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //最新邀请码
      async queryInviteCode() {
        let param = {
          page: 1,
          pageSize: 10,
          promoterId: this.token.user.userId,
          used: false
        };
        const res = await queryInviteCode(param);
        if (res.success) {
          this.newCode=res.content.records[0].code
          this.newCodeImg=res.content.records[0].file
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //我推荐的人
      async myRecommends() {
        let param = {
          keyword: this.keyword,
          page: this.pageNum,
          pageSize: this.pageSize,
          success: this.commendType
        };
        const res = await myRecommends(param);
        if (res.success) {
          if(this.commendType){
            this.successNum=res.content.total
            if(this.currentNum==1){
              this.currentNum=2
            }else {
              for (var i=0;i<res.content.records.length; i++){
                this.successList.push(res.content.records[i])
              }
              //判断是否可以上拉加载
              if(this.successList.length>=res.content.total){
                this.allLoaded=true
              }else {
                this.allLoaded=false
              }
            }
          }else {
            this.failNum=res.content.total
            for (var i=0;i<res.content.records.length; i++){
              this.failList.push(res.content.records[i])
            }
            //判断是否可以上拉加载
            if(this.failList.length>=res.content.total){
              this.allLoaded=true
            }else {
              this.allLoaded=false
            }
          }

          if(this.currentTab==0){
            this.myRecommendList=this.failList
          }
          if(this.currentTab==1){
            this.myRecommendList=this.successList
          }
          if(this.myRecommendList.length<=0){
           this. notData=true
          }else {
            this. notData=false
          }
          this.pageNum=res.content.page
          this.pageTotal=res.content.total
          if(this.currentNum==1){
            this.commendType=true
            this.myRecommends()
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //移除我推荐的人
      async deleteRecommends(id) {
        let param = {
          promoterId: id
        };
        const res = await deleteRecommends(param);
        if (res.success) {
          Toast({
            message: '移除成功',
            iconClass: 'icon icon-fail'
          });
          this.commendType=false
          this.failList=[]
          this.myRecommends()
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //生成邀请码
      async createPromoterCode() {
        if(!this.createCodeFlg){
          return
        }
        this.createCodeFlg=false
        let param = {};
        const res = await createPromoterCode(param);
        if (res.success) {
          this.createCodeFlg=true
          Toast({
            message: '邀请码已生成',
            iconClass: 'icon icon-fail'
          });
          this.queryInviteCode()
          this.promoterCodeCount()
        } else {
          this.createCodeFlg=true
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      refresh(){
        this.searchFlg=false
        this.successList=[]
        this.commendType=true
        this.pageNum=1
        this.keyword=null
        this.myRecommends()
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #recommend{
    background:@bgmWhite;
    .top{
      padding:0 0.2rem;
      .flex;
      .between;
      .align;
      height:0.9rem;
      font-size:0.24rem;
      color:#333;
      border-bottom:0.02rem solid #e5e5e5;
      span{
        color:#ff8634;
      }
    }
    .InvitationCode{
      padding:0.3rem 0 0.2rem;
      .InvitationCode-top{
        width:5rem;
        height:0.8rem;
        margin:0 auto 0.3rem;
        .flex;
        .between;
        border:0.02rem solid #e5e5e5;
        .round(0.05rem);
        .InvitationCode-text{
          width:3.2rem;
          background:#f5f5f5;
          color:#333;
          font-size:0.24rem;
          text-align:center;
          line-height:0.8rem;
          .round(0.05rem);
        }
        .InvitationCode-text1{
          width:3.2rem;
          background:#f5f5f5;
          padding-left:0.2rem;
          line-height:0.8rem;
          text-align: center;
          img{
            vertical-align: middle;
            margin-right:0.4rem;
            width:0.4rem;
          }
          p{
            display: inline-block;
            font-size:0.26rem;
            span{
              font-size:0.26rem;
              color:#47a1f5;
            }
          }
        }
        .InvitationCode-btn{
          width:2.5rem;
          background:#f54848;
          color:#fff;
          text-align:center;
          margin-top:-0.02rem;
          .round(0.05rem);
          line-height:0.8rem;
          .font(0.24rem);
        }
      }
      .inviteWechat{
        .flex;
        .align;
        .between;
        height:0.36rem;
        line-height:0.36rem;
        .inviteWechat-left{
          width:100%;
          padding-left:0.7rem;
          .flex;
          span{
            margin-right:0.1rem;
            color:#333;
            font-size:0.24rem;
            &:nth-child(2){
              color:orange;
              font-size:0.24rem;
            }
          }

          .imgbox{
            width:0.38rem;
            height:0.3rem;
            margin:auto 0;
            img{
              width:0.38rem;
            }
          }
        }
        .inviteWechat-right{
          justify-content: flex-end;
          .flex;
          padding-left:0;
          padding-right:0.7rem;
          .imgbox{
            width:0.14rem;
            height:0.24rem;
            margin:auto 0;
            img{
              width:0.14rem;
            }
          }
        }
      }
    }
    .black{
      width:100%;
      height:0.1rem;
      background:#f3f6fe;
    }
    .content{
      padding-top:0.3rem;
      .content-title{
        width:4rem;
        height:0.7rem;
        margin:0 auto 0.3rem;
        border:0.02rem solid #d7d7d7;
        .round(0.35rem);
        .flex;
        .align;
        .activated{
          width:50%;
          text-align:center;
          color:#333;
          font-size:0.24rem;
        }
        .on{
          background:#f54848;
          color:#fff;
          height:0.7rem;
          line-height:0.7rem;
          border-radius:0.35rem 0 0 0.35rem;
          -webkit-border-radius: 0.35rem 0 0 0.35rem;
          -moz-border-radius: 0.35rem 0 0 0.35rem;
          -ms-border-radius:0.35rem 0 0 0.35rem;
          -o-border-radius:0.35rem 0 0 0.35rem;
        }
        .active{
          background:#f54848;
          color:#fff;
          height:0.7rem;
          line-height:0.7rem;
          border-radius:0rem 0.35rem 0.35rem 0rem;
          -webkit-border-radius: 0rem 0.35rem 0.35rem 0rem;
          -moz-border-radius: 0rem 0.35rem 0.35rem 0rem;
          -ms-border-radius:0rem 0.35rem 0.35rem 0rem;
          -o-border-radius:0rem 0.35rem 0.35rem 0rem;
        }
      }
      .notData{
        width:100%;
        margin:0 auto;
        width:1rem;
        font-size:0.24rem;
        color:#333;
      }
      .activatedUser{
        padding:0 0.2rem;
        .activatedUser-item{
          .flex;
          color:#666;
          font-size:0.24rem;
          padding:0.2rem 0;
          border-bottom:0.02rem solid #d7d7d7;
          .itemLeft{
            width:1.2rem;
            height:1.2rem;
            margin-right:0.2rem;
            img{
              width:100%;
              .round(50%);
            }
            .realName{
              width:1.2rem;
              text-align:center;
              margin-top:0.2rem;
            }
          }
          .itemRight{
            width:60%;
            p{
              margin-bottom:0.1rem;
              &:last-child{
                margin-bottom:0;
              }
              .SingleNum{
                color:#ff8634;
              }
              .phone{
                width:0.24rem;
              }
              .phoneCard{
                margin-right:0.1rem;
              }
              .noteContent{
                color:@org;
              }
            }
          }
          .delBtn{
            width:1.2rem;
            height:0.5rem;
            line-height:0.5rem;
            border:0.02rem solid #d7d7d7;
            color:#666;
            font-size:0.24rem;
            text-align:center;
            .round(0.05rem);
            margin-top:1rem;
          }
        }
      }
    }
    .icon{
      position:fixed;
      top:50%;
      right:3%;
      translate:transform(-50%,-50%);
      .search{
        width:0.6rem;
        height:0.6rem;
        background:#f54848;
        text-align: center;
        padding-top:0.15rem;
        .round(50%);
        &:first-child{
          margin-bottom:0.1rem;
        }
        img{
          width:0.34rem;
        }
      }
    }


    .page-loadmore-wrapper {
      overflow: scroll; // 很重要
      -webkit-overflow-scrolling : touch; // 解决view滑动速度慢或者卡顿问题
    }
  }
</style>
