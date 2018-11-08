<template>
  <div id="bindIdCard">
    <div class="top" v-if="!hasBind">
      <div class="topItem">
        <div>
          <span v-if="imagesUrl1"><img :src="imagesUrl1" style="margin-top: 0.3rem;height:1.8rem;"></span>
          <img src="../../assets/photo03.png" @click="fileClick(1)" style="margin-top: 0.3rem;" v-if="!imagesUrl1">
        </div>
        <input @change="fileChange($event)" type="file" id="upload_file" style="display: none" accept="image/*" capture="camera" />
        <p>身份证的头像面</p>
      </div>
      <div class="topItem">
        <div>
          <span v-if="imagesUrl2"><img :src="imagesUrl2" style="margin-top: 0.3rem;height:1.8rem;"></span>
          <img src="../../assets/photo03.png" @click="fileClick(2)" style="margin-top: 0.3rem;" v-if="!imagesUrl2">
        </div>
        <p>身份证的国徽面</p>
      </div>
      <div id="loading" v-if="loading">
        <div>
          <img src="../../assets/5-121204193R5-50.gif" alt="">
          <p>上传中...</p>
        </div>
      </div>
    </div>
    <div class="blank"></div>
    <div class="content">
      <div class="contentItem">
        <p>　姓名:</p>
        <input type="text" v-model="this.user.realName" placeholder="上传身份证照片后自动显示" readonly>
      </div>
      <div class="contentItem">
        <p>　性别:</p>
        <input type="text" placeholder="上传身份证照片后自动显示" v-model="this.user.gender == 0 ? '女' : this.user.gender == 1 ? '男' : ''" readonly>
      </div>
      <div class="contentItem">
        <p>身份证:</p>
        <input type="text" v-model="this.user.idCardNumber" placeholder="上传身份证照片后自动显示" readonly>
      </div>
      <div class="contentItem">
        <p>有效期:</p>
        <input type="text" v-model="this.idCardTime" placeholder="上传身份证照片后自动显示" readonly>
      </div>
    </div>
    <div class="warming">
      平台对身份信息都是MD5加密储存技术,只做实名认证用途,请您放心!
    </div>
    <div class="lastBtn" v-if="!hasBind">
      <p @click="save">保存</p>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import {
    Toast
  } from 'mint-ui';
  import Uploader from 'vux-uploader';
  import {
    getOcrIdCard,
    save,
    loadPromoterInfo
  } from '@/api/getData';
  import axios from 'axios';
  export default {
    components: {
      Uploader
    },
    data() {
      return {
        loading: false,
        user: '',
        user1: '',
        idCardTime: '',
        readonly: true, //有身份证号就为只读
        frontStatus: 0, //身份证正面解析状态//身份证正面上传状态,0未上传,1正在上传,2身份证解析中,3上传成功, -1上传失败
        backStatus: 0, //身份背面上传状态,0未上传,1正在上传,2身份证解析中,3上传成功,-1上传失败
        idCardNumber: '',
        deviceType: '',
        uploadUrl: "/file/pub/H5_uploadFile",
        imagesUrl1: "",
        imagesId1: "",
        imagesUrl2: '',
        imagesId2: '',
        type: '', //上传身份证正反面，1：正面；2：反面
        hasBind: false
      }
    },
    mounted: function() {
      this.loadPromoterInfo();
      //      if (this.idCardNumber == '') {
      //        document.getElementsByClassName("mint-header-title").item(0).innerHTML = '设置身份证号';
      //      } else {
      //        document.getElementsByClassName("mint-header-title").item(0).innerHTML = '查询身份证号';
      //        this.loadPromoterInfo();
      //      }
    },
    methods: {
      fileClick(type) {
        this.type = type
        document.getElementById('upload_file').click();
      },
      fileChange(el) {
        if (!el.target.files[0].size) return;
        if ((el.target.files.length) > 1) {
          Toast({
            message: '最多只能上传1张图片',
            iconClass: 'icon icon-fail'
          });
          return
        }
        this.loading = true;
        if (this.type == 1) {
          this.frontStatus = 1;
        } else {
          this.backStatus = 1;
        }
        this.H5UploadFile(el.target.files[0]);
        el.target.value = ''
      },
      async H5UploadFile(file) {
        var formData = new FormData();
        formData.append("file", file);
        axios.post(this.uploadUrl, formData)
          .then((response) => {
            if (response.data.result != null && response.data.result == 0) {
              this.loading = false;
              if (this.type == 1) {
                this.imagesUrl1 = response.data.data.url;
                this.imagesId1 = response.data.data.fileId;
                this.frontStatus = 2;
                this.getOcrIdCard(this.imagesId1, 0);
              } else {
                this.imagesUrl2 = response.data.data.url;
                this.imagesId2 = response.data.data.fileId;
                this.backStatus = 2;
                this.getOcrIdCard(this.imagesId2, 1);
              }
            } else {
              this.loading = false;
              Toast({
                message: '图片上传失败',
                iconClass: 'icon icon-fail'
              })
            }
          })
      },
      async save() {
        var errorMsg;
        var frontStatus = this.frontStatus;
        var backStatus = this.backStatus;
        var realName = this.user.realName;
        var idCardImageFront = this.user.idCardImageFront;
        var idCardImageBack = this.user1.idCardImageBack;
        var idCardNumber = this.user.idCardNumber;
        var idCardAddress = this.user.idCardAddress;
        var idCardStartTime = this.user1.idCardStartTime;
        var idCardEndTime = this.user1.idCardEndTime;
        var nation = this.user.nation;
        var gender = this.user.gender;
        var birthday = this.user.birthday;
        var authority = this.user1.authority;
        var reg = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
        if (frontStatus == 0) {
          errorMsg = "请上传身份头像面";
        } else if (frontStatus == -1) {
          errorMsg = "请重拍身份证头像面";
        } else if (frontStatus == 1) {
          errorMsg = "传身份证正在上传中,请稍后点击保存";
        } else if (backStatus == 0) {
          errorMsg = "请上传身份国徽面";
        } else if (backStatus == -1) {
          errorMsg = "请重拍身份证国徽面";
        } else if (backStatus == 1) {
          errorMsg = "传身份证正在上传中,请稍后点击保存";
        } else if (idCardImageFront == null) {
          errorMsg = "请上传身份证正面";
        } else if (idCardImageBack == null) {
          errorMsg = "请上传身份证反面";
        } else if (realName == null) {
          errorMsg = "真实姓名不能为空";
        } else if (idCardNumber == null) {
          errorMsg = "身份证号不能为空";
        } else if (!reg.test(idCardNumber)) {
          errorMsg = "身份证号格式不正确";
        } else if (idCardAddress == null) {
          errorMsg = "身份证地址不能为空";
        } else if (idCardStartTime == null || idCardEndTime == null) {
          errorMsg = "身份证有效期不能为空";
        } else if (nation == null) {
          errorMsg = "民族不能为空";
        } else if (gender == null) {
          errorMsg = "性别不能为空";
        } else if (birthday == null) {
          errorMsg = "出生年月不能为空";
        }
        if (errorMsg) {
          Toast({
            message: errorMsg,
            iconClass: 'icon icon-fail'
          })
          return;
        }
        //验证通过就保存身份证信息
        let user = {
          "realName": realName,
          "idCardNumber": idCardNumber,
          "nation": nation,
          "gender": gender,
          "birthday": birthday,
          "authority": authority,
          "idCardStartTime": idCardStartTime,
          "idCardEndTime": idCardEndTime,
          "idCardAddress": idCardAddress,
          "idCardImageFront": idCardImageFront,
          "idCardImageBack": idCardImageBack,
          "isCheck": 1
        };
        const res = await save(user);
        if (res.success) {
          this.loadPromoterInfo();
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          })
        }
      },
      async loadPromoterInfo() {
        let param = {
          "deviceType": this.deviceType,
          "headImage": null
        };
        const res = await loadPromoterInfo(param);
        if (res.success) {
          if (res.content.idCardNumber) {
            this.hasBind = true;
          }
          this.imagesUrl1 = res.content.idCardImageFront;
          this.imagesUrl2 = res.content.idCardImageBack;
          this.user = {
            realName: res.content.realName,
            idCardNumber: res.content.idCardNumber,
            gender: res.content.gender
          };
          this.idCardTime = this.limitTime(res.content.idCardStartTime, res.content.idCardEndTime);
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          })
        }
      },
      limitTime: function(startTime, endDate) {
        if (!startTime || startTime == 'null') {
          return
        }
        var newStartDate = moment(startTime).format("YYYY/MM/DD");
        var newEndDate = moment(endDate).format("YYYY/MM/DD");
        return newStartDate + '--' + newEndDate;
      },
      async getOcrIdCard(idCardImage, idCardType) {
        let param = {
          "idCardImage": idCardImage,
          "idCardType": idCardType
        };
        const res = await getOcrIdCard(param);
        if (res.success) {
          if (idCardType == 0) {
            this.user = {
              idCardImageFront: idCardImage,
              realName: res.content.realName,
              idCardNumber: res.content.idCardNumber,
              idCardAddress: res.content.idCardAddress,
              gender: res.content.gender,
              nation: res.content.nation,
              birthday: res.content.birthday
            };
            this.frontStatus = 3;
          }
          if (idCardType == 1) { //身份证反面
            this.user1 = {
              idCardImageBack: idCardImage,
              authority: res.content.authority,
              idCardStartTime: res.content.startDate,
              idCardEndTime: res.content.endDate
            };
            this.idCardTime = this.limitTime(this.user1.idCardStartTime, this.user1.idCardEndTime);
            this.backStatus = 3;
          }
        } else {
          if (res && res.errmsg) {
            let errmsg = res.errmsg;
            if (errmsg.indexOf("存在") > -1) {
              this.imagesUrl1 = '';
              this.frontStatus = -1;
            } else if (idCardType == 0) {
              this.imagesUrl1 = '';
              errmsg = '请重拍头像面';
              this.front_images = null;
              this.frontStatus = -1;
            } else if (idCardType == 1) {
              this.imagesUrl2 = '';
              errmsg = '请重拍国徽面';
              this.back_images = null;
              this.backStatus = -1;
            }
            Toast({
              message: errmsg,
              iconClass: 'icon icon-fail'
            })
            //  if (idCardType == 1) {
            //    this.imagesUrl1 = '';
            //  } else {
            //    this.imagesUrl2 = '';
            //  }
          }
        }
      }
    },
    watch: {}
  }
