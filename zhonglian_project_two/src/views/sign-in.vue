<template>
    <div class="sign-in wrapper">
        <div class="section">
            <div class="banner">
                <img src="../assets/home_banner.jpg" alt="">
                <h2>{{title}}</h2>
                <div v-if="tpyhQd=='Y'">
                    <button v-show="isSome">投票完成</button>
                    <button v-show="!isSome">投票中</button>
                </div>
            </div>
            <div class="special-list">
                <ul v-if="tpyhQd=='Y'">
                    <li v-for="(item, index) in specialList" :key="index" @click="onStartVote(item, index)">
                        <h3>{{index+1}}、{{item.tpnr_mc}}</h3>
                        <div class="status" :class="item.tpyh_tpnrzt==null?'no_vote':item.tpyh_tpnrzt=='N'?'no_submit':'submited'">
                            <button v-if="item.tpyh_tpnrzt=='Y'">已提交</button>
                            <button v-else-if="item.tpyh_tpnrzt=='N'">未提交</button>
                            <button v-else>未投票</button>
                        </div>
                    </li>
                </ul>
                <div v-else class="signBtn">
                    <h2 class="tip">参加本次会议，请先点击签到按钮</h2>
                    <button class="sign" @click="onSign">签到</button>
                </div>
                
            </div>
        </div>
        <div class="footer">
            <img src="../assets/footer_bg.png" alt="">
            <!-- <van-button :disabled="isSome" color="#E1362E" round type="info" @click="onSubmit">一键提交</van-button> -->
        </div>
        <!-- 签到弹框 -->
        <div class="sign-dialog" v-show="isSign">
            <div class="sign">
                <div class="top">
                    <!-- <img class="bg" src="../assets/sing_bg.png" alt=""> -->
                    <img src="../assets/sing_success.png" alt="" class="success">
                    <span>签到成功</span>
                </div>
                <div class="bottom">
                    <h4>恭喜您签到成功，请开始投票</h4>
                    <button @click="startVote">开始投票</button>
                </div>
                <div class="close" @click="cancelSign">
                    <img src="../assets/cancel.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {  getContentStatus, userSignIn, userList, submitAllVote } from '@/api/index';
