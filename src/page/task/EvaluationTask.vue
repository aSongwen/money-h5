<template>
  <div id="EvaluationTask" v-if="taskDetail!=null">
    <div class="top">订单号：{{taskDetail.task.orderNo}}</div>
    <div class="mainContent">
      <div class="main-left">
        <img :src="taskDetail.listing.mainImageUrl"/>
      </div>
      <div class="main-right">
        <p>{{taskDetail.listing.title}}</p>
        <p>下单时间：{{taskDetail.task.realStartTime | dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
        <p>付款金额：{{taskDetail.listing.price}}元</p>
      </div>
    </div>
    <div class="blank"></div>
    <div class="content">
      <div class="title">指定评价内容和图片</div>
      <div class="content-center">
        <div class="content-text">
          {{taskDetail.task.comment.comment}}
        </div>
        <div class="content-img" v-for="(item,index) in taskDetail.task.comment.images" :key="item.id">
          <div @click="tapImg($event)">
            <img :src="item"/>
          </div>
        </div>
        <div class="copyContent"
             v-clipboard:copy="taskDetail.task.comment.comment"
             v-clipboard:success="onCopy"
             v-clipboard:error="onError">
          <span v-if="taskDetail.task.comment.images.length>0">一键复制评价内容，并把图片保存到相册</span>
          <span v-if="taskDetail.task.comment.images.length<=0">一键复制评价内容</span>
        </div>
        <div class="title">提交评价截图</div>
        <div class="submitImg">
          <div class="imageslist">
            <span v-for="(item,index) in images">
            <span class="uploadImg">
              <div :class="isTapImg?'tapImgs':''">
            <img @click="tapImg" :src="item.url"/>
          </div>
              <img class="delete-btn" src="../../assets/icon_delete.png" @click="remove(index)"
                   style="width:0.4rem;height:0.4rem;margin-left: 1.3rem;margin-top: -3rem;">
              </span>
            </span>
            <img src="../../assets/add.png" @click="fileClick" style="" v-if="images.length <= 0">
          </div>
          <input type="file" accept="image/*" @change="fileChange($event)" id="upload_file" style="display: none"/>
          <!-- <img src="../../assets/01.jpg"/>-->
          <!--<uploader
            :max=max
            :images=images
            :upload-url=uploadUrl
            :name=name
            :params=params
            size="small"
            @preview="previewMethod"
            @add-image="addImageMethod"
            @remove-image="removeImageMethod"
          ></uploader>-->
        </div>
        <p class="warming">*请上传在淘宝的评价截图</p>
      </div>
    </div>
    <div class="submitTask" @click="submitResult">提交任务</div>

    <div id="loading" v-if="loading">
      <div>
        <img src="../../assets/5-121204193R5-50.gif" alt="">
        <p>上传中...</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {Header, Toast,MessageBox} from 'mint-ui';
  import Tabbar from '@/components/Tabbar';
  import {getTaskDetail, submitResult} from '@/api/getData'

  // 引入组件
  import Uploader from 'vux-uploader'
  import axios from 'axios'
  export default {
    components: {
      Tabbar,
      Uploader
    },
    data() {
      return {
        loading:false,
        imgSize:5,
        max: 5,
        uploadUrl: "/file/pub/H5_uploadFile",
        name: "file",
        images: [],
        params: {},
        taskId: null,
        taskDetail: null,
        auditImages: [],
        isTapImg: false,
        imgList: [],
        size: 0,
        tapImgsFlg: 1
      }
    },
    created() {
      this.getParams()
    },
    mounted: function () {

    },
    destroyed:function() {
      MessageBox.close(false);
    },
    methods: {
      //移除图片
      remove (i) {
        this.images.splice(i, 1);
        var list=this.images
      },
      fileClick(){
        document.getElementById('upload_file').click()
      },
      fileChange(el){
        if (!el.target.files[0].size) return;
        this.fileList(el.target.files);
        el.target.value = ''
      },
      fileList(files){
        if((this.images.length+files.length)>1){
          Toast({
            message: '最多只能上传1张图片',
            iconClass: 'icon icon-fail'
          });
          return
        }
        //限制图片大小2M以内
        for (let i = 0; i < files.length; i++) {
          if( files[i].type != "jpg" && files[i].type != "JPG" && files[i].type != "image/jpeg" &&
            files[i].type != "png" && files[i].type != "PNG" && files[i].type != "image/png"){
            Toast({
              message: '请从手机相册中上传评价截图',
              iconClass: 'icon icon-fail'
            });
            return
          }
          if(files[i].size> 1 * 1024 * 1024){
            Toast({
              message: '请上传1M以内的图片',
              iconClass: 'icon icon-fail'
            });
            return
          }
        }
        this.loading = true
        for (let i = 0; i < files.length; i++) {
          this.H5UploadFile(files[i])
          this.imgSize=files.length

        }
      },
      tapImg(e) {
        var el = e.currentTarget;
        if(this.tapImgsFlg==1){
          el.setAttribute("class", "tapImgs")
          this.tapImgsFlg++
        }else {
          el.setAttribute("class", "")
          this.tapImgsFlg--
        }

      },
      //上传图片
      async H5UploadFile(file) {
        var formData = new FormData();
        formData.append("file", file);
        axios.post(this.uploadUrl, formData)
          .then((response) => {
            if (response.data.result!=null && response.data.result==0) {
              this.images.push(response.data.data)
              this.imgSize--
            }else {
              Toast({
                message: '图片上传失败',
                iconClass: 'icon icon-fail'
              });
            }
            if(this.imgSize==0){
              this.loading = false
            }
          })
      },
      //提交任务
      async submitResult() {
        this.loading = true
        if (this.taskId == null) {
          this.loading = false
          Toast({
            message: '参数不能为空',
            iconClass: 'icon icon-fail'
          });
          return
        }
        for (var i = 0; i < this.images.length; i++) {
          this.auditImages.push(this.images[i].fileId)
        }
        if(this.auditImages.length<=0){
          this.loading = false
          Toast({
            message: '请选择需要提交的图片',
            iconClass: 'icon icon-fail'
          });
          return
        }
        if(this.auditImages.length>1){
          this.loading = false
          Toast({
            message: '最多只能上传1张图片',
            iconClass: 'icon icon-fail'
          });
          return
        }
        let param = {
          auditReviewImages: this.auditImages,
          executeTaskId: this.taskId,
          status: 1
        };
        const res = await submitResult(param);
        if (res.success) {
          this.loading = false
          MessageBox.alert('提交成功,请等待后台审核',{title:"提交成功"},{confirmButtonText:"确定"}).then(action => {
            this.goTo("Task")
          });
        } else {
          this.loading = false
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      //查询任务详情
      async getTaskDetail() {
        if (this.taskId == null) {
          Toast({
            message: '参数不能为空',
            iconClass: 'icon icon-fail'
          });
        }
        let param = {
          executeTaskId: this.taskId
        };
        const res = await getTaskDetail(param);
        if (res.success) {
          this.taskDetail = res.content
        } else {
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },
      getParams() {
        // 取到路由带过来的参数
        var paramsId = this.$route.query.id
        // 将数据放在当前组件的数据内
        this.taskId = paramsId
        this.getTaskDetail()
      },
      // 复制成功
      onCopy(e) {
        console.log(e);
        Toast({
          message: '复制成功',
          iconClass: 'icon icon-success'
        });
      },
      // 复制失败
      onError(e) {
        console.log("复制失败");
      },
      goTo(name) {
        this.$router.push({name: name})
      },
      previewMethod: function () {

      },
      addImageMethod: function () {

      },
      removeImageMethod: function () {

      }


    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";

  #EvaluationTask {
    color: #333;
    font-size: 0.24rem;
    .top {
      height: 0.6rem;
      background: #f3f6fe;
      line-height: 0.6rem;
      font-size: 0.24rem;
      color: #333;
      padding-left: 0.2rem;
    }
    .mainContent {
      .flex;
      .align;
      background: @bgmWhite;
      padding: 0.2rem 0 0.2rem 0.2rem;
      .main-left {
        img {
          width: 2rem;
          margin-right: 0.2rem;
          vertical-align: middle;
        }
      }
      .main-right {
        color: #333;
        font-size: 0.24rem;
        p {
          &:nth-child(1) {
            margin-bottom: 0.4rem;
            font-size: 0.3rem;
          }
          &:nth-child(2) {
            margin-bottom: 0.3rem;
          }
        }
      }
    }
    .blank {
      height: 0.1rem;
      background: #f3f6fe;
    }
    .content {
      padding: 0.2rem 0.2rem;
      background: @bgmWhite;
      margin-bottom: 0.3rem;
      .title {
        height: 0.3rem;
        line-height: 0.3rem;
        border-left: 0.03rem solid @red;
        padding-left: 0.1rem;
        font-size: 0.28rem;
        color: #333;
      }
      .content-center {
        padding: 0.1rem 0.1rem;
        .content-text{
          padding:0.3rem 0 0.2rem 0;
        }
        .content-img {
          width: 1.2rem;
          margin: 0.0rem 0.2rem 0.3rem 0;
          display: inline-block;
          img {
            width: 100%;
          }
        }
        .copyContent {
          width: 5rem;
          height: 0.8rem;
          background: #f54848;
          .round(0.05rem);
          color: #fff;
          font-size: 0.24rem;
          line-height: 0.8rem;
          text-align: center;
          margin: 0 0 0.3rem 0.4rem;
        }
        .submitImg {
          width: 100%;
          margin: 0.3rem 0 0.2rem 0;
          .tapImgs {
            width: 100vw;
            height:100vh;
            background: rgba(0,0,0,.5);
            position: fixed;
            top: 0;
            left:0;
            padding: 0;
            margin: 0;
            .flex;
            .align;
            .justify;
            z-index: 2;
            img{
              width:100% !important;
            }
          }
            img {
              width: 100%;
              vertical-align: middle;
            }

        }
        .submitImg img{
          width: 1.5rem;
          height:1.5rem;
          vertical-align: middle;
          margin-right: 0.1rem;
        }
        .delete-btn {
          border-radius:50%;
          background-color:#ffffff;
        }
        .warming {
          font-size: 0.24rem;
          color: #f54848;
          margin-bottom: 0.4rem;
        }
      }

    }
    .submitTask {
      width: 100%;
      height: 0.8rem;
      background: #f54848;
      color: #fff;
      line-height: 0.8rem;
      text-align: center;
      .round(0.05rem);
      position: fixed;
      left: 0;
      bottom: 0;
    }
    .tapImgs {
      width: 100vw;
      height:100vh;
      background: rgba(0,0,0,.5);
      position: fixed;
      top: 0;
      left:0;
      padding: 0;
      margin: 0;
      .flex;
      .align;
      .justify;
      z-index: 2;
      img{
        width:100% !important;
        height:90% !important;
      }
        }
    #loading{
      width:100vw;
      height:100vh;
      position: absolute;
      top:0;
      left:0;
      .flex;
      .align;
      .justify;
      color:#fff;
      div{
        .round(0.1rem);
        .flex;
        .align;
        .justify;
        flex-direction: column;
        width:2rem;
        height:2rem;
        background: rgba(0,0,0,.7);
        p{
          margin-top: 0.3rem;
          .font(0.24rem);
        }
        img{
          width:0.66rem;
          height:0.66rem;
        }
      }
    }
      }
</style>
