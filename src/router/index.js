import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/Login/Login'
import Register from '@/page/Login/Register'
import Register2 from '@/page/Login/Register2'
import Register3 from '@/page/Login/Register3'
import Index from '@/page/Index'
import Home from '@/page/home/Home'
import Commission from '@/page/home/Commission'
import Task from '@/page/task/Task'
import OperationalTask from '@/page/task/OperationalTask'
import EvaluationTask from '@/page/task/EvaluationTask'
import weChatDeposit from '@/page/home/weChatDeposit'
import depositDetails from '@/page/home/depositDetails'
import OrderSet from '@/page/home/OrderSet'
import Notice from '@/page/home/Notice'
import NoticeDetails from '@/page/home/NoticeDetails'
import Message from '@/page/message/Message'
import MessageDetails from '@/page/message/MessageDetails'
import User from '@/page/user/User'
import Send from '@/page/home/Send'
import CancelTask from '@/page/home/CancelTask'
import bindWeChat from '@/page/home/bindWeChat'
import waitReview from '@/page/task/waitReview'
import bindInformation from '@/page/user/bindInformation'
import Recommend from '@/page/user/Recommend'
import HistoricalCode from '@/page/user/HistoricalCode'
import Statistics from '@/page/user/Statistics'
import changeMobile from '@/page/user/changeMobile'
import bindBankCard from '@/page/user/bindBankCard'
import ReviseQQ from '@/page/user/ReviseQQ'
import ReviseWX from '@/page/user/ReviseWX'
import bindIdCard from '@/page/user/bindIdCard'
import  PullUp from '@/page/demo/PullUp'
import StatisticsDetails from '@/page/user/StatisticsDetails'
import  RestrictAccess from '@/page/Login/RestrictAccess'
import WithdrawalSuccess from '@/page/home/WithdrawalSuccess'
import IsWeixin from '@/page/Login/IsWeixin'

Vue.use(Router)

const route=new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login

    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Register2',
      name: 'Register2',
      component: Register2
    },
    {
      path: '/Register3',
      name: 'Register3',
      component: Register3
    },
    {
      path: '/RestrictAccess',
      name: 'RestrictAccess',
      component: RestrictAccess
    },
    {
      path: '/IsWeixin',
      name: 'IsWeixin',
      component: IsWeixin
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      children:[
        {
          path: '/Home',
          name: 'Home',
          component: Home,
          meta: {
            title: "首页"
          }
        },
        {
          path: '/Commission',
          name: 'Commission',
          component: Commission,
          meta: {
            title: "明细"
          }
        },
        {
          path: '/Task',
          name: 'Task',
          component: Task,
          meta: {
            title: "已接任务"
          }
        },
        {
          path: '/OperationalTask',
          name: 'OperationalTask',
          component: OperationalTask,
          meta: {
            title: "操作任务"
          }
        },
        {
          path: '/EvaluationTask',
          name: 'EvaluationTask',
          component: EvaluationTask,
          meta: {
            title: "评价任务"
          }
        },
        {
          path: '/weChatDeposit',
          name: 'weChatDeposit',
          component: weChatDeposit,
          meta: {
            title: "提现"
          }
        },
        {
          path: '/depositDetails',
          name: 'depositDetails',
          component: depositDetails,
          meta: {
            title: "提现记录"
          }
        },
        {
          path: '/OrderSet',
          name: 'OrderSet',
          component: OrderSet,
          meta: {
            title: "接单设置"
          }
        },
        {
          path: '/Notice',
          name: 'Notice',
          component: Notice,
          meta: {
            title: "公告"
          }
        },
        {
          path: '/NoticeDetails',
          name: 'NoticeDetails',
          component: NoticeDetails,
          meta: {
            title: "公告详情"
          }
        },
        {
          path: '/Message',
          name: 'Message',
          component: Message,
          meta: {
            title: "我的消息"
          }
        },
        {
          path: '/MessageDetails',
          name: 'MessageDetails',
          component: MessageDetails,
          meta: {
            title: "消息详情"
          }
        },
        {
          path: '/User',
          name: 'User',
          component: User,
          meta: {
            title: "个人中心"
          }
        },
        {
          path: '/Send',
          name: 'Send',
          component: Send,
          meta: {
            title: "派单成功"
          }
        },
        {
          path: '/bindWeChat',
          name: 'bindWeChat',
          component: bindWeChat,
          meta: {
            title: "绑定微信"
          }
        },
        {
          path: '/CancelTask',
          name: 'CancelTask',
          component: CancelTask,
          meta: {
            title: "选择取消原因"
          }
        },
        {
          path: '/waitReview',
          name: 'waitReview',
          component: waitReview,
          meta: {
            title: "等待审核"
          }
        },
        {
          path: '/bindInformation',
          name: 'bindInformation',
          component: bindInformation,
          meta: {
            title: "信息绑定"
          }
        },
        {
          path: '/Recommend',
          name: 'Recommend',
          component: Recommend,
          meta: {
            title: "我推荐的人"
          }
        },
        {
          path: '/HistoricalCode',
          name: 'HistoricalCode',
          component: HistoricalCode,
          meta: {
            title: "查看历史邀请码"
          }
        },
        {
          path: '/Statistics',
          name: 'Statistics',
          component: Statistics,
          meta: {
            title: "统计"
          }
        },
        {
          path: '/changeMobile',
          name: 'changeMobile',
          component: changeMobile,
          meta: {
            title: "更换手机号"
          }
        },
        {
          path: '/bindBankCard',
          name: 'bindBankCard',
          component: bindBankCard,
          meta: {
            title: "绑定银行卡"
          }
        },
        {
          path: '/ReviseQQ',
          name: 'ReviseQQ',
          component: ReviseQQ,
          meta: {
            title: "修改QQ"
          }
        },
        {
          path: '/ReviseWX',
          name: 'ReviseWX',
          component: ReviseWX,
          meta: {
            title: "修改微信"
          }
        },
        {
          path: '/bindIdCard',
          name: 'bindIdCard',
          component: bindIdCard,
          meta: {
            title: "绑定身份证"
          }
        },
        {
          path: '/PullUp',
          name: 'PullUp',
          component: PullUp,
          meta: {
            title: "demo"
          }
        },
        {
          path: '/StatisticsDetails',
          name: 'StatisticsDetails',
          component: StatisticsDetails,
          meta: {
            title: "任务明细"
          }
        },
        {
          path: '/WithdrawalSuccess',
          name: 'WithdrawalSuccess',
          component: WithdrawalSuccess,
          meta: {
            title: "提现成功"
          }
        },
        ]
    }
  ]
})
route.beforeEach(function (to, from, next) {

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  } else if (to.meta.title == "" || to.meta.title == null ){
    document.title ="apple"
  }
  next()
});
export default route;
