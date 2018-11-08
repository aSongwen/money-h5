import {Toast, MessageBox, Indicator, Swipe, SwipeItem} from 'mint-ui'
import {getStore, setStore} from "./config/mUtils"
import {refreshToken} from '@/api/getData'

export default {
  task: null,//接单时存放订单信息
  user: null,//佣金
  install(Vue, options) {
    //获取token状态
    Vue.prototype.getToken = function () {
      var access_token = getStore('access_token');
      var local_access_overtime = getStore('local_access_overtime');
      var local_refresh_overtime = getStore('local_refresh_overtime');
      var date = new Date().getTime();
      if (access_token != null && access_token.length > 0) {
        if (date < local_access_overtime) {
          return 0;
        } else {
          if (date < local_refresh_overtime) {
            this.token.methods.refreshToken();
            return 1;
          } else {
            this.token.methods.refreshToken();
            return 2;
          }
        }
      } else {
        this.goTo("login")
      }
    };
    //金额格式化
    Vue.prototype.returnFloat = function (value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var xsd = value.toString().split(".");
      if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    };

  },
  methods: {
    //刷新token
    async refreshToken() {
      let param = {
        refreshToken: getStore("refresh_token")
      };
      const res = await refreshToken(param);
      if (res.success) {
        setStore('access_token', res.content.access_token);
        setStore('refresh_token', res.content.refresh_token);
        setStore('access_overtime', res.content.access_overtime);
        setStore('refresh_overtime', res.content.refresh_overtime);
        var date = new Date().getTime();
        var local_access_overtime = date + 3000000;
        var local_refresh_overtime = date + 2592000000;
        setStore('local_access_overtime', local_access_overtime);
        setStore('local_refresh_overtime', local_refresh_overtime);
      } else {
        Toast({
          message: "账号已过期，请重新登录",
          iconClass: 'icon icon-fail'
        });
      }
    }
  }
};
