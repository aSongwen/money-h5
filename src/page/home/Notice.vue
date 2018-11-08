<template>
  <div id="Notice">
    <ul>
      <li @click="pushDetails(item.id)" v-for="(item,index) in notics" :key="item.id">
        <img class="leftImg" src="../../assets/icon_xiaoxi.png" alt="">
        <div class="NoticeContent">
          <div class="tit">
            <p class="first">{{item.title}}</p>
            <img class="new" src="../../assets/new.png" alt="" v-if="index==0">
          </div>
          <div class="time">{{item.gmt_create | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import { Toast ,MessageBox, Indicator,Swipe, SwipeItem} from 'mint-ui'
  import {querySystemMessage} from '@/api/getData'

  export default {
    components: {
    },
    data(){
      return {
        notics: [],//公告
      }
    },
    mounted:function(){
      this.querySystemMessage()
    },
    methods:{
      //查询系统公告
      async querySystemMessage() {
        let param = {
          applicationId:6,
          appId:"",
          status:1,
          page: 1,
          pageSize: 4
        };
        const res = await querySystemMessage(param);
        if (res.success) {
          this.notics=res.content.records;
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      pushDetails(id){
        this.$router.push({
          path:"/NoticeDetails",
          name:'NoticeDetails',
          params : {
            id:id
          }
          })
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #Notice{
    background: @bgmWhite;
    ul{
      padding: 0 0.2rem;
      li{
        .flex;
        .align;
        border-bottom: 1px solid #e5e5e5;
        padding: 0.3rem 0;
        .leftImg{
          width:0.88rem;
          height:0.88rem;
        }
        .NoticeContent{
          margin-left: 0.2rem;
          .tit{
            .flex;
            .align;
            .font(0.26rem);
            color:#333;
            margin-bottom: 0.3rem;
            .first{
              width:3.5rem;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }
            .new{
              width:0.6rem;
              height:0.26rem;
              margin-left: 0.4rem;
            }
          }
          .time{
            .font(0.22rem);
            color:#666;
          }
        }
      }
    }
  }
</style>
