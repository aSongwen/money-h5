<template>
 <div id="OperationalTask" >
   <div class="top">
      <div class="top-left">
        <img src="../../assets/clock.png"/>
        <div class="changeTask" v-if="this.shokeyStatus == 4">
          <span>任务倒计时:{{timeLimit}}</span>
          <p class="chance">注意:只有一次修正机会</p>
        </div>
        <div class="changeTask" v-else style="font-size:0.24rem;">
          <span>任务倒计时:{{timeLimit}}</span>
        </div>
      </div>
      <div class="top-right" @click="giveUpTask">放弃任务</div>
    </div>
   <div class="TaskTitle tit2">
     <div class="title">目标任务</div>
   </div>
   <div class="content">
     <div class="content-left">
       <img :src="mainImageUrl"/>
     </div>
     <div class="content-right">
       <p>{{enTitle}}</p>
       <p>搜索展示价格:<span>{{showPrice}}元</span></p>
       <p>排序位置:约{{payerNum}}人付款</p>
       <p><img src="../../assets/icon_dizhi.png"/><span>{{deliveryArea}}</span></p>
     </div>
   </div>
   <div class="blank"></div>
   <div class="detail">
     <div class="detail-content">
       <p class="detail-left"><img src="../../assets/icon_ssgjc.png"/>搜索关键字</p>
       <div class="detail-right">
         <p>{{keyword}}</p>
         <p v-clipboard:copy="this.keyword" v-clipboard:success="onCopy" v-clipboard:error="onError">点击复制关键字</p>
       </div>
     </div>
   </div>
   <div class="detailOther">
       <p class="detail-left"><img src="../../assets/icon_pxdj.png"/>拍下单价</p>
       <div class="detail-right">
         <p><span class="money">{{price}}</span>元</p>
       </div>
   </div>
   <div class="detailOther">
     <p class="detail-left"><img src="../../assets/icon_gmsl.png"/>购买数量</p>
     <div class="detail-right">
       <p>{{buyCount}}件</p>
     </div>
   </div>
   <div class="detailOther">
     <p class="detail-left"><img src="../../assets/icon_yfze.png"/>应付总额</p>
     <div class="detail-right">
       <p><span class="money">{{price * buyCount}}</span>元</p>
     </div>
   </div>
   <div class="detailOther">
     <p class="detail-left"><img src="../../assets/money.png"/>奖励佣金</p>
     <div class="detail-right">
       <p><span class="money">{{executeData.executePrice}}</span>元</p>
     </div>
   </div>
   <div class="detail">
     <div class="detail-content">
       <p class="detail-left"><img src="../../assets/icon_sjyq.png"/>商家要求</p>
       <div class="detail-right">
         <p>{{executeData.notes}}</p>
       </div>
     </div>
   </div>
   <div class="TaskTitle">
     <div class="title">核验任务</div>
   </div>
   <div class="Verification">
     <div class="VerificationItem">
       <p>①</p>
       <p>商家店铺名：</p>
       <p>{{webStoreName}}</p>
     </div>
     <div class="VerificationItem VerificationItem1">
       <p>②</p>
       <div class="taoToken">
         <input placeholder="请粘贴分享淘口令或商品" v-model="linkAddress"/>
         <img @click="deleteInput" src="../../assets/icon_delete.png" v-if="linkAddress!=''" alt="">
       </div>
       <div class="check" @click="checkUrl">核对</div>
     </div>
   </div>
   <div class="TaskTitle">
     <div class="title">提交订单</div>
   </div>
   <div class="submitOrder">
     请确定是用绑定的<span>{{taobao}}</span>账号下单
   </div>
   <div class="warming">
     <p class="warmingTitle">
       <img src="../../assets/icon_zysx.png"/>
       <span>注意事项</span>
     </p>
     <div class="warmingContent">
       <div class="warmingItem">
         <input type="checkbox" id="awesome" v-model="checkbool1" @change="checkboxChange1"/>
         <label for="awesome">已确认使用账号“<span class="taobaoName">{{taobao}}</span>”下单</label>
       </div>
       <div class="warmingItem">
         <input type="checkbox" id="awesome1"  v-model="checkbool2" @change="checkboxChange2"/>
         <label for="awesome1">已确认未使用花呗/信用卡/淘客方式付款</label>
       </div>
       <div class="warmingItem">
         <input type="checkbox" id="awesome2"  v-model="checkbool3" @change="checkboxChange3"/>
         <label for="awesome2">已确认下单金额以及下单要求符合任务要求</label>
       </div>
       <div class="warmingItem">
         <input type="checkbox" id="awesome3"  v-model="checkbool4" @change="checkboxChange4"/>
         <label for="awesome3">我会在1小时内付款并提交任务,防止任务被释放</label>
       </div>
     </div>
   </div>
   <mt-button :disabled="isDisabled" :class="isDisabled?'submitBtn':'submitBtn1'" @click="submitResult">
     提交任务
   </mt-button>
 </div>
