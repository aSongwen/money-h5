import { baseUrl } from './env'
import {setStore,getStore,userInfo} from './mUtils'
import {_fetch} from "./_fetch"
import axios from 'axios'
import {Toast} from 'mint-ui'
import Mint from 'mint-ui';

var loadingCount=0

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
  var curr_path =  window.document.location.href;
  console.log("curr_path="+curr_path)
  var str_before = curr_path.split("/#/")[0];
  var loca_href=str_before+"/#/"
  console.log("loca_href="+loca_href)

	type = type.toUpperCase();
   let token = getStore("refresh_token")
	 let overTime = getStore("access_overtime");
   let access_token = localStorage.getItem('access_token');

   if(access_token==''||token==''){
     if(url.indexOf('/pub')==-1){
       setStore("access_token", '');
      setStore("refresh_token", '');
       setStore("access_overtime", '');
       setStore("refresh_overtime", '');
     setStore("local_access_overtime", '');
      setStore("local_refresh_overtime", '');
      window.location.href=loca_href
      return;
    }

  }
  if (loadingCount == 0 && url.indexOf("withdraw_wechat_public")==-1 && url.indexOf("grab_task")==-1) {
    Mint.Indicator.open({//打开loading
      text: '加载中...',
      spinnerType: 'fading-circle'
    });
  }
  loadingCount++
    if(new Date().getTime() > overTime-300000){
      if(url.indexOf('/pub')==-1){
        axios({
          url: '/ums/pub/user/refresh_token',
          headers: {
            'access_token': access_token },
          method: 'POST',
          data:  {"refresh_token":token}
        }).then((res) => {
          if(res.success){
            //设置新token
            setStore("access_token",res.content.access_token);
            setStore("access_overtime", res.content.access_overtime)
          }else{
            setStore("access_token", '');
            setStore("refresh_token", '');
            setStore("access_overtime", '');
            setStore("refresh_overtime", '');
            setStore("local_access_overtime", '');
            setStore("local_refresh_overtime", '');
            window.location.href=loca_href
          }
        }).catch(function (error) {
          Toast({
            message: error.errmsg,
            iconClass: 'icon icon-fail'
          });
        });
      }
    }

	url = "" + url+"?access_token="+getStore("access_token");
	console.log("final : "+url);
	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
		if(url.indexOf('?')>-1){
			url = url + '&time='+new Date();
		}else{
			url = url + '?time='+new Date();
		}
	}
	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'access_token':token
			},
      mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		try {
			const response = await _fetch(fetch(url, requestConfig),50000);
			let responseJson = await response.json();
			if(responseJson.errorCode =='402'){
	/* 			alert(url)
				alert(url)
				alert(token);
				alert(JSON.stringify(responseJson)) */
				responseJson.errorMsg ='会话已过期，请重新登录，3S后将进行登录跳转';
					setTimeout(()=>{
						setStore("token","");
						setStore("userInfo","");
						setStore("user_info_user","");
						setStore("curCompany","");
						window.location=loca_href
					}
					,3000);

			}

      if (loadingCount > 0) {
        loadingCount--
      }
      if (loadingCount === 0) {
        Mint.Indicator.close();//关闭loading
      }
			return responseJson
		} catch (error) {
      if (loadingCount > 0) {
        loadingCount--
      }
            return  {success:false,errorMsg:'服务暂不可用，请稍后再试!'};
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      requestObj.setRequestHeader("token", token);
			requestObj.send(sendData);


			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
