<template>
  <div id="send">
    <div class="sendTop">
      <img src="../../assets/icon_pdcg.png" alt="">
      <p>派单成功，等待您执行...</p>
    </div>
    <div class="sendContent">
      <div class="sendItem">
        <div>
          <img src="../../assets/icon_dfze.png" alt="">
          <p>垫付总额</p>
        </div>
        <p><span>{{sendTask.listing.price}}</span>元</p>
      </div>
      <div class="sendItem">
        <div>
          <img src="../../assets/icon_jlyj.png" alt="">
          <p>任务佣金</p>
        </div>
        <p><span>{{sendTask.executePrice}}</span>元</p>
      </div>
      <div class="sendItem">
        <div>
          <img src="../../assets/icon_daojishi.png" alt="">
          <p>限时完成</p>
        </div>
        <p><span>{{sendTask.timeOut}}</span>分钟</p>
      </div>
    </div>
    <div class="sendBtn">
      <p @click="goToOperationalTask(sendTask.executeTaskId)">操作任务</p>
      <p @click="goToCancelTask(sendTask.executeTaskId)">取消任务</p>
    </div>
  </div>
</template>
<script>
  export default {
    components: {
    },
    data(){
      return {
        sendTask:this.token.task
      }
    },
    mounted:function(){

    },
    methods:{
      goToOperationalTask(id){
        this.$router.push({
          path:"/OperationalTask",
          name:'OperationalTask',
          query : {
            id:id
          }
        })
      },
      goToCancelTask(id){
        this.$router.push({
          path:"/CancelTask",
          name:'CancelTask',
          params : {
            executeTaskId:id
          }
        })
      },
      goCancel(){
        this.$router.push({name:'CancelTask'})
      },
      goOperationalTask(){
        this.$router.push({name:'OperationalTask'})
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #send{
    background: @bgmWhite;
   .sendTop{
     text-align: center;
     height:2.2rem;
    border-bottom: 0.2rem solid @bgmBlue;
     img{
       width:1rem;
       height:1rem;
       margin-top: 0.3rem;
     }
     font-size: 0.24rem;
     color:#000;
   }
    .sendContent{
      padding:0 0.2rem;
      .sendItem{
        border-bottom: 1px solid #e5e5e5;
        .font(0.24rem);
        height:0.9rem;
        color:#333;
        .flex;
        .between;
        .align;
        img{
          width:0.44rem;
          height:0.44rem;
          margin-right: 0.2rem;
        }
        div{
          .flex;
          .align;
        }
        span{
          color:@org;
        }
      }
    }
  .sendBtn{
    text-align: center;
    .flex;
    .justify;
    flex-wrap: wrap;
    p{
      .font(0.24rem);
      width:80%;
      height:0.8rem;
      line-height: 0.8rem;
      .round;
      &:first-child{
        color:#fff;
        background: @red;
        margin-top: 0.5rem;
      }
      &:last-child{
        border: 1px solid #d7d7d7;
        margin-top: 0.2rem;
      }
    }
  }
  }
</style>
