<template>
  <div id="bindWeChat">
    <div class="bindContent">
      <p class="tit">微信绑定步骤</p>
      <p class="step">步骤一</p>
      <div>
        <p class="weChatName">{{wechatName}}</p>
        <span v-clipboard:copy="wechatName"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">长按复制</span>
      </div>
      <p>点击<span>【长按复制】</span>公众号名称，然后打开微信搜索并关注</p>
      <p class="step">步骤二</p>
      <p class="last">点击 <span>【获取验证码】</span>，然后 <span>回到本页面</span>填写，并提交。</p>
    </div>
    <div class="bindTop">
      <p class="title">输入验证码</p>
      <div class="topFirst">
        <security-code></security-code>
      </div>
      <div class="bindBtn" @click="promoterBindWechat">
        <p>提交</p>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { Toast ,MessageBox, Indicator,Swipe, SwipeItem} from 'mint-ui'
  import {promoterBindWechat,getWechatName} from '@/api/getData'

  Vue.component('security-code', {
    template: '<div class="security-code-wrap">' +
    '<label :for="`code-${uuid}`">' +
    '<ul :class="`${theme}-container security-code-container`">' +
    '<li class="field-wrap" v-for="(item, index) in length" :key="index">' +
    '<i class="char-field">{{value[index] || placeholder}}</i>' +
    '</li></ul></label>' +
    '<input ref="input" class="input-code" @keyup="handleInput($event)" v-model="value"' +
    ':id="`code-${uuid}`" :name="`code-${uuid}`" type="number" :maxlength="length"' +
    'autocorrect="off" autocomplete="off" autocapitalize="off"></div>',
    props: {
      length: {
        type: Number,
        default: 8
      },
      placeholder: {
        type: String,
        default: '—'
      },
      theme: {
        type: String,
        default: 'block'
      }
    },
    // variables
    data() {
      return {
        value: ''
      }
    },
    computed: {
      uuid() {
        return Math.random().toString(36).substring(3, 8)
      }
    },
    methods: {
      hideKeyboard() {
        // 输入完成隐藏键盘
        document.activeElement.blur() // ios隐藏键盘
        this.$refs.input.blur() // android隐藏键盘
      },
      handleSubmit() {
        //输入时，给输入框赋一次值
        this.$emit('input', this.value);
      },
      handleInput(e) {
        setTimeout(function(){
          // 设置body的高度为可视高度+302
          // 302为原生键盘的高度
          document.getElementsByTagName('body')[0].style.height = (window.innerHeight + 302) + 'px';
          document.body.scrollTop = 302;
        }, 300)
        this.$refs.input.value = this.value
        if (this.value.length >= this.length) {
          this.hideKeyboard()
        }
        this.handleSubmit()
      }
    }
  })
  export default {
    components: {},
    data() {
      return {
        type:"",
        validateCode:"",
        wechatName:"",
        timer:false
      }
    },
    mounted: function () {
      this.getParams();
      this.getWechatName()
    },
    methods: {
      getParams(){
        this.type = this.$route.query.type;
      },
      //绑定微信公众号
      async promoterBindWechat() {
        this.validateCode=this.$children[0].value
        if(this.validateCode==null || this.validateCode==""){
          Toast({
            message: '请输入验证码',
            iconClass: 'icon icon-fail'
          });
          return
        }
        let param = {
          validate_code:this.validateCode,
        };
        const res = await promoterBindWechat(param);
        if (res.success) {
          Toast({
            message: '提交成功，赶快去提现吧～',
            iconClass: 'icon icon-success'
          });
          this.sleepSeconds();
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //  3秒后进入群发记录
      sleepSeconds(){
        const TIME_COUNT = 3;
        if(!this.timer){
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(()=>{
            if(this.count > 0 && this.count <= TIME_COUNT){
              this.count--;
            }else{
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
              //跳转的页面写在此处
              this.$router.push({name:"weChatDeposit",query:{type:this.type}});
            }
          },1000)
        }
      },
      //获取微信公众号名称
      async getWechatName() {
        let param = {};
        const res = await getWechatName(param);
        if (res.success) {
          this.wechatName=res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      // 复制成功
      onCopy(e){
        console.log(e);
        Toast({
          message: '复制成功',
          iconClass: 'icon icon-success'
        });
      },
      // 复制失败
      onError(e){
        console.log("复制失败");
      },
    },
    watch:{
      "$route":"getParams"
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";

  #bindWeChat {
    background: #fff;
    .security-code-wrap {
      overflow: hidden;
    }
    .security-code-container {
      margin: 0;
      padding: 0;
      .flex;
    }
    .field-wrap {
      color:#666;
      list-style: none;
      display: block;
      height: 0.9rem;
      width: 0.4rem;
      line-height: 0.9rem;
      .font(0.14rem);
      margin-right: 0.3rem;
      &:last-child {
        margin-right: 0;
      }
    }
    .char-field {
      font-style: normal;
      font-size: 0.5rem;
    }
    .input-code {
      position: absolute;
      left: -9999px;
      top: -99999px;
      width: 0;
      height: 0;
      opacity: 0;
      overflow: visible;
      z-index: -1;
    }
    .bindTop {
      .font(0.3rem);
      color: #333;
      text-align: center;
      padding-top: 1rem;
      .topFirst {
        margin-top: 0.4rem;
        .flex;
        .justify;
        input{
          width:60%;
          height:0.5rem;
        }
      }
      .title{
        color:#333;
        .font(0.3rem)
      }
    }
    .bindBtn{
      .flex;
      .justify;
      p{
        background: @red;
        color:#fff;
        height:0.8rem;
        line-height: 0.8rem;
        margin-top: 0.3rem;
        width:45%;
        .round;
      }
    }
    .bindContent{
      text-align: left;
      /*margin-top: 1rem;*/
      padding: 0 0.3rem;
      .font(0.24rem);
      color:#666;
      span{
        color:@red;
      }
      div{
        .flex;
        .align;
        .weChatName{
          width:4rem;
          height:0.8rem;
          line-height: 0.8rem;
          text-align: center;
          border: 1px dashed #d7d7d7;
          margin-right: 0.4rem;
          margin-bottom: 0.2rem;
        }
      }
      .tit{
        .font(0.28rem);
        color:#333;
        font-weight: bold;
        margin: 0.4rem 0 0;
      }
      .step{
        border-left: 3px solid @red;
        .font(0.26rem);
        color:#666;
        padding-left: 0.1rem;
        margin: 0.3rem 0;
      }
      .last{
        color:#333;
      }
    }
  }
</style>