</script>

<style lang="less">
  @import "../../style/mixin.less";
  #bindIdCard {
    min-height: calc(100vh - 0.64rem);
    background: #fff;
    .top {
      padding-top: 0.4rem;
      border-bottom: 0.02rem solid #e5e5e5;
      .flex;
      .around;
      .topItem {
        width: 2.6rem;
        text-align: center;
        img {
          width: 100%;
          margin-bottom: 0.3rem;
        }
        p {
          color: #666;
          font-size: 0.24rem;
          margin-bottom: 0.3rem;
        }
      }
    }
    .blank {
      width: 100%;
      height: 0.3rem;
      background: #f3f6fe;
      border-bottom: 0.02rem solid #e5e5e5;
    }
    .content {
      color: #666;
      font-size: 0.24rem;
      .contentItem {
        .flex;
        border-bottom: 0.02rem solid #e5e5e5;
        p {
          width: 2.4rem;
          border-right: 0.02rem solid #e5e5e5;
          height: 0.9rem;
          line-height: 0.9rem;
          text-align: center;
        }
        input {
          width: 4.5rem;
          border: none;
          padding-left: 0.3rem;
          font-size: 0.24rem;
        }
      }
    }
    .warming {
      padding: 0.3rem 0.2rem 0;
      color: #f54848;
      font-size: 0.24rem;
    }
    .lastBtn {
      margin-top: 0.5rem;
      padding: 0 12%;
      p {
        background: @red;
        color: #fff;
        height: 0.8rem;
        line-height: 0.8rem;
        .round;
        text-align: center;
        .font(0.24rem)
      }
    }
    .weui-uploader__bd {
      .flex;
      .justify;
    }
    #loading {
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      .flex;
      .align;
      .justify;
      color: #fff;
      div {
        .round(0.1rem);
        .flex;
        .align;
        .justify;
        flex-direction: column;
        width: 2rem;
        height: 2rem;
        background: rgba(0, 0, 0, .7);
        p {
          margin-top: 0.3rem;
          .font(0.24rem);
        }
        img {
          width: 0.66rem;
          height: 0.66rem;
        }
      }
    }
  }
</style>
