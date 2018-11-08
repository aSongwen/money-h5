<template>
  <div id="Index" >
    <!--<mt-header title="首页" id="title_text">-->
    <!--<router-link to="" slot="left">-->
    <!--<mt-button icon="back" @click="back" id="back_1"></mt-button>-->
    <!--</router-link>-->
    <!--</mt-header>-->
    <div class="Main" :style="{ 'background-image': 'url(' + url + ')' }">
      <router-view/>
    </div>
    <Tabbar />
  </div>
</template>
<script>
  import { Header} from 'mint-ui';
  import Tabbar  from '@/components/Tabbar';
  import {getStore, setStore} from "../config/mUtils"
  export default {
    components: {
      Header,
      Tabbar
    },
    data(){
      return {
        url:getStore("bgmarkUrl")
      }

    },
    mounted:function(){

    },
    watch: {
      '$route': function () {
        var overTime = getStore("access_overtime");
        var currentTime = new Date().getTime();
        if (currentTime > overTime || !overTime||overTime=='') {
          this.$router.push({name: 'login'});
        }
      }
    },
    methods:{
      back() {
        this.$router.go(-1);//返回上一层
      },
    }
  }
</script>
<style lang="less">
  @import "../style/mixin.less";
  #Index{
    background: #fff;
    overflow-x: hidden;
    .Main{
      background: #f3f6fe;
      /*margin-bottom:1rem;*/
      /*<!--margin-top: @headerHeight;-->*/
      /*height:calc(~"100vh - 1.55rem");*/
      /*overflow: scroll;*/
      /*margin-bottom: 0.95rem;*/
      /*border-bottom: 0.95rem solid #fff;*/
    }
    .mint-header{
      background-image: linear-gradient(to left, #fd2f53,#ff514f);
      height:0.64rem;
      font-size: 0.28rem;
      position:fixed;
      top:0;
      left:0;
      width:100%;
      z-index:999;
    }
  }
</style>