</template>
<script>
  import { Header,MessageBox,Toast} from 'mint-ui';
  import {getTaskDetail,submitResult,linksCheck} from '@/api/getData'
  import {addListener,removeListener} from '../../utils/pageStatus'


  export default {
    components: {
      Header
    },
    data() {
      return {
        mainImageUrl:'',
        isDisabled:true,
        executeTaskId: '',
        executeData: '',
        linkAddress: '',
        taobao: '',
        timeLimit: '',
        checkbool1: false,
        checkbool2: false,
        checkbool3: false,
        checkbool4: false,
        realTime: '',
        bool:false,
        enTitle:'',
        showPrice:'',
        payerNum:'',
        deliveryArea:'',
        keyword:"",
        price:'',
        buyCount:'',
        webStoreName:'',
        timer:'',
        realStartTime:'',
        endTime:'',
        timeOut:'',
        currentServerTime:'',
        realEndTime:'',
        enOutTime:true,
        shokeyStatus:'',
      }
    },
    mounted: function () {
      addListener();
      this.taobao = sessionStorage.getItem("taobao");
      this.getParams();
    },

    destroyed:function () {
      removeListener();
    },
    methods: {
      deleteInput(){
        this.linkAddress = ''
      },
      giveUpTask() {
        MessageBox.confirm('', {
          message: '确定放弃任务吗?',
          title: '提示',
          showConfirmButton:true,
          showCancelButton:true,
          cancelButtonClass:'cancelButton',
          confirmButtonClass:'confirmButton',
          confirmButtonText:'是',
          cancelButtonText:'否'
        }).then(action => {
          if (action == 'confirm') {
            this.$router.push({name: "CancelTask",params:{executeTaskId:this.executeTaskId}})
          }
        }).catch(err => {
          if (err == 'cancel') {
            console.log('否');
          }
        });
      },

      async checkUrl() {
        if(this.linkAddress != null && this.linkAddress.length > 0) {
          let param = {"linkAddress": this.linkAddress, "executeTaskId": this.executeTaskId};
          const res = await linksCheck(param);
          if (res.success) {
            Toast({
              message: '商品正确',
              iconClass: 'icon icon-success'
            });
            this.bool = true;
          } else {
            MessageBox.alert(res.errmsg, '错误提示');
            this.bool = false;
          }
        }else{
          Toast({
            message: "淘宝链接不能为空!",
            iconClass: 'icon icon-fail'
          });
          this.bool = false;
        }
      },

      async getTaskDetail() {
        if(this.executeTaskId == null){
          Toast({
            message: "任务ID不能为空!",
            iconClass: 'icon icon-fail'
          });
          return;
        }
        let param = {"executeTaskId": this.executeTaskId};
        const res = await getTaskDetail(param);
        if (res.success) {
          if (res.content != null) {
            this.executeData = res.content;
            if(res.content.listing != null){
              this.mainImageUrl = res.content.listing.mainImageUrl;
              this.enTitle = res.content.listing.title;
              this.showPrice = res.content.listing.showPrice;
              this.payerNum = res.content.listing.payerNum;
              this.deliveryArea = res.content.listing.deliveryArea;
              this.price = res.content.listing.price;
            }
            if(res.content.task != null){
              this.keyword = res.content.task.keyword;
              this.buyCount = res.content.task.buyCount;
              this.webStoreName = res.content.task.webStoreName;
              this.realStartTime = parseInt(res.content.task.realStartTime);
              this.shokeyStatus = res.content.task.shokeyStatus;
            }
            this.currentServerTime = parseInt(res.content.currentServerTime);
            this.timeOut = parseInt(res.content.timeOut);
            if(this.shokeyStatus == 4 && res.content.task.shokeyAuditTime){
              this.realEndTime = parseInt(res.content.task.realEndTime);
            }else{
              this.realEndTime = this.realStartTime + this.timeOut;
            }
            this.endTime = this.realEndTime - this.currentServerTime;
            this.realTime = Math.floor(this.endTime / 1000);
            if (this.realTime > 0) {
              this.settimer(this.realTime);
            } else {
              this.timeLimit = '任务已超时';
              this.enOutTime = false;
            }
          }else{
            Toast({
              message: '待操作的任务不存在',
              iconClass: 'icon icon-fail'
            });
          }
          } else {
            Toast({
             message: res.errmsg,
             iconClass: 'icon icon-fail'
            });
         }
      },

    settimer:function(time){
        var end = parseInt(this.currentServerTime)+1000;
        if(this.realEndTime > end){
          time--;
          if(time<=0){
            clearTimeout(this.timer);
            this.timeLimit = '任务已超时';
            this.enOutTime = false;
            return;
          }
          this.timeLimit = this.formatTime(time);
          let that = this;
          this.timer = setTimeout(function () {
            that.settimer(time)
          }, 1000);
        }else{
          clearTimeout(this.timer);
          this.timeLimit = '任务已超时';
          this.enOutTime = false;
        }
      },
      formatTime:function(time1){
       var hour = Math.floor(time1/3600)
       var min = Math.floor((time1-hour*3600)/60);
       var sec = time1 - hour * 3600 - min * 60;
       var date = '';
        if (hour < 10) {
          date = date + '0' + hour;
        } else {
          date = date + hour;
        }
        if (min < 10) {
          date = date + ':0' + min;
        } else {
          date = date + ':' + min;
        }
        if(sec < 10){
          date = date + ':0' + sec;
        }else{
          date = date + ':' + sec;
        }
        return date;
      },

      onCopy(e) {
        console.log(e);
        Toast({
          message: '复制成功',
          iconClass: 'icon icon-success'
        });
      },

      // 复制失败
      onError(e) {
        console.log("复制失败");
      },

      getParams() {
        this.executeTaskId = this.$route.query.id;
        this.getTaskDetail();
      },

      async submitResult() {
        if(!this.enOutTime){
          Toast({
            message: "任务已超时!",
            iconClass: 'icon icon-fail'
          });
          return
        }
        if(!this.bool){
          Toast({
            message: "请先核对商品信息!",
            iconClass: 'icon icon-fail'
          });
          return
        }
        let param = {
          executeTaskId: this.executeTaskId,
          status: 1
        };
        const res = await submitResult(param);
        if (res.success) {
          Toast({
            message: "提交成功",
            iconClass: 'icon icon-success'
          });
          this.goTo("waitReview");
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },

      goTo(name) {
        this.$router.push({name: name})
      },

      //复选框1
      checkboxChange1() {
        this.checkDisable();
      },

      //复选框2
      checkboxChange2() {
        this.checkDisable();
      },

      //复选框3
      checkboxChange3() {
        this.checkDisable();
      },

      //复选框4
      checkboxChange4() {
        this.checkDisable();
      },

      //是否显示提交任务按钮
      checkDisable() {
        if (this.checkbool1 && this.checkbool2 && this.checkbool3 && this.checkbool4 && this.enOutTime) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
      }
    }

  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
#OperationalTask{
  /*background:#fff;*/
  .top{
    background:#ffe9d8;
    height:0.7rem;
    width:100%;
    padding:0 0.2rem;
    color:#333;
    font-size:0.28rem;
    position: fixed;
    top:0;
    .flex;
    .between;
    .align;
    .top-left{
      .flex;
      .align;
      img{
        width:0.36rem;
        height:0.36rem;
        vertical-align: middle;
        margin-right:0.2rem;
      }
      .changeTask{
        font-size:0.22rem;
        .chance{
          color:#666;
        }
      }
    }
    .top-right{
      width:1.2rem;
      height:0.4rem;
      line-height: 0.4rem;
      font-size:0.24rem;
      color:#666;
      border:1px solid #d7d7d7;
      text-align:center;
      .round(0.04rem)
    }
  }
  .tit2{
    margin-top: 0.7rem;
  }
  .TaskTitle{
    height:0.6rem;
    background:#f3f6fe;
    width:100%;
    padding:0 0.2rem;
    .flex;
    .align;
    .title{
      height:0.3rem;
      font-size:0.24rem;
      color:#666;
      line-height:0.3rem;
      border-left:0.04rem solid @red;
      padding-left:0.1rem;
    }

  }
  .content{
    .flex;
    .align;
    background: @bgmWhite;
    padding:0 0.2rem;
    .content-left{
      width:2rem;
      img{
        width:100%;
        .round(0.05rem);
      }
    }
    .content-right{
      margin-left:0.2rem;
      p{
        font-size:0.24rem;
        color:#666;
        margin-bottom:0.2rem;
        &:nth-child(1){
          margin:0.28rem 0 0.3rem 0;
          font-size:0.3rem;
          color:#333;
        }
        &:nth-child(2){
          span{
            color:#ff8634;
          }
        }
        &:nth-child(4){
          img{
            width:0.3rem;
            margin-right:0.1rem;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .blank{
    width:100%;
    height:0.1rem;
    background: #f3f6fe;
  }
  .detail{
    .detail-content{
      .flex;
      .between;
      margin:0 0.2rem;
      background: @bgmWhite;
      border-bottom:0.02rem solid #e5e5e5;
      color:#333;
      font-size:0.24rem;
      padding:0.3rem 0;
      .detail-left{
        img{
          width:0.44rem;
          margin-right:0.2rem;
          vertical-align: middle;
        }
      }
      .detail-right{
        p{
          &:nth-child(1){
            margin-bottom:0.2rem;
            text-align:right;
            width: 4rem;
          }
          &:nth-child(2){
            color:#47a1f5;
            text-align:right;
          }
        }
      }
    }
  }
  .detailOther{
    height:0.9rem;
    .flex;
    .align;
    .between;
     margin:0 0.2rem;
     border-bottom:0.02rem solid #e5e5e5;
     color:#333;
     font-size:0.24rem;
    background:@bgmWhite;
     .detail-left{
        img{
          width:0.44rem;
          vertical-align: middle;
          margin-right:0.2rem;
        }
     }
    .detail-right{
      .money{
        color:#ff8634;
      }
    }
  }
  .requirement{
    height:1.6rem;
  }
  .Verification{
    padding:0.35rem  0.2rem 0.2rem;
    font-size:0.24rem;
    color:#333;
    background: @bgmWhite;
    .VerificationItem1{
      .flex;
    }
    .VerificationItem{
      margin-bottom:0.4rem;
      p{
        display: inline-block;
        &:nth-child(1){
          font-size:0.38rem;
          color:#f54848;
          margin-right:0.2rem;
        }
        &:nth-child(2){
          margin-right:0.35rem;
        }
      }
      .taoToken{
        width:3.8rem;
        height:0.6rem;
        position: relative;
        input{
          font-size:0.22rem;
          width:100%;
          height:100%;
          padding-left:0.1rem;
          border:1px solid #d7d7d7;
          &::-webkit-input-placeholder{
            color: #666;
            font-size:0.22rem;
          }
        }
        img{
          width:0.38rem;
          height:0.38rem;
          position: absolute;
          right:0.2rem;
          top:0.12rem;
        }
      }
      .check{
        margin-left: 0.2rem;
        width:1.2rem;
        height:0.6rem;
        line-height:0.6rem;
        background:#f54848;
        color:#fff;
        font-size:0.24rem;
        .round(0.04rem);
        text-align:center;
        display: inline-block;
        vertical-align: middle;
      }
    }

  }
  .submitOrder{
    height:1.2rem;
    line-height:1.2rem;
    color:#333;
    font-size:0.24rem;
    padding:0 0.2rem;
    background:@bgmWhite;
    span{
      color:#f54848;
    }
  }
  .warming{
    background:rgba(255,246,250,0.7);
    padding:0.3rem 0 1rem 0.2rem;
    .warmingTitle{
      .flex;
      .align;
      margin-bottom:0.4rem;
      img{
        width:0.26rem;
        margin-right:0.1rem;
       vertical-align: middle;
      }
      span{
        color:#f54848;
        font-size:0.24rem;
      }
    }
    .warmingContent{
      .warmingItem{
        margin-bottom:0.3rem;
        color:#333;
        font-size:0.24rem;
        .taobaoName{
          color:@red;
        }
        input[type="checkbox"] {
          position: absolute;
          clip: rect(0, 0, 0, 0);

        }

        input[type="checkbox"]+label::before {
          content: '\a0';
          display: inline-block;
          vertical-align: .2em;
          width:0.36rem;
          height:0.36rem;
          margin-right: 0.2rem;
          border-radius: .2em;
          text-indent: .15em;
          border:0.02rem solid #d7d7d7;
        }

        input[type="checkbox"]:checked+label::before {
          background:url("../../assets/icon_xz.png")  center center no-repeat;
          background-size: 150%;
        }

      }
    }
  }
  .submitBtn{
    width:100%;
    height:0.8rem;
    line-height:0.8rem;
    color:#999;
    font-size:0.24rem;
    text-align: center;
    position:fixed;
    bottom:0;
    left:0;
  }
  .submitBtn1{
    background: #f54848;
    color:#fff;
    width:100%;
    height:0.8rem;
    line-height:0.8rem;
    font-size:0.24rem;
    text-align: center;
    position:fixed;
    bottom:0;
    left:0;
  }
  .mint-button.is-disabled{
    opacity: 1;
  }
}
</style>
