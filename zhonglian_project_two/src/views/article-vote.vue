<template>
      <div class="article-vote wrapper">
          <!-- 报告类 -->
          <div class="header">
              <!-- <van-button color="#E1362E" plain @click="onBack">返回首页</van-button> -->
              <span></span>
              <p style="display:flex;">
              <!-- 全部赞成 -->
              <van-button @click="allZc" :disabled="isAllZc" style="margin-right:.2rem;width:2.3rem;" round block type="info" color="#E1362E" native-type="submit">全部赞成</van-button>
              <!-- 提交该项 -->
              <!-- <van-button @click="onSubmit" :disabled="submitItemFlag" round block type="info" color="#E1362E" native-type="submit">提交该项</van-button> -->
              </p>
          </div>
          <div class="section">
              <div class="layui-form">
                  <div class="title">
                      <p>{{titleInfo.tpnrXh}}、{{title}}</p>
                      <p>{{titleInfo.tpnrMc}}</p>
                      <!-- {{titleInfo.tpnrXh}}、{{titleInfo.tpnrMc}} -->
                      <!-- <p>{{titleInfo.tpnrXh}}、{{titleInfo.tpnrMc}}</p> -->
                      <!-- <p>{{titleInfo.tpnr_bz}}</p> -->
                  </div>
                  <table class="layui-table">
                      <colgroup>
                          <!-- <col /> -->
                          <col />
                          <!-- <col /> -->
                          <col />
                          <col />
                      </colgroup>
                      <thead>
                          <tr>
                              <!-- <th style="width:12%;">序号</th> -->
                              <th style="width:55%;">表决事项</th>
                              <th>赞成</th>
                              <th>反对</th>
                              <th>弃权</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(item, index) in voteList" :key="index">
                              <!-- <td>{{item.bg_xh}}</td> -->
                              <td>
                                  {{item.bg_mc}}
                                  <span style="color:rgb(225, 54, 46);display:block;" @click="viewFile(item)">查看附件</span>
                              </td>
                              <td class="zc" @click="changeVal(item, index, 1)"><input type="radio" :disabled="ytj" :name="item.id" value="1" title="" v-model="item.tpjg_tpyj"></td>
                              <td class="fd" @click="changeVal(item, index, 2)"><input type="radio" :disabled="ytj" :name="item.id" value="2" title="" v-model="item.tpjg_tpyj"></td>
                              <td class="qq" @click="changeVal(item, index, 3)"><input type="radio" :disabled="ytj" :name="item.id" value="3" title="" v-model="item.tpjg_tpyj"></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <div class="footer">
              <!-- 上一项 -->
              <van-button color="#E1362E" plain @click="onBack">返回首页</van-button>
              <!-- <van-button @click="preItemClick" v-show="preItem" :disabled="preItemFlag" color="#E1362E" plain>上一项</van-button> -->
              <!-- 下一项 -->
              <van-button @click="nextStep" v-show="isSubmited" color="#E1362E" plain>下一项</van-button>
              <!-- 提交 -->
              <van-button @click="saveForm" v-show="isNext" color="#E1362E" plain>提交</van-button>
              <!-- 保存 -->
              <van-button @click="saveInfo" v-show="save" color="#E1362E" plain>保存</van-button>
              <!-- 最后一项提交 -->
              <van-button @click="oneClickSubmit" v-show="submitAll" :disabled="submitAllFlag" round block type="info" color="#E1362E">提交</van-button>
          </div>
      </div>
</template>

