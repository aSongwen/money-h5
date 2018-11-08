// 导入本工程所需要的一个外部工具（该工具为ajax的封装）
import axios from 'axios'

/*******************************************************************************
  该文件封装了一些调用接口的函数，主要是针对本公司提供的服务器所封装的
  其中的 url是以/ums/为前缀的，而/ums则是一个代理地址，详细配置请查看
  config/index.js 中的
  dev: {
  proxyTable: {
  .....
  }
}
*******************************************************************************/

/*******************************************************************************
 form 表单提交 输入地址， key-value对象，回调函数
如 callFormApi('pub/login', {username: root, password: 123}, function(res){

})
*******************************************************************************/
export function callFormApi (url, paramObj, fun) {
  axios({
    url: 'http://10.6.20.28:8673' + url,
    method: 'POST',
    params: paramObj
  }).then((res) => {
    fun(res)
  })
}
/*******************************************************************************
使用方法同上，发送数据方式为json对象
*******************************************************************************/
export function callJsonApi (url, jsonData, fun) {
  axios({
    url: '/ums' + url,
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}
export function callJsonApiFromDms(url, jsonData, fun) {
  axios({
    url: '/dms/api' + url + '?access_token=' + localStorage.getItem('access_token'),
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function callApiToken (url, jsonData, fun) {
  var str = localStorage.getItem('access_token')
  str = escape(str)
  axios({
    url: '/ums' + url + '?access_token=' + str,
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

// *oms接口对接的函数*
export function callApi (url, jsonData, fun) {
  axios({
    // url: 'http://proxy.tintop.cn:26081/oms/api/' + url,
    // url: 'http://10.6.20.28:8674/api/' + url,
    url: '/oms/' + url,
    headers: {
      'access_token': localStorage.getItem('access_token')},
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function changetoken (url, jsonData, fun) {
  axios({
    url: '/ums/' + url,
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function callDmsApi (url, jsonData, fun) {
  // console.log(jsonData)
  axios({
    url: '/dms/api' + url + '?access_token=' + localStorage.getItem('access_token'),
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function callPbsApi (url, jsonData, fun) {
  axios({
    url: '/pbs/api/' + url,
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'access_token':localStorage.getItem('access_token')
    },
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function callUmsJsonApi (url, jsonData, fun) {
  // console.log(jsonData)
  axios({
    url: '/ums/api' + url + '?access_token=' + localStorage.getItem('access_token'),
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}
export function callUmsApi (url, jsonData, fun) {
  // console.log(jsonData)
  axios({
    url: '/ums/' + url,
    method: 'POST',
    data: jsonData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then((res) => {
    fun(res)
  })
}

// *获取临时的token*
export function getToken (url, fun) {
  axios({
    url: '/ums' + url,
    method: 'GET'
  }).then((res) => {
    fun(res)
  })
}

// *获取字典码组*
export function code (url, jsonData, fun) {
  axios({
    url: '/ums' + url + '?groups=' + jsonData,
    method: 'GET'
  }).then((res) => {
    fun(res)
  })
}

// 调用mbs接口
export function callApiForMbs (url, jsonData, fun) {
  var str = localStorage.getItem('access_token')
  axios({
    url: '/mbs/api/' + url + '?access_token=' + str,
    method: 'POST',
    data: jsonData
  }).then((res) => {
    fun(res)
  })
}

export function resetLocalStorage (res) {
  localStorage.setItem('access_token', res.data.content.access_token)
  localStorage.setItem('refresh_token', res.data.content.refresh_token)
  localStorage.setItem('access_overtime', res.data.content.access_overtime)
}

export function removeLocalStorage () {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('access_overtime')
}

// 时间格式转换
export function changeDateFormat (time) {
  var timeDate = new Date(time)
  var date = ''
  date += timeDate.getFullYear() + '-'
  if (timeDate.getMonth() + 1 < 10) {
    date += '0'
  }
  date += timeDate.getMonth() + 1 + '-'
  if (timeDate.getDate() < 10) {
    date += '0'
  }
  date += timeDate.getDate() + ' '

  if (timeDate.getHours() < 10) {
    date += '0'
  }
  date += timeDate.getHours() + ':'
  if (timeDate.getMinutes() < 10) {
    date += '0'
  }
  date += timeDate.getMinutes() + ':'
  if (timeDate.getSeconds() < 10) {
    date += '0'
  }
  date += timeDate.getSeconds()
  return date
}
