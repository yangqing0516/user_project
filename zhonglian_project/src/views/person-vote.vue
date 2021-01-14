<template>
    <div class="person-vote wrapper">
         <div class="header">
            <van-button color="#E1362E" plain @click="onBack">返回首页</van-button>
            <p style="display:flex;">
                <van-button style="margin-right:.2rem;" round block type="info" color="#E1362E" native-type="submit" @click="allZc">全部赞成</van-button>
                <van-button round block type="info" color="#E1362E" native-type="submit" :disabled="submitItemFlag" @click="onSubmit">提交该项</van-button>
            </p>
            <!-- <van-button color="#E1362E" plain @click="onBack">返回首页</van-button>
            <van-button round block type="info" color="#E1362E" native-type="submit" :disabled="submitItemFlag" @click="onSubmit">提交该项</van-button> -->
        </div>
         <div class="section">
            <div class="title">
                <h3>{{titleInfo.tpnrXh}}、{{titleInfo.tpnrMc}}</h3>
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
                            <em>{{item.ry_xh}}、{{item.ry_xm}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.ry_dw}}</em>
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
            </div>
        </div>
        <div class="footer">
            <van-button color="#E1362E" plain @click="preItemClick" v-show="preItem" :disabled="preItemFlag">上一项</van-button>
            <van-button color="#E1362E" plain @click="nextStep" v-show="isSubmited">下一项</van-button>
            <van-button color="#E1362E" plain @click="saveForm" v-show="isNext">保存并下一项</van-button>
            <van-button round block type="info" color="#E1362E" v-show="submitAll" :disabled="submitAllFlag" @click="oneClickSubmit">一键提交</van-button>
            <van-button color="#E1362E" plain @click="saveInfo" v-show="save">保存</van-button>
        </div>
    </div>
</template>

