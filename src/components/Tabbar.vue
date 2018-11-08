<template>
    <div class="tabbar" v-if="display">
      <div v-for="(list,index) in nav" @click="goChildren(list.name,index)" :class="{'active':index==isActive}">
        <span :class="list.cla"></span>
        <p>{{list.title}}</p>
      </div>
    </div>
</template>
<script>

  export default {
    name: 'Tabbar',
    data(){
      return {
        isActive:0,
        display:true,
        nav:[
          {title:'首页',name:"Home",cla:'first'},
          {title:'已接任务',name:'Task',cla:'second'},
          {title:'消息',name:'Message',cla:'third'},
          {title:'个人中心',name:'User',cla:'fourth'}
        ],
      }
    },
    mounted:function(){
      var getItem = sessionStorage.getItem("display");

//      if( getItem || getItem == 'null'){
//         getItem  = true;
//      }
      if(getItem){
        this.display = getItem == 'false'?false:true;
        this.isActive =  parseInt(sessionStorage.getItem("TabbarSelectIndex"));
      }
    },
    methods:{
      goChildren(name,index){
        this.isActive = index;
        this.$router.push({name:name})
        sessionStorage.setItem("TabbarSelectIndex", index);
      },
    },
    watch: {
      '$route'(to, from) {
//         对路由变化作出响应...
        let url = location.href.split("?")[0].split("/").pop();
        if(url == 'Home' || to.name == "Home"){
          sessionStorage.setItem("TabbarSelectIndex", 0);
          this.display = true;
          sessionStorage.setItem("display", true);
        }else if(url == 'Task' || to.name == "Task"){
          sessionStorage.setItem("TabbarSelectIndex", 1);
          this.display = true;
          sessionStorage.setItem("display", true);
        }else if(url == 'Message' || to.name == "Message" ){
          sessionStorage.setItem("TabbarSelectIndex", 2);
          this.display = true;
          sessionStorage.setItem("display", true);
        }else if(url == 'User' || to.name == "User"){
          sessionStorage.setItem("TabbarSelectIndex", 3);
          this.display = true;
          sessionStorage.setItem("display", true);
        }else{
          this.display = false;
          sessionStorage.setItem("display", false);
        }
        this.isActive =  parseInt(sessionStorage.getItem("TabbarSelectIndex"));
      },
    },
  }
</script>
<style lang="less">
  @import "../style/mixin.less";
  .tabbar{
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height:0.90rem;
    z-index: 888;
    div{
      display: block;
      float: left;
      width:25%;
      height: 10vh;
      text-align: center;
      .font(0.18rem);
      span{
        display:block;
        width:0.34rem;
        height:0.34rem;
        margin: 1.5984vw auto 0;
      }
      .first{
        background:url('../assets/nav_icon_shouye_def.png') center center no-repeat;
        background-size:100% 100%;
      }
      .second{
        background:url('../assets/nav_icon_renwu_def.png') center center no-repeat;
        background-size:100% 100%;
      }
      .third{
        background:url('../assets/nav)wodexiaoxi_def.png') center center no-repeat;
        background-size:100% 100%;
      }
      .fourth{
        background:url('../assets/nav_icon_centeri_def.png') center center no-repeat;
        background-size:100% 100%;
      }
      p{
        padding: .666vw 0;
        font-size: 3.33vw;
        color: #a5a8a7;
      }
    }
    .active{
      p{
        color:@red;
      }
      .first{
        background:url('../assets/nav_icon_shouye_sel.png') center center no-repeat;
        background-size:100% 100%;
      }
      .second{
        background:url('../assets/nav_icon_renwu_sel.png') center center no-repeat;
        background-size:100% 100%;
      }
      .third{
        background:url('../assets/nav)wodexiaoxi_sel.png') center center no-repeat;
        background-size:100% 100%;
      }
      .fourth{
        background:url('../assets/nav_icon_centeri_sel.png') center center no-repeat;
        background-size:100% 100%;
      }
    }
  }

</style>
