<template>
    <div class="person-vote wrapper">
         <div class="header" @click="onBack">
            <img src="../assets/home.png" alt="">
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
                <!-- <li>
                    <img src="../assets/participate_in.png" alt="">
                    <span>3人已参与</span>
                </li> -->
            </ul>
            <div class="vote-option">
                <ul>
                    <li v-for="(item, index) in voteList" :key="index">
                        <p>
                            <em>{{item.ry_xh}}、{{item.ry_xm}}</em>
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
        <div class="footer" v-show="isFooter">
            <van-button color="#E1362E" plain @click="saveForm" v-show="isNext">保存并下一步</van-button>
            <van-button color="#E1362E" plain @click="saveInfo" v-show="save">保存</van-button>
            <van-button round block type="info" color="#E1362E" native-type="submit" @click="onSubmit" v-show="submit">提交该项投票</van-button>
            <van-button color="#E1362E" plain v-show="isSubmited" @click="nextStep">下一条</van-button>
        </div>
    </div>
</template>

<script>

    import {  
        getContentPerson, 
        getEnterInfo,
        saveVoteResult, // 保存
        submitVoteResult // 提交
    } from '@/api/index';
    export default {
        name: 'person-vote',
        data(){
            return {
                radio: 1,
                endTime: "",
                voteList: [],
                titleInfo: {},
                nextData: {},
                isNext: true,
                save: false,
                submit: true,
                isSubmited: false,
                ytj: false,
                isFooter: true
            }
        },
        mounted(){
            this.onaxios();
            this.isSubmit();
            this.getEndTime();
        },
        methods: {
            isSubmit(){
                let data = {
                    id: this.$route.query.cid,
                    yh_id: this.$route.query.userId
                }
                getContentPerson(data).then(res=>{
                    if (res.data.success) {
                        let titInfo = res.data.result[1];
                        if (titInfo[0].tpyh_tpnrzt == 'Y') {
                            this.ytj = true;
                            this.isNext = false;
                            this.save = false;
                            this.submit = false;
                            this.isSubmited = true;
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
                        id: this.$route.query.sx_id
                    }
                })
            },
            // 提交
            onSubmit() {
                // console.log(this.voteList)
                let tpjgsArr = [];
                let nextData = this.nextData[0];
                this.voteList.map(item=>{
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.voteList[0].tp_tpnr_id,
                    // 用户id
                    tpyhid: this.$route.query.userId
                }
                submitVoteResult(data).then(res=>{
                    if (res.data.success) {
                        this.ytj = true;
                        this.isNext = false;
                        this.save = false;
                        this.submit = false;
                        this.isSubmited = true;
                        this.onaxios()
                    }
                })
            },
            onaxios(){
                let data = {
                    id: this.$route.query.cid,
                    yh_id: this.$route.query.userId
                }
                getContentPerson(data).then(res=>{
                    let data = res.data;
                    let newdata = [];
                    if (data.code == 200) {
                        this.titleInfo = data.result[0];
                        this.voteList = data.result[1];
                        this.voteList.map(item=>{
                            if (!item.tpjg_tpyj) {
                                item.tpjg_tpyj = '1';   
                            }
                        })
                        if (data.result[2].length) {
                            // console.log(23)
                            this.nextData = data.result[2];
                        } else {
                            console.log(45)
                            this.isNext = false;
                            this.save = true;
                            this.nextData = [];
                            this.isSubmited = false;
                        }
                        
                    }
                })
            },
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
            // 保存并下一步
            saveForm(){
                let nextData = this.nextData;
                let tpjgsArr = [];
                this.voteList.map(item => {
                    tpjgsArr.push(item.tpjg_tpyj)
                })
                let data = {
                    sbm: localStorage.getItem('sbm'),
                    tpjgs: tpjgsArr.join(','),
                    // 内容id
                    tpnrid: this.voteList[0].tp_tpnr_id,
                    // 用户id
                    tpyhid: this.$route.query.userId
                }
                saveVoteResult(data).then(res=>{
                    if (res.data.success) {
                        // 人员类
                        if (nextData[0].tpTplxId == 2) {
                            console.log('人员类下一条数据',nextData)
                            let path = this.$router.history.current.path;
                             this.titleInfo = nextData[0];
                            this.$router.push({
                                path,
                                query: {
                                    cid: nextData[0].id,
                                    userId: localStorage.getItem('userId'),
                                    sbm: localStorage.getItem('sbm'),
                                    sx_id: localStorage.getItem('sx_id')
                                }
                            });
                            this.onaxios();
                        } else { 
                            // 报告类
                            this.$router.push({
                                path: '/article-vote',
                                query: {
                                    cid: nextData[0].id,
                                    userId: localStorage.getItem('userId'),
                                    sbm: localStorage.getItem('sbm'),
                                    sx_id: localStorage.getItem('sx_id')
                                }
                            });
                        }
                    }
                })
                
            },
            // 保存
            saveInfo(){
                console.log(this.voteList)
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
                    tpyhid: this.$route.query.userId
                }
                saveVoteResult(data).then(res=>{
                    if (res.data.success) {
                        this.onaxios();
                        this.$toast.success('保存成功');
                    } else {
                        this.$toast.fail(res.data.message);
                    }
                })
            },
            nextStep(){
                let nextData = this.nextData[0];
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
                    this.$router.push({
                        path: '/article-vote',
                        query: {
                            userId: this.$route.query.userId,
                            cid: nextData.id,
                            sbm: localStorage.getItem('sbm'),
                            sx_id: this.$route.query.sx_id
                        }
                    });
                }
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
    overflow-y: scroll;
    .title {
        padding: 0 .3rem;
        display: flex;
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