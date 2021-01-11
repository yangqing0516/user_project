<template>
    <div class="article-vote wrapper">
         <div class="header">
            <van-button color="#E1362E" plain @click="onBack">返回首页</van-button>
            <van-button round block type="info" color="#E1362E" native-type="submit" :disabled="submitItemFlag" @click="onSubmit">提交该项</van-button>
        </div>
        <div class="section">
            <div class="title">
                <h3>{{titleInfo.tpnrXh}}、{{titleInfo.tpnrMc}}</h3>
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
            </ul>
            <div class="vote-option">
                <ul>
                    <li v-for="(item, index) in voteList" :key="index">
                        <p>
                            <em>{{item.bg_xh}}、{{item.bg_mc}}</em>
                        </p>
                        <van-field name="radio">
                            <template #right-icon>
                                <van-radio-group :disabled="ytj" checked-color="#E1362E" v-model="item.tpjg_tpyj" direction="horizontal">
                                    <van-radio name="1">赞成</van-radio>
                                    <van-radio name="2">反对</van-radio>
                                    <van-radio name="3">弃权</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                    </li>
                </ul>
                <!-- <van-radio-group v-model="radio" :disabled="ytj">
                    <van-cell-group >
                        <van-cell title="赞成" clickable>
                            <template #right-icon>
                                <van-radio name="1" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                        <van-cell title="反对" clickable>
                            <template #right-icon>
                                <van-radio name="2" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                        <van-cell title="弃权" clickable>
                            <template #right-icon>
                                <van-radio name="3" checked-color="#E1362E"/>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group> -->
            </div>
        </div>
        <div class="footer">
            <van-button color="#E1362E" plain v-show="preItem" @click="preItemClick" :disabled="preItemFlag">上一项</van-button>
            <van-button color="#E1362E" plain v-show="isSubmited" @click="nextStep">下一项</van-button> 
            <van-button color="#E1362E" plain @click="saveForm" v-show="isNext">保存并下一项</van-button>
            <van-button color="#E1362E" plain @click="saveInfo" v-show="save">保存</van-button>
            <van-button round block type="info" color="#E1362E" v-show="submitAll" @click="oneClickSubmit" :disabled="submitAllFlag">一键提交</van-button>
        </div>
    </div>
</template>

<script>
    import {  
        getContentReport,
        getEnterInfo,
        voteSave,
        submitVoteContent,
        getContentStatus,
        submitAllVote,
    } from '@/api/index';
    export default {
        name: 'article-vote',
        data(){
            return {
                radio: '1', 
                endTime: "",
                titleInfo: {},
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
                allData:[]
            }
        },
        mounted(){
            this.endTime = localStorage.getItem('endTime')
            // this.onaxios();
            this.allSubmitFlag();
        },
        methods: {
            // 查看是够可以进行一键提交
            allSubmitFlag(){
                let data = {
                    sx_id: localStorage.getItem('sx_id'),
                    yh_id: localStorage.getItem('userId')
                }
                getContentStatus(data).then(res=>{
                    let data = res.data;
                    if (data.success) {
                        this.onaxios()
                        this.dataList = data.result;
                    }
                })
            },
            // 获取数据
            onaxios(){
                let data = {
                    id: this.$route.query.cid,
                    yh_id: localStorage.getItem('userId')
                }
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

                        let allDataResult = this.dataList.every(item=>{
                            return item.tpyh_tpnrzt == 'Y';
                        })
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
            // 保存并下一项
            saveForm(){
                let tpjgsArr = [];
                let nextData = this.allData[2][0];
                // let newNextData = this.nextData;
                // console.log('nextData = ',nextData)
                // console.log('newNextData = ',newNextData)
                this.voteList.map(item => {
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                let data = {
                    // 识别码
                    sbm: localStorage.getItem('sbm'),
                    // 用户id
                    tpyhid: localStorage.getItem('userId'),
                    // 投票结果
                    tpjgs: tpjgsArr.join(','),
                    // 内容id--tpnrbgid
                    tpnrid: this.$route.query.cid,
                }
                voteSave(data).then(res=>{
                    if (res.data.success) {
                        if (this.allData[2]) {
                            if (nextData.tpTplxId == 2) {
                                this.$router.replace({
                                    path: '/person-vote',
                                    query: {
                                        // 下一项的内容id
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
                    }
                })
            },
            // 退回首页
            onBack(){
                this.$router.push('/sign-in')
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
            // 直接保存
            saveInfo(){
                let tpjgsArr = [];
                this.voteList.map(item => {
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id--
                    tpyhid: localStorage.getItem('userId')
                }
                voteSave(data).then(res=>{
                    if (res.data.success) {
                        this.$toast.success('保存成功');
                        this.$router.push('/sign-in');
                    } else {
                        this.$toast.fail(res.data.message);
                    }
                })
            },
            nextStep(){
                let nextData = this.allData[2][0];
                console.log(nextData)
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
                    })
                    this.onaxios();
                }
            },
            // 提交
            onSubmit(){
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
                let data = {
                    // 识别码
                    sbm: localStorage.getItem('sbm'),
                    // 投票结果
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id--
                    tpyhid: localStorage.getItem('userId')
                }
                this.$dialog.confirm({
                    message: `赞成数:${firstArr.length}<br/>反对数:${secondArr.length}<br/>弃权数:${thirdArr.length}`,
                }).then(() => {
                    submitVoteContent(data).then(res=>{
                        if (res.data.success) {
                            this.ytj = true;
                            this.isNext = false;
                            this.save = false;
                            this.isSubmited = true;
                            this.submitItemFlag = true;
                        } else {
                            this.$toast.fail(res.data.message)
                        }
                    })
                }).catch(() => {});
            },
            // 一键提交
            oneClickSubmit(){
                this.$dialog.confirm({
                    // title: '标题',
                    message: '确认要全部提交吗？',
                })
                .then(() => {
                    let data = {
                        sbm: localStorage.getItem('sbm'),
                        tpsxid: localStorage.getItem('sx_id'),
                        tpyhid: localStorage.getItem('userId')
                    }
                    submitAllVote(data).then(res=>{
                        let data = res.data;
                        if (data.success) {
                            this.$toast.success('提交成功');
                            this.onaxios();
                            this.$router.push('/sign-in');
                        }
                    })
                })
                .catch(() => {
                    // on cancel
                })
            }
        }
    }
</script>
<style lang="scss">
/* .vote-option {
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
} */
</style>
<style scoped lang="scss">


.article-vote {
    display: flex;
    flex-direction: column;
    background: #F6F6F6;
}
.vote-option {
    ul {
        display: flex;
        flex-direction: column;
        li {
            height: 1.6rem;
            background: #fff;
            margin-bottom: .3rem;
            p {
                padding-top: .3rem;
                padding-left: .3rem;
                padding-right: .3rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                span, em {
                    color: #111;
                    font-size: 0.26rem;
                    font-weight: 400;
                    line-height: 0.37rem;
                }
            }
            .van-cell {
                padding: .26rem 0 .3rem;
                .van-radio--horizontal {
                    margin-right: .3rem;
                }
            }
        }
    }
}
.header {
    width: 100%;
    height: .9rem;
    display: flex;
    align-items: center;
    padding:0 .3rem;
    justify-content: space-between;
    background: #fff;
    /* img {
        width: .41rem;
        height: .38rem;
    } */
    button {
        width: 1.6rem;
        height: .6rem;
        border-radius: .3rem;
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