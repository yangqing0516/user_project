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
                        
                        <div class="status" :class="item.tpyh_tpnrzt==null||item.tpnr_flag=='N'?'no_vote':item.tpyh_tpnrzt=='N'?'no_submit':'submited'">
                            <button v-if="item.tpnr_flag=='N'">投票结束</button>
                            <button v-else-if="item.tpyh_tpnrzt=='Y'">已提交</button>
                            <button v-else-if="item.tpyh_tpnrzt=='N'">未提交</button>
                            <button v-else>未投票</button>
                        </div>
                    </li>
                </ul>
                <div v-else class="signBtn">
                    <h2 class="tip">欢迎{{tpyhDw}}代表参会</h2>
                    <button class="sign" @click="onSign">签到</button>
                </div>

            </div>
        </div>
        <div class="footer">
            <span @click="explain">《操作说明》</span>
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
        <!-- 理事会说明 -->
        <van-overlay :lock-scroll="false" :show="lshFlag">
            <div class="lshBox">
                <div class="close">
                    <img src="../assets/cancel.png" alt="" @click="lshFlag=false">
                </div>
                <div class="content">
                    <h2>中电联第七届理事会第一次会议网络投票操作说明</h2>
                    <div class="cont">
                        <span>一、扫码验证</span>
                        <p>
                            <b>（一）请打开微信或者支付宝使用“扫一扫”功能扫描下方二维码。</b>
                            <img src="../assets/lshQrcode.png" alt="">
                        </p>
                        <p>
                            <b>（二）扫码后可进入“中电联第七次会员代表大会在线投票系统”界面，点击“立即进入”按钮后进行投票用户验证，验证方式包括“手机号验证”和“投票识别码验证”两种，可选择任意一种方式进行验证，验证通过后进入签到页面。</b>
                        </p>
                        <span>二、签到</span>
                        <p>
                            <b>进入签到页面，请核对单位信息，核对无误后点击“签到”按钮进行签到，如超出“签到”时间，“签到”通道将会关闭，未签到用户将不能进行签到以及后续的投票工作。</b>
                        </p>
                        <span>三、投票</span>
                        <p>
                            <b>（一）投票用户签到后可以看到投票内容列表，每项投票内容后面都标记有投票状态（未投票、已投票、投票结束）。本次会议投票一项表决事项、二项选举事项：</b>
                            <br/>
                            1.章程及会费管理办法表决。<br/>
                            2.第七届理事会理事单位及理事选举、第七届监事会监事选举。
                        </p>
                        <p>
                            <b>
                                （二）首先点击“章程及会费管理办法表决”即可进入投票表决页面，投票意见默认为<em>“赞成：Ο”</em>，如有其他意见可点击相应图标<em>“反对：×，弃权：–”，</em>选择完毕后点击“提交”按钮投票，也可点击“全部赞成”按钮直接投票，点击“提交”后，出现二次确认健，确认提交成功后，将显示“提交成功”字样，提交后不能修改。<br/>上一表决（选举）事项提交后，可点击“下一项”按钮继续进行下一项投票，或者点击“返回首页”按钮可返回到投票内容列表页面。
                            </b>
                            <b>（三）请各位代表依次按列表顺序完成所有三项投票内容的投票，如某一项投票内容已超出投票时间，系统将会关闭该项投票，该项投票内容状态显示“投票结束”，未投票的代表将不能再对该事项进行投票，但仍可进行下一项投票。</b>
                        </p>
                    </div>
                </div>
            </div>
        </van-overlay>
        
        <!-- 会员代表大会说明 -->
        <van-overlay :lock-scroll="false" :show="hyFlag">
            <div class="hyBox">
                <div class="close">
                    <img src="../assets/cancel.png" alt="" @click="hyFlag=false">
                </div>
                <div class="content">
                    <h2>中电联第七次会员代表大会网络投票操作说明</h2>
                    <div class="cont">
                        <span>一、扫码验证</span>
                        <p>
                            <b>（一）请打开微信或者支付宝使用“扫一扫”功能扫描下方二维码。</b>
                            <img src="../assets/hyQrcode.png" alt="">
                        </p>
                        <p>
                            <b>（二）扫码后可进入“中电联第七届理事会第一次会议在线投票系统”界面，点击“立即进入”按钮后进行投票用户验证，验证方式包括“手机号验证”和“投票识别码验证”两种，可选择任意一种方式进行验证，验证通过后进入签到页面。</b>
                        </p>
                        <span>二、签到</span>
                        <p>
                            <b>进入签到页面，请核对单位信息，核对无误后点击“签到”按钮进行签到，如超出签到时间，签到通道将会关闭，未签到用户将不能进行签到以及后续的投票工作。</b>
                        </p>
                        <span>三、投票</span>
                        <p>
                            <b>（一）投票用户签到后可以看到投票内容列表，每项投票内容后面都标记有投票状态（未投票、已投票、投票结束）。</b>
                            <br/>
                            本次会议包括二项选举事项：
                            <br/>
                            1.常务理事单位及常务理事选举。<br/>
                            2.理事会负责人选举。
                        </p>
                        <p>
                            <b>
                                （二）首先点击“常务理事单位及常务理事选举”即可进入投票表决页面，投票意见默认为<em>“赞成：Ο”</em>，如有其他意见可点击相应图标<em>“反对：×，弃权：–”，</em>选择完毕后点击“提交”按钮投票，也可点击“全部赞成”按钮直接投票，点击“提交”后，出现二次确认健，确认提交成功后，将显示“提交成功”字样，提交后不能修改。<br/>上一表决（选举）事项提交后，可点击“下一项”按钮继续进行下一项投票，或者点击“返回首页”按钮可返回到投票内容列表页面。
                            <br/>
                            </b>
                            <b>（三）请各位代表依次按列表顺序完成所有二项投票内容的投票，如某一项投票内容已超出投票时间，系统将会关闭该项投票，该项投票内容状态显示“投票结束”，未投票的代表将不能再对该事项进行投票，但仍可进行下一项投票。</b>
                        </p>
                    </div>
                </div>
            </div>
        </van-overlay>
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
            lshFlag: false,
            hyFlag: false,
            specialList: [],
            tpyhQd: "",
            title: "",
            tpyhDw: "",
            explainObj: "中电联第七届理事会第一次会议网络投票操作说明",
            sx_id: sessionStorage.getItem('sx_id')
        }
    },
    watch: {},
    mounted(){
        this.isSignIn();
        this.onaxios();
        this.title = sessionStorage.getItem('title');
        console.log('事项id',this.sx_id)
    },
    methods: {
        // 查看操作说明
        explain(){
            if (this.sx_id == "1333344778143465474") {
                console.log('会员代表大会')
                this.hyFlag = true;
            } else {
                console.log('理事会')
                this.lshFlag = true;
            }
        },
        isSignIn(){
            let data = {
                sbm: sessionStorage.getItem('sbm'),
                sx_id: sessionStorage.getItem('sx_id')
            }
            userList(data).then(res=>{
                let data = res.data;
                if (data.success) {
                    this.tpyhQd = data.result.tpyhQd;
                    this.tpyhDw = data.result.tpyhDw;
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
                    // console.log('awrawrqwerqwe',this.specialList)
                    let newList = this.specialList.filter(item=>{
                        return item.tpnr_flag == 'Y';
                    })
                    // console.log('新数据',newList)
                    this.isSome = newList.every(item=>{
                        return item.tpyh_tpnrzt == 'Y';
                    })
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
            if (nowIndex != 0) {
                if (this.specialList[nowIndex-1].tpnr_flag == 'N') {
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
                    if (this.specialList[nowIndex-1].tpyh_tpnrzt!=null) {
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
                            message: '请按序号依次进行投票',
                            theme: 'round-button',
                        }).then(() => {});
                    }
                }
                
            } else {
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
        // height: 24px ;
        // background: #FFFFFF;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // background: url(../assets/footer_bg.png) no-repeat;
        // background-size: 100%;
        span {
            color: #0f83b1;
            font-size: .28rem;
            margin-bottom: .2rem;
        }
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
.hyBox, .lshBox {
    position: relative;
    width: 100%;
    height: 100%;
    .close {
        position: absolute;
        right: .4rem;
        top: .4rem;
        img {
            width: 0.54rem;
            height: 0.54rem;
        }
    }
    .content {
        padding: 0 .2rem .2rem;
        width: 80%;
        height: 70%;
        background: #fff;
        border-radius: .3rem;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9;
        margin: auto;
        display: flex;
        flex-direction: column;
        h2 {
            padding: .3rem .4rem;
            /* margin-top: .3rem; */
            /* height: 1rem; */
            text-align: center;
            font-size: .34rem;
            font-weight: bold;
            color: #111111;
        }
        .cont {
            flex: 1;
            /* background: pink; */
            overflow: hidden;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            span {
                color: #000;
                font-size: .26rem;
            }
            p {
                b {
                    display: inline-block;
                    font-size: .24rem;
                    // text-indent: 2em;
                    em {
                        font-weight: bolder;
                    }
                }
                img {
                    width: 3rem;
                    height: 3rem;
                    margin: .2rem auto;
                    display: block;
                }
            }
        }
    }
}
</style>