<script>

    import {  
        getContentPerson, 
        getEnterInfo,
        submitAllVote,
        saveVoteResult, // 保存
        submitVoteResult, // 提交
        getContentStatus // 所有事项
    } from '@/api/index';
    export default {
        name: 'person-vote',
        data(){
            return {
                radio: 1,
                endTime: "",
                voteList: [],
                titleInfo: {},
                nextData: [],
                preData:[],
                // 提交该项投票
                submit: true,
                // 保存并下一项
                isNext: true,
                // 上一项
                preItem: true,
                // 上一项按钮禁用
                preItemFlag: true,
                // 保存
                save: false,
                // 下一项
                isSubmited: false,
                // 是否提交全部
                submitAll: false,
                // 当前项是否提交过
                submitItemFlag: false,
                // 控制选项
                ytj: false,
                // 所有事项
                dataList: [],
                // 一键提交按钮状态
                submitAllFlag: false
            }
        },
        mounted(){
            this.endTime = localStorage.getItem('endTime');
            this.allSubmitFlag();
        },
        methods: {
            allZc(){
                this.$dialog.confirm({
                    message: "确定要全部赞成吗？"
                }).then(() => {
                    this.voteList.map(item=>{
                        item.tpjg_tpyj = '1';
                        console.log(item)
                    })
                })
                .catch(()=>{})
            },
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
            onaxios(){
                let data = {
                    id: this.$route.query.cid,
                    yh_id: localStorage.getItem('userId')
                }
                getContentPerson(data).then(res=>{
                    let data = res.data;
                    let newdata = [];
                    if (data.code == 200) {
                        // 标题信息
                        this.titleInfo = data.result[0];
                        // 列表信息
                        this.voteList = data.result[1];
                        // 下一项内容
                        this.nextData = data.result[2];
                        // 上一项内容
                        this.preData = data.result[3];
                        // 设置初始值
                        this.voteList.map(item=>{
                            if (!item.tpjg_tpyj) {
                                item.tpjg_tpyj = '1';   
                            }
                        })
                        if (this.titleInfo.tpnrXh != 1) {
                            this.preItemFlag = false;
                        }
                        // 查看所有事项是否全部提交
                        let allDataResult = this.dataList.every(item=>{
                            return item.tpyh_tpnrzt == 'Y';
                        })
                        // 查看所有事项的状态是够有【为投票的】
                        let isHaveNoVote = this.dataList.some(item=>{
                            return item.tpyh_tpnrzt == null;
                        })
                       

                        if(!this.nextData.length&&this.titleInfo.tpnrXh == this.dataList.length){
                            this.isSubmited = false;
                            // 如果已经全部提交并且是最后一条则禁用，否则在最后一条数据显示
                            if (allDataResult) {
                                this.submitAll = true;
                                this.submitAllFlag = true;
                                this.isNext = false;
                                this.ytj = true;
                                this.submitItemFlag = true;
                            } else {
                                this.save = false;
                                this.isNext = false;
                                this.submitAll = true;
                            }

                            let itemFlag = data.result[1][0].tpyh_tpnrzt;
                            if (itemFlag == 'Y') {
                                // 选项状态
                                this.ytj = true;
                                this.submitItemFlag = true;
                            } else {
                                // this.save = true;
                                this.ytj = false;
                                this.submitItemFlag = false;
                            }
                        } else {
                             console.log('最后一条数据222')
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
                                // 保存
                                this.save = false;
                            } else {
                                this.save = false;
                                this.isNext = true;
                                this.submitItemFlag = false;
                                this.isSubmited = false;
                                this.ytj = false;
                            }
                        }
                    }
                })
            },
            // 查看上一项
            preItemClick(){
                console.log('23232',this.preData)
                if (this.preData[0].tpTplxId == 1) {
                    this.$router.replace({
                        path: "/article-vote",
                        query: {
                            cid: this.preData[0].id
                        }
                    })
                } else {
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
                }
            },
            // 退回首页
            onBack(){
                this.$router.push('/sign-in')
            },
            // 提交
            onSubmit() {
                // console.log(this.voteList)
                let nextData = this.nextData[0];
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
                // console.log('赞成人数', firstArr.length)
                // console.log('反对人数', secondArr.length)
                // console.log('弃权人数', thirdArr.length)
                
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.voteList[0].tp_tpnr_id,
                    // 用户id
                    tpyhid: localStorage.getItem('userId')
                }
                this.$dialog.confirm({
                    message: ` 已赞成<span style="color: rgb(225, 54, 46);font-size: 14px;">${firstArr.length}</span>票<br/>反对<span style="color: rgb(225, 54, 46);font-size: 14px;">${secondArr.length}</span>票<br/>弃权<span style="color: rgb(225, 54, 46);font-size: 14px;">${thirdArr.length}</span>票<br/>是否确定提交,提交后不可修改`
                    // message: `赞成数:${firstArr.length}<br/>反对数:${secondArr.length}<br/>弃权数:${thirdArr.length}`,
                    // message: `已赞成${firstArr.length}票<br/>反对${secondArr.length}票<br/>弃权${thirdArr.length}票<br/>是否确定提交,提交后不可修改`
                }).then(() => {
                    submitVoteResult(data).then(res=>{
                        if (res.data.success) {
                            this.ytj = true;
                            this.isNext = false;
                            this.save = false;
                            // this.isSubmited = true;
                            this.submitItemFlag = true;
                            // this.onaxios();
                            if (this.titleInfo.tpnrXh == this.dataList.length) {
                                this.isSubmited = false;
                            } else {
                                this.isSubmited = true;
                            }
                        } else {
                            this.$toast.fail(res.data.message)
                        }
                    })
                }).catch(() => {});
            },
            // 保存并下一步
            saveForm(){
                let nextData = this.nextData;
                let tpjgsArr = [];
                this.voteList.map(item => {
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                let data = {
                    // 识别码
                    sbm: localStorage.getItem('sbm'),
                    // 投票意见
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    // tpnrid: this.voteList[0].tp_tpnr_id,
                    tpnrid: this.$route.query.cid,
                    // 用户id
                    tpyhid: localStorage.getItem('userId')
                }
                this.$dialog.confirm({
                    message: "是否保存？"
                }).then(()=>{
                    saveVoteResult(data).then(res=>{
                        if (res.data.success) {
                            // 人员类
                            if (nextData[0].tpTplxId == 2) {
                                let path = this.$router.history.current.path;
                                this.titleInfo = nextData[0];
                                this.$router.replace({
                                    path,
                                    query: {
                                        cid: nextData[0].id
                                    }
                                });
                                this.onaxios();
                            } else { 
                                // 报告类
                                this.$router.replace({
                                    path: '/article-vote',
                                    query: {
                                        cid: nextData[0].id
                                    }
                                });
                            }
                        }
                    })
                }).catch(()=>{})
            },
            // 保存
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
                    // 用户id
                    tpyhid: localStorage.getItem('userId')
                }
                saveVoteResult(data).then(res=>{
                    if (res.data.success) {
                        this.onaxios();
                        this.$toast.success("保存成功");
                        this.$router.push('/sign-in');
                    } else {
                        this.$toast.fail(res.data.message);
                    }
                })
            },
            nextStep(){
                let nextData = this.nextData[0];
                if (nextData.tpTplxId == 2) {
                    let path = this.$router.history.current.path;
                    this.titleInfo = nextData;
                    this.$router.push({
                        path,
                        query: {
                            cid: nextData.id
                        }
                    })
                    this.onaxios();
                } else { 
                    // 报告类
                    this.$router.push({
                        path: '/article-vote',
                        query: {
                            cid: nextData.id
                        }
                    });
                }
            },
            // 一键提交
            oneClickSubmit(){
                let params = {
                    sbm: localStorage.getItem('sbm'),
                    tpsxid: localStorage.getItem('sx_id'),
                    tpyhid: localStorage.getItem('userId')
                }
                let tpjgsArr = [];
                this.voteList.map(item => {
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.$route.query.cid,
                    // 用户id
                    tpyhid: localStorage.getItem('userId')
                }
                this.$dialog.confirm({
                    message: '确认要全部提交吗？',
                })
                .then(() => {
                    saveVoteResult(data).then(res=>{
                        if (res.data.success) {
                            submitAllVote(params).then(res=>{
                                let data = res.data;
                                if (data.success) {
                                    this.$toast.success('提交成功');
                                    this.onaxios();
                                    this.$router.push('/sign-in');
                                } else {
                                    this.$toast.fail(res.data.message);
                                }
                            })
                        } else {
                            this.$toast.fail(res.data.message);
                        }
                    })
                    // submitAllVote(params).then(res=>{
                    //     let data = res.data;
                    //     if (data.success) {
                    //         this.$toast.success('提交成功');
                    //         this.onaxios();
                    //         this.$router.push('/sign-in');
                    //     }
                    // })
                })
                .catch(() => {})
            }
        }
    }
</script>
<style scoped lang="scss">
.person-vote {
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
    overflow-y: scroll;
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
    &>ul {
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
    .vote-option {
        margin-top: .3rem;
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