<script>
import {
    getContentReport,
    voteSave,
    submitVoteContent,
    getContentStatus,
    submitAllVote,
} from '@/api/index';
import qs from 'qs';
export default {
    data () {
        return {
            titleInfo: {},
            radio: '',
            nextData: [],
            voteList: [],
            preData:[],
            isNext: true,
            // 上一项
            preItem: true,
            // 上一项按钮禁用
            preItemFlag: true,
            save: false,
            isSubmited: false,
            // 是否提交全部
            submitAll: false,
            // 当前项是否提交过
            submitItemFlag: false,
            ytj: false,
            // 所有事项列表
            allData: [],
            // 一键提交按钮状态
            submitAllFlag: false,
            // 所有数据
            allData:[],
            // 全部赞成
            isAllZc: false,
            // 内容名称
            title: sessionStorage.getItem('title')
        }
    },
    updated(){
        layui.use('form',function(){
            var form = layui.form;
            form.render();
        });
    },
    mounted(){
        this.allSubmitFlag();
    },
    methods: {
        // 全部赞成（保存+提交接口）
        allZc(){
            let tpjgsArr = [];
            let first = 1, firstArr = [];
            let second = 2, secondArr = [];
            let third = 3, thirdArr = [];
            this.voteList.map(item=>{
                item.tpjg_tpyj = '1';
                tpjgsArr.push(item.tpjg_tpyj)
                if (item.tpjg_tpyj == 1) {
                    firstArr.push(item)
                } else if (item.tpjg_tpyj == 2){
                    secondArr.push(item)
                } else if (item.tpjg_tpyj == 3){
                    thirdArr.push(item)
                }
            })

            // 保存接口数据
            let params = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id--tpnrbgid
                tpnrid: this.$route.query.cid,
                // 用户id
                tpyhid: sessionStorage.getItem('userId'),
            }
            // 提交接口参数
            let data = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id
                tpnrid: this.$route.query.cid,
                // 用户id--
                tpyhid: sessionStorage.getItem('userId')
            }

            this.$dialog.confirm({
                message: `已赞成<span style="color: rgb(225, 54, 46);font-size: 14px;">${firstArr.length}</span>票<br/>反对<span style="color: rgb(225, 54, 46);font-size: 14px;">${secondArr.length}</span>票<br/>弃权<span style="color: rgb(225, 54, 46);font-size: 14px;">${thirdArr.length}</span>票<br/>是否确认提交，提交后不可修改？`
            }).then(() => {
                this.$toast.loading({
                    message: '提交中...',
                    forbidClick: true,
                    overlay: true,
                    loadingType: 'spinner',
                    duration: 0
                })
                // voteSave(qs.stringify(params)).then(res=>{
                //     if (res.data.success) {
                        submitVoteContent(qs.stringify(data)).then(res=>{
                            if (res.data.success) {
                                this.$toast.clear();
                                if (this.nextData.length) {
                                    if (this.nextData[0].tpTplxId == 2) {
                                        this.$router.replace({
                                            path: '/person-vote',
                                            query: {
                                                cid: this.nextData[0].id
                                            }
                                        });
                                    } else {
                                        let path = this.$router.history.current.path;
                                        this.titleInfo = this.nextData[0];
                                        this.$router.replace({
                                            path,
                                            query: {
                                                // 下一项的内容id
                                                cid: this.nextData[0].id
                                            }
                                        })
                                        this.onaxios();
                                    }
                                } else {
                                    this.$router.push('/sign-in');
                                }
                                // this.allSubmitFlag();
                                // this.ytj = true;
                                // this.isNext = false;
                                // this.save = false;
                                // this.submitItemFlag = true;
                                // this.isAllZc = true;
                                // // 判断是否是最后一项，如果是最后一项下一项隐藏，如果不是正常显示
                                // if (this.titleInfo.tpnrXh == this.dataList.length) {
                                //     this.isSubmited = false;
                                // } else {
                                //     this.isSubmited = true;
                                // }

                            } else {
                                this.$toast.fail(res.data.message)
                            }
                        })
                //     }
                // })
            }).catch(()=>{})
        },
        // 提交该项（保存+提交接口）
        /* onSubmit(){
            let tpjgsArr = [];
            let first = 1, firstArr = [];
            let second = 2, secondArr = [];
            let third = 3, thirdArr = [];
            this.voteList.map(item=>{
                tpjgsArr.push(item.tpjg_tpyj);
                if (item.tpjg_tpyj == 1) {
                    firstArr.push(item)
                } else if (item.tpjg_tpyj == 2){
                    secondArr.push(item)
                } else if (item.tpjg_tpyj == 3){
                    thirdArr.push(item)
                }
            })
            // 提交接口参数
            let data = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id
                tpnrid: this.$route.query.cid,
                // 用户id--
                tpyhid: sessionStorage.getItem('userId')
            }
            // 保存接口数据
            let params = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 用户id
                tpyhid: sessionStorage.getItem('userId'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id--tpnrbgid
                tpnrid: this.$route.query.cid,
            }
            this.$dialog.confirm({
                message: `已赞成<span style="color: rgb(225, 54, 46);font-size: 14px;">${firstArr.length}</span>票<br/>反对<span style="color: rgb(225, 54, 46);font-size: 14px;">${secondArr.length}</span>票<br/>弃权<span style="color: rgb(225, 54, 46);font-size: 14px;">${thirdArr.length}</span>票<br/>是否确定提交,提交后不可修改`
            }).then(() => {
                this.$toast.loading({
                    message: '提交中...',
                    forbidClick: true,
                    overlay: true,
                    loadingType: 'spinner',
                    duration: 0
                })
                voteSave(qs.stringify(params)).then(res=>{
                    if (res.data.success) {
                        submitVoteContent(qs.stringify(data)).then(res=>{
                            if (res.data.success) {
                                this.$toast.clear();
                                this.allSubmitFlag();
                                this.ytj = true;
                                this.isNext = false;
                                this.save = false;
                                this.submitItemFlag = true;
                                this.isAllZc = true;
                                // 判断是否是最后一项，如果是最后一项下一项隐藏，如果不是正常显示
                                // this.isSubmited = false;
                                if (this.titleInfo.tpnrXh == this.dataList.length) {
                                    this.isSubmited = false;
                                } else {
                                    this.isSubmited = true;
                                }
                            } else {
                                this.$toast.fail(res.data.message)
                            }
                        })
                    }
                })
            }).catch(() => {});
        }, */
        // 提交并下一项（保存+提交接口）
        saveForm(){
            let tpjgsArr = [];
            let first = 1, firstArr = [];
            let second = 2, secondArr = [];
            let third = 3, thirdArr = [];
            let nextData = this.allData[2][0];
            this.voteList.map(item => {
                tpjgsArr.push(item.tpjg_tpyj);
                if (item.tpjg_tpyj == 1) {
                    firstArr.push(item)
                } else if (item.tpjg_tpyj == 2){
                    secondArr.push(item)
                } else if (item.tpjg_tpyj == 3){
                    thirdArr.push(item)
                }
            })
            // 保存接口数据
            let data = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 用户id
                tpyhid: sessionStorage.getItem('userId'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id--tpnrbgid
                tpnrid: this.$route.query.cid,
            }
            // 提交接口数据
            let params = {
                // 识别码
                sbm: sessionStorage.getItem('sbm'),
                // 投票结果
                tpjgs: tpjgsArr.join(','),
                // 内容id
                tpnrid: this.$route.query.cid,
                // 用户id--
                tpyhid: sessionStorage.getItem('userId')
            }
            this.$dialog.confirm({
                message: `已赞成<span style="color: rgb(225, 54, 46);font-size: 14px;">${firstArr.length}</span>票<br/>反对<span style="color: rgb(225, 54, 46);font-size: 14px;">${secondArr.length}</span>票<br/>弃权<span style="color: rgb(225, 54, 46);font-size: 14px;">${thirdArr.length}</span>票<br/>是否确认提交，提交后不可修改？`
            })
            .then(()=>{
                this.$toast.loading({
                    message: '提交中...',
                    forbidClick: true,
                    overlay: true,
                    loadingType: 'spinner',
                    duration: 0
                })
                // voteSave(qs.stringify(data)).then(res=>{
                //     if (res.data.success) {
                        submitVoteContent(qs.stringify(params)).then(res=>{
                            let data = res.data;
                            if (data.success) {
                                this.$toast.clear();
                                if (this.allData[2]) {
                                    if (nextData.tpTplxId == 2) {
                                        this.$router.replace({
                                            path: '/person-vote',
                                            query: {
                                                cid: nextData.id
                                            }
                                        });
                                    } else {
                                        let path = this.$router.history.current.path;
                                        this.titleInfo = nextData;
                                        this.$router.replace({
                                            path,
                                            query: {
                                                // 下一项的内容id
                                                cid: nextData.id
                                            }
                                        })
                                        this.onaxios();
                                    }
                                }
                            } else {
                                this.$toast.fail(res.data.message);
                            }
                        })
                //     }
                // })
            })
            .catch(()=>{})
        },
        // 一键提交（保存+提交接口）
        oneClickSubmit(){
            let tpjgsArr = [];
            let first = 1, firstArr = [];
            let second = 2, secondArr = [];
            let third = 3, thirdArr = [];
            this.voteList.map(item => {
                tpjgsArr.push(item.tpjg_tpyj)
                if (item.tpjg_tpyj == 1) {
                    firstArr.push(item)
                } else if (item.tpjg_tpyj == 2){
                    secondArr.push(item)
                } else if (item.tpjg_tpyj == 3){
                    thirdArr.push(item)
                }
            })
            // 保存接口数据
            let data = {
                sbm: sessionStorage.getItem('sbm'),
                tpjgs: tpjgsArr.join(','),
                // 内容id
                tpnrid: this.$route.query.cid,
                // 用户id--
                tpyhid: sessionStorage.getItem('userId')
            }
            // 提交接口数据
            // let params = {
            //     sbm: sessionStorage.getItem('sbm'),
            //     tpsxid: sessionStorage.getItem('sx_id'),
            //     tpyhid: sessionStorage.getItem('userId')
            // }
            this.$dialog.confirm({
                message: `已赞成<span style="color: rgb(225, 54, 46);font-size: 14px;">${firstArr.length}</span>票<br/>反对<span style="color: rgb(225, 54, 46);font-size: 14px;">${secondArr.length}</span>票<br/>弃权<span style="color: rgb(225, 54, 46);font-size: 14px;">${thirdArr.length}</span>票<br/>是否确认提交，提交后不可修改？`
            })
            .then(() => {
                this.$toast.loading({
                    message: '提交中...',
                    forbidClick: true,
                    overlay: true,
                    loadingType: 'spinner',
                    duration: 0
                })
                // voteSave(qs.stringify(data)).then(res=>{
                //     if (res.data.success) {
                        submitVoteContent(qs.stringify(data)).then(res=>{
                            let data = res.data;
                            if (data.success) {
                                this.$toast.clear();
                                this.$toast.success('提交成功');
                                this.onaxios();
                                this.$router.push('/sign-in');
                            } else {
                                this.$toast.fail(res.data.message);
                            }
                        })
                //     } else {
                //         this.$toast.fail(res.data.message);
                //     }
                // })
            })
            .catch(() => {})
        },
        // 退回首页
        onBack(){
            this.$router.push('/sign-in')
        },
        // 查看是够可以进行一键提交
        allSubmitFlag(){
            let data = {
                sx_id: sessionStorage.getItem('sx_id'),
                yh_id: sessionStorage.getItem('userId')
            }
            getContentStatus(data).then(res=>{
                let data = res.data;
                if (data.success) {
                    this.onaxios();
                    this.dataList = data.result;
                }
            })
        },
        // 获取数据
        onaxios(){
            let data = {
                id: this.$route.query.cid,
                yh_id: sessionStorage.getItem('userId')
            }
            let isSet = null;
            getContentReport(data).then(res=>{
                let data = res.data;
                if (data.code == 200) {
                    this.allData = data.result;
                    this.titleInfo = data.result[0];
                    this.voteList = data.result[1];
                    this.preData = data.result[3];
                    this.nextData = data.result[2];

                    // 设置初始值
                    this.voteList.map(item=>{
                        if (!item.tpjg_tpyj) {
                            item.tpjg_tpyj = '1';
                        } else {
                            // 判断当前数据是否提交了，如果提交了，【全部赞成】禁用，反之正常显示
                            if (item.tpyh_tpnrzt == 'Y') {
                                this.isAllZc = true;
                            } else {
                                this.isAllZc = false;
                            }
                        }
                    })
                    // 判断是否显示【上一项】按钮
                    if (this.titleInfo.tpnrXh != 1) {
                        this.preItemFlag = false;
                    }
                    // 获取初始值，判断是否保存过，如果没有保存过，默认为【赞成】意见
                    let yj = data.result[1][0].tpjg_tpyj;
                    if (!yj) {
                        this.radio = '1';
                    } else {
                        this.radio = data.result[1][0].tpjg_tpyj;
                    }
                    let newList = this.dataList.filter((item)=>{
                        return item.tpnr_flag == 'Y'
                    })

                    // 最后一条数据判断是否都提交
                    let allDataResult = newList.every(item=>{
                        return item.tpyh_tpnrzt == 'Y';
                    })
                    // 判断投票事项是否关闭
                    if (this.titleInfo.tpnrFlag == 'N') {
                        if(!this.nextData.length&&this.titleInfo.tpnrXh == this.dataList.length){
                            this.isNext = false;
                            this.submitAll = true;
                            this.submitAllFlag = true;
                            this.isAllZc = true;
                        } else {
                            this.isNext = false;
                            this.isSubmited = true;
                            this.isAllZc = true;
                        }
                        this.$toast({
                            type: "fail",
                            message: "投票功能已关闭！当前禁止投票！",
                            duration: "1000"
                        })
                    } else {
                        if(!this.nextData.length&&this.titleInfo.tpnrXh == this.dataList.length){
                            this.isSubmited = false;
                            // 如果已经全部提交并且是最后一条则隐藏，否则在最后一条数据显示
                            if (allDataResult) {
                                this.submitAll = true;
                                this.submitAllFlag = true;
                                this.isNext = false;
                                this.ytj = true;
                                this.submitItemFlag = true;
                            } else {
                                this.save = true;
                                this.isNext = false;
                                this.submitAll = true;
                            }
                            let itemFlag = data.result[1][0].tpyh_tpnrzt;
                            if (itemFlag == 'Y') {
                                // 选项状态
                                this.ytj = true;
                                this.submitItemFlag = true;
                            } else {
                                this.ytj = false;
                                this.submitItemFlag = false;
                            }
                        } else {
                            this.submitAll = false;
                            // 当前项是否提交过
                            let itemFlag = data.result[1][0].tpyh_tpnrzt;
                            if (itemFlag == 'Y') {
                                // 保存并下一项
                                this.isNext = false;
                                // 提交该项
                                this.submitItemFlag = true;
                                // 下一项
                                this.isSubmited = true;
                                // 选项状态
                                this.ytj = true;
                                // this.save = true;
                            } else {
                                this.isNext = true;
                                this.submitItemFlag = false;
                                this.isSubmited = false;
                                this.ytj = false;
                                this.save = false;
                            }
                        }
                    }
                }
            })
        },
        // 查看上一项
        preItemClick(){
            console.log('23232',this.preData)
            if (this.preData[0].tpTplxId == 1) {
                let path = this.$router.history.current.path;
                this.titleInfo = this.preData[0];
                this.$router.replace({
                    path,
                    query: {
                        // 下一项的内容id
                        cid: this.preData[0].id
                    }
                })
                this.onaxios();
            } else {
                this.$router.push({
                    path: "/person-vote",
                    query: {
                        cid: this.preData[0].id
                    }
                })
            }
        },
        // 修改投票意见
        changeVal(item, index, ind){
            this.voteList[index].tpjg_tpyj = ind;
        },
        // 直接保存
        saveInfo(){
            let tpjgsArr = [];
            this.voteList.map(item => {
                tpjgsArr.push(item.tpjg_tpyj)
            })
            let data = {
                sbm: sessionStorage.getItem('sbm'),
                tpjgs: tpjgsArr.join(','),
                // 内容id
                tpnrid: this.$route.query.cid,
                // 用户id--
                tpyhid: sessionStorage.getItem('userId')
            }
            voteSave(qs.stringify(data)).then(res=>{
                if (res.data.success) {
                    this.$toast.success('保存成功');
                    this.$router.push('/sign-in');
                } else {
                    this.$toast.fail(res.data.message);
                }
            })
        },
        // 查看下一项
        nextStep(){
            let nextData = this.allData[2][0];
            if (nextData.tpTplxId == 2) {
                this.$router.replace({
                    path: '/person-vote',
                    query: {
                        cid: nextData.id
                    }
                });
            } else {
                // 报告类
                let path = this.$router.history.current.path;
                this.titleInfo = nextData;
                this.$router.replace({
                    path,
                    query: {
                        cid: nextData.id
                    }
                });
                this.onaxios();
            }
        },
        // 查附件
        viewFile(item){
            let url = 'https://tp.cec.org.cn/jeecg-boot/sys/common/static/' + encodeURI(item.bg_wjlj)
            this.$router.push({
                path: '/preview-pdf',
                query: {
                    url
                }
            })
        }
    }
};
</script>
<style lang="scss">
.van-overlay {
    background-color: rgba(0,0,0,.2)!important;
}
.article-vote {
    .layui-form-radio {
        margin: 0;
        padding-right: 0;
        i {
            margin: 0;
        }
    }
    .layui-table {
        td {
            padding: 0 5px!important;
        }
        thead {
            th {
                font-size: .14rem;
                text-align: center;
                padding: 0!important;
                /* line-height: 1; */
            }
        }
        tbody {
            td {
                font-size: .14rem;
                text-align: center;
            }
        }
    }
    // 赞成
    .zc {
        .layui-form-radio i {
            width: .4rem;
            height: .4rem;
            border: .08rem solid#ccc;
            border-radius: 50%;
            font-size: inherit;
        }

        .layui-form-radioed i {
            border: .08rem solid #259b24!important;
        }
    }
    // 反对
    .fd {

        .layui-form-radio {
            position: relative;
        }
        .layui-form-radio i::after {
            content: "X";
            position: absolute;
            left: -.25rem;
            top: 0;
            font-size: 22px;
            width: .5rem;
            height: .5rem;
            color: #ccc;
        }
        .layui-form-radio>i {
            font-size: inherit!important;
        }
        .layui-form-radioed i::after {
            color: #e51c23;
        }
    }
    // 弃权
    .qq {
        .layui-form-radio i {
            width: .4rem;
            height: .08rem;
            background: #ccc;
            font-size: inherit;
        }

        .layui-form-radioed i {
            background: #ffc107;
        }
    }
}
</style>
<style lang="scss" scoped>
.article-vote {
    display: flex;
    flex-direction: column;
    background: #F6F6F6;
}
.header {
    width: 100%;
    height: .9rem;
    display: flex;
    align-items: center;
    padding:0 .3rem;
    justify-content: space-between;
    background: #fff;
    button {
        width: 1.6rem;
        height: .6rem;
        border-radius: .3rem;
    }
}
.section {
    flex: 1;
    overflow-y: scroll;
    .title {
        margin-top: 10px;
        text-align: center;
        padding: 0 .5rem;
        /* font-size: .3rem; */
        p {
            font-size: .3rem;
        }
    }
}
.footer {
    width: 100%;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 .3rem;
    background: #fff;
    button {
        width: 3.2rem;
        margin-right: 10px;
        height: 0.8rem;
        text-align: center;
        line-height: .8rem;
        border-radius: 0.4rem;
        font-size: 0.3rem;
        font-weight: 400;
        line-height: 0.42rem;
    }
    .van-button__text {
        font-size: .3rem;
    }
}

</style>
