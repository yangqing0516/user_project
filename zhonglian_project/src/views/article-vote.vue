<template>
    <div class="article-vote wrapper">
         <div class="header" @click="onBack">
            <img src="../assets/home.png" alt="">
        </div>
        <div class="section">
            <div class="title">
                <!-- <span>{{titleInfo.tpTplxId==1?'报告类':''}}{{titleInfo.tpnrXh}}、</span> -->
                <span>{{titleInfo.tpnrXh}}、</span>
                <h3>{{titleInfo.tpnrMc}}</h3>
                <button @click="viewFile">查看附件</button>
            </div>
            <ul>
                <li>
                    <img src="../assets/radio.png" alt="">
                    <span>单选</span>
                </li>
                <li>
                    <span>截止时间：{{endTime}}</span>
                </li>
                <!-- <li>
                    <img src="../assets/participate_in.png" alt="">
                    <span>3人已参与</span>
                </li> -->
            </ul>
            <div class="vote-option">
                <van-radio-group v-model="radio" :disabled="ytj">
                    <van-cell-group >
                        <van-cell title="赞成" clickable @click="radio = '1'">
                            <template #right-icon>
                                <van-radio name="1" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                        <van-cell title="反对" clickable @click="radio = '2'">
                            <template #right-icon>
                                <van-radio name="2" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                        <van-cell title="弃权" clickable @click="radio = '3'">
                            <template #right-icon>
                                <van-radio name="3" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </div>
        <!--  v-show="isFooter" -->
        <div class="footer">
            <van-button color="#E1362E" plain @click="saveForm" v-show="isNext">保存并下一步</van-button>
            <van-button round block type="info" @click="submitVote" v-show="submited" color="#E1362E" native-type="submit">提交该项投票</van-button>
            <van-button color="#E1362E" plain @click="saveInfo" v-show="save">保存</van-button>
            <van-button color="#E1362E" plain v-show="isSubmited" @click="nextStep">下一条</van-button>
        </div>
    </div>
</template>

