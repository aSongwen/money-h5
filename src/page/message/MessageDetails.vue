<template>
  <div id="MessageDetails" v-if="content != null">
      <p class="firstTit">{{title}}</p>
      <div class="second">
        <p v-if="type==1" v-for="rray in array">{{rray}}</p>
        <p v-if="type==2">{{content}}</p>
        <p>时间:{{gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
      </div>
  </div>
</template>
<script>
  import {getUserMessage} from '@/api/getData';
  import { Toast} from 'mint-ui';
  export default {
    components: {
    },
    data(){
      return {
        userMessageId:'',
        gmtCreate:'',
        type:'',
        title:'',
        array:[],
        content:'',
      }
    },
    mounted:function(){
      this.getParams();
      this.getUserMessage();
    },
    methods:{
      getParams(){
        this.userMessageId = this.$route.query.id;
      },
      async getUserMessage(){
        let param = {"userMessageId":this.userMessageId};
        const res = await getUserMessage(param);
        if(res.success){
          var data = res.content;
          this.title = data.title;
          this.type = data.type;
          this.gmtCreate = data.gmtCreate;
          this.content = data.content;
          if(this.content != null && this.type == 1) {
            this.array = this.content.split(";");
          }
          }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
        }
    },
    watch :{
      '$route': 'getParams'
    },
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #MessageDetails{
    background: @bgmWhite;
    margin-top: 0.2rem;
    min-height:calc(~"100vh - 1.6rem");
    padding: 0.2rem;
    .font(0.24rem);
    color:#666;
    .firstTit{
      color:#333;
      .font(0.3rem);
      font-weight: bold;
      margin: 0.1rem 0;
    }
    .second{
      color:#666;
      p{
        margin-top: 0.3rem;
      }
    }
  }
</style>
