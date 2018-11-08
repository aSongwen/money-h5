<template>
  <div id="bindBankCard">
    <p class="BankCardTop">请绑定持卡人本人的银行卡</p>
    <div class="bankCardName">
      <p class="tit">持卡人姓名</p>
      <p>{{realName}}</p>
    <!--  <input type="text" placeholder="请输入持卡人姓名" v-model="bankCardName" v-else> -->
    </div>
    <p class="BankCardTop BankCardTop2">注：暂时不接受邮政储蓄卡</p>
    <div class="choseBack">
      <div class="choseFirst">
        <p class="tit">开户银行</p>
        <div>{{bankName}}</div>
      </div>
      <p class="chose" @click="popupVisible=true">请选择</p>
      <mt-popup
        v-model="popupVisible"
        position="bottom">
        <template slot-scope="scope">
          <div class="chose2">
            <div>
              <p @click="onCancle">取消</p>
              <p @click="popupVisible=false">确定</p>
            </div>
          </div>
          <mt-picker :slots="slots" class="BankPicker" @change="onValuesChange">
          </mt-picker>
        </template>
      </mt-popup>
    </div>
    <div class="cardNum">
      <p class="tit">卡号</p>
      <input type="number" placeholder="请输入卡号" v-model="bankCardNum">
    </div>
    <div class="lastBtn">
      <p @click="changeBankNumber">保存</p>
    </div>
  </div>
</template>
<script>
  import { DatetimePicker,Popup,Toast,MessageBox} from 'mint-ui';
  import {loadPromoterInfo,queryBank,changeBankNumber} from '@/api/getData'
  export default {
    components: {
      DatetimePicker,
      Popup
    },
    data(){
      return {
        popupVisible:null,
        bankName:'',
        deviceType:'',
       // bankCardName:'',
        realName:'',
        bankCardNum:'',
        beforeChangeName:'',
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
          },]
  }
  },
    mounted:function(){
      this.deviceType = sessionStorage.getItem("deviceType");
      this.loadPromoterInfo();
//      if(this.bankCardNum == '') {
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML = '设置银行卡';
//      }else{
//        document.getElementsByClassName("mint-header-title").item(0).innerHTML ='修改银行卡';
//      }
      this.queryBank();
    },
    destroyed:function() {
      MessageBox.close(false);
    },
    methods:{
      onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0]);
        }
        this.bankName = values[0];
      },

      onCancle(picker, values) {
        this.popupVisible=false;
        this.bankName = this.beforeChangeName;
      },

      onConfirm(picker, values) {
        this.popupVisible=false;
        this.beforeChangeName = this.bankName;
      },


      async loadPromoterInfo(){
        let param = {"deviceType":this.deviceType,"address":null,"headImage":null};
        const res = await loadPromoterInfo(param);
        if(res.success){
          var idCardNumber = res.content.idCardNumber;
          if(!idCardNumber){
            MessageBox.alert('您还未绑定身份证，绑定身份证后，才能绑定银行卡').then(action => {
              this.$router.push({name: 'bindIdCard'})
            });
          }else {
          //  this.bankCardName = res.content.bankCardName;
            this.bankCardNum = res.content.bankCardNumber;
            this.bankName = res.content.bankName;
            this.beforeChangeName = this.bankName;
            this.realName = res.content.realName;
          }
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      },

      async queryBank(){
        let param = {"pageIndex":1,"pageSize":200,"status":1};
        const res = await queryBank(param);
        if(res.success){
          var data = res.content.records;
          for(var i=0;i<data.length;i++){
            this.slots[0].values.push(data[i].name);
          }
        }else{
          Toast({
            message:'获取银行信息失败',
            iconClass:'icon icon-fail'
          });
        }
      },
      /**
       * 校验银行卡号
       */
      checkbankCardNum: function(){
        if(this.bankCardNum == null || this.bankCardNum.length == 0){
          Toast({
            message:'请输入银行卡号!',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        var myreg=/^([1-9]{1})(\d{18})$/;
        if(!myreg.test(this.bankCardNum)){
          Toast({
            message:'请输入正确的银行卡号!',
            iconClass:'icon icon-fail'
          });
          return false;
        }
        return true;
      },

      async changeBankNumber(){
        if(this.realName == null){
          Toast({
            message:"请输入持卡人名字",
            iconClass: 'icon icon-fail'
          });
          return;
        }
        if(!this.checkbankCardNum()){
          return;
        }
        let param = {"bankCardNumber":this.bankCardNum,"bankCardName":this.realName,"bankName":this.bankName};
        const res = await changeBankNumber(param);
        if(res.success){
          Toast({
            message: res.content,
            iconClass: 'icon icon-success'
          });
          this.loadPromoterInfo();
        }else{
          Toast({
            message: res.errmsg,
            iconClass: 'icon icon-fail'
          });
        }
      }
    }
  }
</script>
<style lang="less">
  @import "../../style/mixin.less";
  #bindBankCard{
    background: #fff;
    .font(0.24rem);
    .BankCardTop{
      background: @bgmBlue;
      color:#999;
      padding-left:0.2rem;
      height:0.5rem;
      line-height: 0.5rem;
      .font(0.22rem);
    }
    .BankCardTop2{
      color:@red;
      height:0.4rem;
      line-height: 0.4rem;
      .font(0.2rem)
    }
    .bankCardName{
      .flex;
      .align;
      height:0.9rem;
      padding-left:0.2rem;
      p{
        color:#333;
      }
      input{
        border: none;
      }
    }
    .choseBack{
      margin: 0 0.2rem;
      height:0.9rem;
      line-height: 0.9rem;
      .flex;
      .between;
      border-bottom: 1px solid #e5e5e5;
      .picker-items{
        width:100%;
        margin-top: 0.7rem;
      }
      .chose{
        margin-right: 0.4rem;
        color:#999;
      }
      .choseFirst{
        .flex;
      }
      .chose2{
        text-align: center;
        .flex;
        .align;
        .justify;
        height:0.7rem;
        position: fixed;
        top:0;
        div{
          width:100vw;
          padding: 0 0.2rem;
          .flex;
          .between;
          p:last-child{
            color:#1aad19;
          }
        };
      }
    }
    .picker{
      width:100vw;
      overflow-x: hidden;
    }
    .mint-popup-bottom{
      width:100vw;
    }
    .cardNum{
      border-bottom: 1px solid #e5e5e5;
      margin: 0 0.2rem;
      .flex;
      height:0.9rem;
      line-height: 0.9rem;
      input{
        border: none;
        .font(0.24rem)
      }
    }
    .tit{
      margin-right: 0.4rem;
      width:1.3rem;
    }
    .lastBtn{
      margin-top: 0.5rem;
      padding:0 12%;
      p{
        background: @red;
        color:#fff;
        height:0.8rem;
        line-height: 0.8rem;
        .round;
        text-align: center;
        .font(0.24rem)
      }
    }
  }
</style>