<script>
    import {  
        getContentReport,
        getEnterInfo,
        voteSave,
        submitVoteContent
    } from '@/api/index';
    export default {
        name: 'article-vote',
        data(){
            return {
                radio: '1', 
                endTime: "",
                titleInfo: {},
                isNext: true,
                save: false,
                isSubmited: false,
                submited: true,
                ytj: false,
                allData: [],
                isFooter: true,
            }
        },
        mounted(){
            this.onaxios();
            this.getEndTime();
        },
        methods: {
            // 获取截止时间
            getEndTime(){
                let data = {
                    id: localStorage.getItem('sx_id')
                }
                getEnterInfo(data).then(res=>{
                    let data = res.data;
                    if (data.code == 200) {
                        this.endTime = data.result.tpsxJzsj.slice(0,10);
                    }
                })
            },
            onaxios(){
                // console.log('ok')
                let data = {
                    id: this.$route.query.cid,
                    yh_id: this.$route.query.userId
                }
                // console.log('axios----', data)
                getContentReport(data).then(res=>{
                    let data = res.data;
                    if (data.code == 200) {
                        this.allData = data.result;
                        this.titleInfo = data.result[0];
                        // console.log('数据数据',this.titleInfo)
                        let yj = data.result[1][0].tpjg_tpyj;
                        if (!yj) {
                            this.radio = '1';
                        } else {
                            this.radio = data.result[1][0].tpjg_tpyj;
                        }
                        
                        if (!data.result[2].length) {
                            this.save = true;
                            this.isNext = false;
                        }
                        if (data.result[1][0].tpyh_tpnrzt == 'Y') {
                            this.isNext = false;
                            this.save = false;
                            this.submited = false;
                            this.isSubmited = true;
                            this.ytj = true;
                        } else {
                            this.ytj = false;
                            this.isNext = true;
                            this.submited = true;
                            this.saveInfo = false;
                            this.isSubmited = false;
                        }
                    }
                })
            },
            // 退回首页
            onBack(){
                this.$router.push({
                    path: '/sign-in',
                    query: {
                        userId: this.$route.query.userId,
                        // 事项id
                        id: this.$route.query.sx_id
                    }
                })
            },
            // 查附件
            viewFile(){
                let url = 'https://tp.cec.org.cn/jeecg-boot/sys/common/static/' + encodeURI(this.allData[1][0].bg_wjlj)
                // let url = this.allData[1][0].bg_wjlj;
                this.$router.push({
                    path: '/preview-pdf',
                    query: {
                       url
                    }
                })
            },
            // 保存并下一步
            saveForm(){
                let data = {
                    // 识别码
                    sbm: localStorage.getItem('sbm'),
                    // 投票结果
                    tpjg: this.radio,
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id
                    tpyhid: this.$route.query.userId
                }
                voteSave(data).then(res=>{
                    if (res.data.success) {
                        if (this.allData[2]) {
                            let nextData = this.allData[2][0];
                            if (nextData.tpTplxId == 2) {
                                this.$router.push({
                                    path: '/person-vote',
                                    query: {
                                        cid: nextData.id,
                                        userId: localStorage.getItem('userId'),
                                        sbm: localStorage.getItem('sbm'),
                                        sx_id: localStorage.getItem('sx_id')
                                    }
                                });
                            } else {
                                // this.onaxios();
                                let path = this.$router.history.current.path;
                                this.titleInfo = nextData;
                                this.$router.push({
                                    path,
                                    query: {
                                        cid: nextData.id,
                                        userId: localStorage.getItem('userId'),
                                        sbm: localStorage.getItem('sbm'),
                                        sx_id: localStorage.getItem('sx_id')
                                    }
                                })
                                this.onaxios();
                            }
                        }
                    }
                })
            },
            // 直接保存
            saveInfo(){
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjg: this.radio,
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id
                    tpyhid: this.$route.query.userId
                }
                voteSave(data).then(res=>{
                    if (res.data.success) {
                        this.onaxios();
                        this.$toast.success('保存成功');
                    } else {
                        this.$toast.fail(res.data.message);
                    }
                })
            },
            nextStep(){
                let nextData = this.allData[2][0];
                console.log(nextData)
                if (nextData.tpTplxId == 2) {
                    this.$router.push({
                        path: '/person-vote',
                        query: {
                            userId: this.$route.query.userId,
                            cid: nextData.id,
                            sbm: localStorage.getItem('sbm'),
                            sx_id: this.$route.query.sx_id
                        }
                    });
                } else {
                    // 报告类
                    let path = this.$router.history.current.path;
                    this.titleInfo = nextData;
                    this.$router.push({
                        path,
                        query: {
                            cid: nextData.id,
                            userId: localStorage.getItem('userId'),
                            sbm: localStorage.getItem('sbm'),
                            sx_id: localStorage.getItem('sx_id')
                        }
                    })
                    this.onaxios();
                    // this.titleInfo = nextData;
                    // this.$router.push({
                    //     path: '/article-vote',
                    //     query: {
                    //         userId: localStorage.getItem('userId'),
                    //         cid: nextData.id,
                    //         sbm: localStorage.getItem('sbm'),
                    //         sx_id: localStorage.getItem('sx_id')
                    //     }
                    // });
                }
            },
            // 提交
            submitVote(){
                // console.log(this.voteList)
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjg: this.radio,
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id
                    tpyhid: this.$route.query.userId
                }
                
                submitVoteContent(data).then(res=>{
                    if (res.data.success) {
                        if (this.allData[2]&&this.allData[2].length) {
                            this.ytj = true;
                            this.isNext = false;
                            this.save = false;
                            this.submit = false;
                            this.isSubmited = true;
                        } else {
                            this.ytj = true;
                            this.isFooter = false;
                        }
                    } else {
                        this.$toast.fail(res.data.message)
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
.vote-option {
    margin-top: .3rem;
    .van-cell {
        margin-bottom: .3rem;
        padding: 0 .3rem;
        height: .9rem;
        align-items: center;
        justify-content: space-between;
        .van-field__label {
            width: auto;
        }
        .van-cell__title, .van-cell__value {
            flex: inherit;
        }
        .van-cell__title {
            span {
                font-size: 0.26rem;
                font-weight: 400;
                color: #111111;
                line-height: 0.37rem;
            }
        }
    }
    .van-cell-group {
        background-color: transparent;
    }
    .van-cell::after {
        border-bottom: 0!important;
    }
    .van-radio--horizontal,.van-field__label {
        margin-right: 0;;
    }
}
</style>
<style scoped lang="scss">


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
    padding-left: .3rem;
    justify-content: flex-start;
    background: #fff;
    img {
        width: .41rem;
        height: .38rem;
    }
}

.section {
    flex: 1;
    .title {
        padding: 0 .3rem;
        display: flex;
        align-items: center;
        margin-top: .38rem;
        margin-bottom: .28rem;
        h3 {
            font-size: 0.3rem;
            font-weight: 400;
            color: #111111;
            line-height: 0.42rem;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        button {
            font-size: 0.24rem;
            color: #E1362E;
            line-height: 0.42rem;
            font-weight: 400;
            width: 1.2rem;
            height: 0.46rem;
            text-align: center;
            line-height: .46rem;
            border-radius: 0.3rem;
            border: 0.01rem solid #E1362E!important;
        }
    }
    ul {
        display: flex;
        justify-content: space-between;
        padding: 0 .3rem;
        li {
            &:nth-child(1) {
                img {
                    width: .17rem;
                    height: .17rem;
                }
            }
            &:nth-child(3) {
                img {
                    width: .18rem;
                    height: .17rem;
                }
            }
            span {
                font-size: 0.18rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.25rem;
            }
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