export default {
    name: "sign-in",
    data(){
        return {
            isSign: false,
            isDisabled: true,
            isSome: false,
            isVote: true,
            specialList: [],
            tpyhQd: "",
            title: ""
        }
    },
    watch: {},
    mounted(){
        this.isSignIn();
        this.onaxios();
        this.title = sessionStorage.getItem('title')
    },
    methods: {
        isSignIn(){
            let data = {
                sbm: sessionStorage.getItem('sbm'),
                sx_id: sessionStorage.getItem('sx_id')
            }
            userList(data).then(res=>{
                let data = res.data;
                if (data.success) {
                    this.tpyhQd = data.result.tpyhQd;
                    // 判断是否签到过
                    // if(data.result.tpyhQd == 'Y'){
                    //    this.isVote = false;
                    // }
                }
            })
        },
        onaxios(){
            let data = {
                sx_id: sessionStorage.getItem('sx_id'),
                yh_id: sessionStorage.getItem('userId')
            }
            getContentStatus(data).then(res=>{
                let data = res.data;
                if (data.code == 200) {
                    this.specialList = data.result;
                    this.isSome = this.specialList.every(item=>{
                        return item.tpyh_tpnrzt == 'Y';
                    })
                    // let isAllSubmit = this.specialList.every(item=>{
                    //     return item.tpyh_tpnrzt == 'Y'
                    // })
                    // if (isAllSubmit) {
                    //     this.isSome = true;
                    // }
                }
            })
        },
        // 签到
        onSign(){
            let data = {
                yh_id: sessionStorage.getItem('userId')
            }
            userSignIn(data).then(res=>{
                let data = res.data;
                if (data.code == 200) {
                    this.isSign = true;
                    this.isVote = false;
                    this.isSignIn();
                } else {
                    this.$toast.fail(data.message);
                }
            })
        },
        // 取消
        cancelSign(){
            this.isSign = false;
        },
        // 公共方法
        commonVote(item, nowIndex){
            if (nowIndex!=0) {
                if (this.specialList[nowIndex-1].tpyh_tpnrzt!=null) {
                    if (this.tpyhQd == 'Y') {
                        // cid  内容id
                        if (item.tp_tplx_id == 2) {
                            this.$router.push({
                                path: '/person-vote',
                                query: {
                                    cid: item.id
                                }
                            });
                        } else {
                            this.$router.push({
                                path: '/article-vote',
                                query: {
                                    cid: item.id
                                }
                            });
                        }
                    } else {
                        this.$dialog.alert({
                            message: '请您先签到',
                            theme: 'round-button',
                        }).then(() => {});
                    }
                } else {
                    this.$dialog.alert({
                        message: '请按序号依次进行投票',
                        theme: 'round-button',
                    }).then(() => {});
                }
            } else {
                if (this.tpyhQd == 'Y') {
                    if (item.tp_tplx_id == 2) {
                        this.$router.push({
                            path: '/person-vote',
                            query: {
                                cid: item.id
                            }
                        });
                    } else {
                        this.$router.push({
                            path: '/article-vote',
                            query: {
                                cid: item.id
                            }
                        });
                    }
                } else {
                    this.$dialog.alert({
                        message: '请您先签到',
                        theme: 'round-button',
                    }).then(() => {});
                }
            }
        },
        // 列表点击进行投票
        onStartVote(item, nowIndex){
            // 人员类
            if (item.tpyh_tpnrzt == 'Y') {
                this.$toast({
                    message: "该项投票已提交",
                    duration: "1000",
                    onOpened: ()=>{
                        console.log('sdfdsfsdf')
                    },
                    onClose: ()=>{
                        this.commonVote(item, nowIndex);
                        console.log(2424234234)
                    }
                })
            } else {
                this.commonVote(item, nowIndex);
            }
        },
        // 一键提交
        onSubmit(){
            this.$dialog.confirm({
                message: '确认要全部提交吗？',
            })
            .then(() => {
                let data = {
                    sbm: sessionStorage.getItem('sbm'),
                    tpsxid: sessionStorage.getItem('sx_id'),
                    tpyhid: sessionStorage.getItem('userId')
                }
                submitAllVote(data).then(res=>{
                    let data = res.data;
                    if (data.success) {
                        this.$toast.success('提交成功');
                        this.onaxios();
                    }
                })
            })
            .catch(() => {
                // on cancel
            })
        },
        // 开始投票
        startVote(){
            let tp_tplx_id = this.specialList[0].tp_tplx_id;
            let tp_tpnr_id = this.specialList[0].tp_tpnr_id;
            if (tp_tplx_id == 2) {
                this.$router.push({
                    path: '/person-vote',
                    query: {
                        cid: tp_tpnr_id,
                        userId: sessionStorage.getItem('userId'),
                        sbm: sessionStorage.getItem('sbm'),
                        sx_id: sessionStorage.getItem('sx_id')
                    }
                });
            } else { // 报告类
                this.$router.push({
                    path: '/article-vote',
                    query: {
                        cid: tp_tpnr_id,
                        userId: sessionStorage.getItem('userId'),
                        sbm: sessionStorage.getItem('sbm'),
                        sx_id: sessionStorage.getItem('sx_id')
                    }
                });
            }
        }
    }
}
</script>

<style lang="scss" scope>
.signBtn {
    margin-top: 3rem;
    .tip {
        font-size: 0.34rem;
        font-weight: 400;
        color: #555555;
        line-height: 0.42rem;
        text-align: center;
        margin-bottom: .4rem;
    }
    .sign {
        position: relative;
        left: 50%;
        margin-left: -2.94rem;
        width: 5.88rem;
        height: 0.84rem;
        background: #E1362E;
        border-radius: 0.4rem;
        font-size: 0.36rem;
        color: #FFFFFF;
        font-weight: 500;
    }
}

