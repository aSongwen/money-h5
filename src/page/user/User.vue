<template>
  <div id="user" v-if="userInfo!=null">
    <div class="userTop">
      <img :src="userInfo.headImage" alt="">
      <p>{{userInfo.mobile}}</p>
      <p>ID:{{userInfo.code}}</p>
    </div>
    <div class="userSecond">
      <div>
        <p>任务完成总数</p>
        <p>{{taskNum}}</p>
      </div>
      <div>
        <p>我的推荐人</p>
        <p>{{userInfo.refereCode}}</p>
      </div>
    </div>
    <div class="userMenu" v-if="userInfo!=null">
      <div class="menuItem" @click="pushBind">
        <img src="../../assets/icon_05xxbd.png" alt="">
        <p>信息绑定</p>
      </div>
      <div class="menuItem menuItem2"  @click="pushRef" v-if="userInfo.identity==1 && userInfo.bindStatus == 2">
        <div class="itemFirst">
          <img src="../../assets/icon_06tjr.png" alt="">
          <p>我推荐的人</p>
        </div>
        <p class="menuNum" v-if="codeCount < 99">{{codeCount}}</p>
        <p class="menuNum" v-else>99+</p>
      </div>
      <div class="menuItem" @click="pushSta" v-if="userInfo.identity==1 && userInfo.bindStatus == 2">
        <img src="../../assets/icon_07tj.png" alt="">
        <p>统计</p>
      </div>
      <div class="menuItem" @click="customer">
        <img src="../../assets/icon_08bz.png" alt="">
        <p>帮助与客服</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { Toast ,MessageBox, Indicator,Swipe, SwipeItem} from 'mint-ui'
  import {loadPromoterInfo,getPromoteTasksCount,promoterCodeCount} from '@/api/getData'

  export default {
    data(){
      return {
        userInfo:null,//用户详情
        taskNum:null,//订单数
        codeCount:0,//邀请的用户数
      }
    },
    mounted:function(){
//      document.getElementsByClassName("mintui-back").item(0).style.visibility="hidden"
      this.loadPromoterInfo()
      this.getPromoteTasksCount()
      this.promoterCodeCount()
    },
    methods:{
      //查询用户详情
      async loadPromoterInfo() {
        let param = {
          deviceType: this.deviceType,
          headImage: null,
          address: null,
        };
        const res = await loadPromoterInfo(param);
        if (res.success) {
          this.userInfo=res.content
          this.token.user=res.content;
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询订单数量
      async getPromoteTasksCount() {
        let param = {
          shokeyStatus: "3"
        };
        const res = await getPromoteTasksCount(param);
        if (res.success) {
          for (var key in res.content) {
            if (key == 3) {
              this.taskNum = res.content[key]
            }
          }
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询我推荐的人数量
      async promoterCodeCount() {
        let param = {};
        const res = await promoterCodeCount(param);
        if (res.success) {
          this.codeCount=res.content.successUsed
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      pushBind(){
        this.$router.push({name:'bindInformation'})
      },
      pushRef(){
        this.$router.push({name:'Recommend'})
      },
      pushSta(){
        this.$router.push({name:'Statistics'})
      },
      customer(){
        // 在这里开启无按钮模式（常规情况下，需要紧跟在美洽嵌入代码之后）
        _MEIQIA('withoutBtn');
        // 你可以自己的代码中选择合适的时机来调用手动初始化
        _MEIQIA('init');
        // 初始化成功后调用美洽 showPanel
        _MEIQIA('allSet', function(){
          _MEIQIA('showPanel');
        });
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #user{
    background:@bgmWhite;
    .userTop{
      background: linear-gradient(to right, #ff514f,#fd3453);
      text-align: center;
      img{
        width:1.5rem;
        height:1.5rem;
        border: 5px solid #ff9fa8;
        border-radius: 50%;
        margin: 0.2rem 0;
      }
      p{
        padding-bottom: 0.2rem;
        color:#fff;
        .font(0.26rem)
      }
    }
    .userSecond{
      background: #e24047;
      height:1rem;
      .flex;
      padding: 0.13rem 0;
      .font(0.24rem);
      color:#fff;
      div{
        width:50%;
        text-align: center;
        &:first-child{
          border-right: 1px dashed #f19ea4;
        }
        p{
          &:first-child{
            margin-bottom: 0.14rem;
          }
        }
      }
    }
    .userMenu{
      padding: 0 0.2rem;
      .menuItem{
        height:0.9rem;
        border-bottom: 1px solid #e5e5e5;
        .flex;
        .align;
        .font(0.24rem);
        color:#333;
        position: relative;
        img{
          width:0.44rem;
          height:0.44rem;
          margin-right: 0.2rem;
        }
        &:first-child ::before,&:nth-child(2)::before,&:nth-child(3)::before{
          content:'';
          width:0.15rem;
          height:0.15rem;
          border-top: 1px solid #666;
          border-right: 1px solid #666;
          position: absolute;
          right:0.05rem;
          top:0.35rem;
          transform:rotate(45deg);
          -ms-transform:rotate(45deg); 	/* IE 9 */
          -moz-transform:rotate(45deg); 	/* Firefox */
          -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
          -o-transform:rotate(45deg); 	/* Opera */
        }
        .menuNum{
          width:0.4rem;
          height:0.4rem;
          background: @red;
          .round(50%);
          color:#fff;
          line-height:0.4rem;
          text-align: center;
          font-size:0.2rem;
        }
        .itemFirst{
          .flex;
          .align;
        }
      }
      .menuItem2{
        .between;
        padding-right: 0.5rem;
      }
    }
  }
</style>
