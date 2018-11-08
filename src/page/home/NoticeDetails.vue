<template>
  <div id="NoticeDetails">
    <div class="title">
      <p>{{noticeDetail.title}}</p>
      <p>发布时间：{{noticeDetail.gmtCreate | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
    </div>
    <div class="details">
      {{noticeDetail.content}}
    </div>
  </div>
</template>
<script>
  import { Toast ,MessageBox, Indicator,Swipe, SwipeItem} from 'mint-ui'
  import {getSystemMessage} from '@/api/getData'

  export default {
    components: {},
    data() {
      return {
        noticeId: '',
        noticeDetail: ''
      }
    },
    created() {
      this.getParams()
    },
    mounted: function () {

    },
    methods: {
      getParams() {
        // 取到路由带过来的参数
        var paramsId = this.$route.params.id
        // 将数据放在当前组件的数据内
        this.noticeId = paramsId
        this.getSystemMessage()
      },
      //查询系统公告详情
      async getSystemMessage() {
        if (this.noticeId == null || this.noticeId == "") {
          Toast({
            message: '请传入参数',
            iconClass: 'icon icon-fail'
          });
          return
        }
        let param = {
          systemMessageId: this.noticeId
        };
        const res = await getSystemMessage(param);
        if (res.success) {
          this.noticeDetail=res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";

  #NoticeDetails {
    background: @bgmWhite;
    padding: 0 0.2rem;
    p {
      text-align: center;
    }
    .title {
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 0.2rem;
      p {
        &:first-child {
          .font(0.26rem);
          color: #333;
          padding: 0.3rem 0;
        }
        &:last-child {
          .font(0.22rem);
          color: #666;
        }
      }
    }
    .details {
      padding: 0.3rem 0;
      .font(0.24rem);
      color: #666;
      line-height: 0.44rem;
    }
  }
</style>