.sign-in {
    width: 100%;
    height: 100%;
    background: #F6F6F6;
    display: flex;
    flex-direction: column;
    .section {
        overflow-y: scroll;
        flex: 1;
        .banner {
            position: relative;
            img {
                width: 100%;
            }
            h2 {
                text-align: center;
                position: absolute;
                padding: 0 .47rem;
                width: 100%;
                top: .7rem;
                font-size: 0.38rem;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 0.54rem;
            }
            span {
                position: absolute;
                right: .47rem;
                bottom: .2rem;
                color: #fff;
                font-size: 0.28rem;
                font-weight: 500;
            }
            button {
                position: absolute;
                right: .47rem;
                bottom: .2rem;
                width: 2rem;
                height: 0.6rem;
                text-align: center;
                line-height: .6rem;
                background: #FFFFFF;
                box-shadow: 0rem 0.02rem 0.13rem 0rem #FE7962;
                border-radius: 1rem;
                color: #FE5337;
                font-size: .28rem;
            }
        }
        .special-list {
            ul {
                display: flex;
                flex-direction: column;
                li {
                    width: 100%;
                    height: 1.6rem;
                    background: #fff;
                    margin-top: .2rem;display: flex;
                    align-items: center;
                    .status {
                        width: 1.35rem;
                        height: .56rem;
                        font-size: 0.28rem;
                        color: #FFFFFF;
                        line-height: 0.4rem;
                        font-weight: 400;
                        border-radius: 0.35rem 0 0 .35rem;
                        text-align: center;
                        line-height: .56rem;
                    }
                    .no_vote {
                        background: linear-gradient(90deg, #F1433A 0%, #FFA08F 100%);
                    }

                    .no_submit {
                        background: linear-gradient(90deg, #F6C900 0%, #FCE9A1 100%);
                    }
                    .submited {
                        background: linear-gradient(90deg, #73C088 0%, #A1F6B8 100%);
                    }

                    h3 {
                        flex: 1;
                        padding-left: .3rem;
                        font-size: 0.28rem;
                        font-weight: 400;
                        color: #111111;
                        line-height: 0.45rem;
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
        }
    }


    .footer {
        width: 100%;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 100%;
            height: auto;
        }
        /* padding: 0 .5rem; */
        
        /* button {
            width: 100%;
            height: 0.8rem;
            border-radius: 0.4rem;
            span {
                font-size: .3rem;
                line-height: 0.42rem;
                font-weight: 400;
                color: #FFFFFF;
            }
        } */
    }


    /* 签到成功弹框 */
    .sign-dialog {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.6);
        position: fixed;
        left: 0;
        top: 0;
        /* z-index: 9; */



        .sign {
            width: 4.9rem;
            height: 5.31rem;
            /* z-index: 99; */
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            display: flex;
            flex-direction: column;
            .top {
                height: 2.25rem;
                background: url(../assets/sing_bg.png) no-repeat;
                background-size: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .bg {
                    width: 100%;
                    height: 100%;
                }

                .success {
                    width: .88rem;
                    height: .78rem;
                }

                span {
                    color: #FFFFFF;
                    font-size: .3rem;
                    margin-top: .2rem;
                }
            }

            .bottom {
                background: #fff;
                flex: 1;
                border-radius: 0 0 .2rem .2rem;
                text-align: center;
                h4 {
                    font-size: 0.3rem;
                    font-weight: 400;
                    color: #555555;
                    line-height: 0.42rem;
                    margin-top: .64rem;
                    margin-bottom: .62rem;
                }
                button {
                    width: 3.2rem;
                    height: 0.8rem;
                    background: #E1362E;
                    box-shadow: 0rem 0.01rem 0.1rem 0rem #E1362E;
                    border-radius: 0.51rem;
                    font-size: 0.36rem;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 0.5rem;
                }
            }
        }

        .close {
            position: absolute;
            bottom: -1rem;
            left: 50%;
            margin-left: -.27rem;
            img {
                width: .54rem;
                height: .54rem;
            }
        }
    }
}
</style>