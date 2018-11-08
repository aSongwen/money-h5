<template>
  <div id="CancelTask" >
    <div class="cancelTop">
      选择取消原因
    </div>
    <div class="cancelList">
      <div class="lists" @click="choseCancel(index)" v-for="(item,index) in list" :class="{'active':index==isActive}">
        <p class="img"></p>
        <p>{{item.title}}</p>
      </div>
    </div>
    <div class="lastBtn" @click="submitResult">申请取消并派送给其他用户</div>
  </div>
</template>
<script>
  import {submitResult} from '@/api/getData';
  import {Toast} from 'mint-ui';
  export default {
    components: {
    },
    data(){
      return {
        isActive:0,
        executeTaskId:'',
        failReason:'',
        list:[
          {title:'商品找不到'},
          {title:'达不到商家备注要求'},
          {title:'不想做了'},
          {title:'本金不够'},
          {title:'问题任务'},
          {title:'没时间做'}
        ],
      }
    },
    mounted:function(){
      this.getParams();
    },
    methods:{
      choseCancel(index){
        this.isActive = index;
      },
      async submitResult(){
        let param = {
          executeTaskId: this.executeTaskId,
          status: 3,
          failReason:this.list[this.isActive].title
        };
        const res = await submitResult(param);
        if (res.success) {
          Toast({
            message: "已放弃!",
            iconClass: 'icon icon-success'
          });
          this.goTo("Task");
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      getParams(){
        this.executeTaskId = this.$route.params.executeTaskId;
      },
      goTo(name){
        this.$router.push({name:name})
      }
    },
    watch :{
      '$route': 'getParams'
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #CancelTask{
   background:@bgmWhite;
    height:100vh;
    .font(0.24rem);
    color:#333;
    .cancelTop{
      background: @bgmBlue;
      color:#666;
      height:0.6rem;
      line-height: 0.6rem;
      padding-left: 0.2rem;
    }
    .cancelList{
      padding: 0 0.2rem;
     .lists{
       border-bottom: 1px solid #d7d7d7;
       height:0.9rem;
       .flex;
       .align;
       .img{
         margin-right: 0.2rem;
         width:0.36rem;
         height:0.36rem;
         background: url("../../assets/btn_04.png")no-repeat;
         background-size: 100%;
       }
     }
      .active{
        .img{
          margin-right: 0.2rem;
          width:0.36rem;
          height:0.36rem;
          background: url("../../assets/btn_03.png")no-repeat;
          background-size: 100%;
        }
      }
    }
    .lastBtn{
      width:100%;
      background: @red;
      color:#fff;
      .font(0.24rem);
      text-align: center;
      height:0.8rem;
      line-height: 0.8rem;
      position: fixed;
      bottom: 0;
    }
  }
</style>
