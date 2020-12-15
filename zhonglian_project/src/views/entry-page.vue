<template>
    <!-- 主页 -->
    <div class="entry-page wrapper">
        <div class="top-content">
            <img class="home-logo" src="../assets/home_logo.png" alt="">
            <div class="title">中电联在线投票管理系统</div>
            <!-- <h2>中电联第七次会员代表大会预备会议</h2>
            <p>中电联第七次会员代表大会预备会议中电联第七次会员代表大会预备会议中电联第七次会员代表大会</p> -->
            <h2>{{enterInfo.tpsxMc}}</h2>
            <p>{{enterInfo.tpsxBz}}</p>
        </div>
        <div class="bottom-content">
            <div class="vote-time">投票时间：{{enterInfo.tpsxKssj&&enterInfo.tpsxKssj.slice(0,10)}}至{{enterInfo.tpsxJzsj&&enterInfo.tpsxJzsj.slice(0,10)}}</div>
            <div class="vote-status">
                <ul>
                    <li v-for="(item, index) in voteStatus" :key="index" :class="item.isActive?'statusActive':''">
                        <div class="status">
                            <p>
                                <img :src="item.imgUrl" alt="">
                            </p>
                            <div class="line" v-if="index!=2"></div>
                        </div>
                        <span>{{item.status}}</span>
                    </li>
                </ul>
            </div>
            <div class="enter">
                <button @click="enterNow">立即进入</button>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    getEnterInfo
} from '@/api/index';
export default {
    name: "entryPage",
    components: {},
    data(){
        return {
            voteStatus: [{
                status: "未开始",
                imgUrl: require('../assets/not_start.png'),
                isActive: false
            },{
                status: "进行中",
                imgUrl: require('../assets/pending.png'),
                isActive: false
            },{
                status: "已结束",
                imgUrl: require('../assets/finished.png'),
                isActive: false
            }],
            enterInfo: {}
        }
    },
    mounted(){
        let url = window.location.href;
        console.log('url地址----', url)
        let id = url.split("sx_id=")[1];
        console.log('事项id-----', id)
        localStorage.setItem('sx_id', id)
        // localStorage.setItem('sx_id', "1333344778143465474")
        this.onaxios();
    },
    methods: {
        onaxios(){
            let data = {
                id: localStorage.getItem('sx_id')
            }
            // console.log('参数--',data)
            getEnterInfo(data).then(res=>{
                // console.log('接收请求--',res)
                let data = res.data;
                // console.log('具体参数--',data)
                if (data.code == 200) {
                    this.enterInfo = data.result;
                    // 模拟未开始
                    // let nowTime = '2020-1-06 13:56:07';
                    // 进行中
                    let nowTime = this.format(new Date());
                    // 模拟已结束
                    // let nowTime = '2021-10-06 13:56:07';
                    let startTime = this.enterInfo.tpsxKssj;
                    let endTime = this.enterInfo.tpsxJzsj;
                    if (nowTime>startTime && nowTime<endTime) {
                        this.voteStatus[1].isActive = true;
                    } else if (nowTime>startTime&&nowTime>endTime){
                        this.voteStatus[2].isActive = true;
                    } else {
                        this.voteStatus[0].isActive = true;
                    }
                }
            })
        },
        // 立即进入
        enterNow(){
            this.$router.push({
                path: '/telphone-verification',
                query: {
                    id: localStorage.getItem('sx_id')
                }
            })
        },
        // 时间格式化
        add0(m) {
            return m < 10 ? "0" + m : m;
        },
        // 时间格式化
        format(shijianchuo) {
            //时间戳是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + "-" + this.add0(m) + "-" + this.add0(d) +" "+this.add0(h)+":"+this.add0(mm)+":"+this.add0(s);
        }
    }
}
</script>

<style scoped lang="scss">
    .entry-page {
        position: relative;
        background: url(../assets/home_bg.png) no-repeat;
        background-size: 100% 100%;
        .top-content {
            .home-logo {
                width: 5.71rem;
                height: 1.37rem;
                display: block;
                margin: 1.14rem auto 0;
            }
            .title {
                font-size: 0.5rem;
                color: #333333;
                font-weight: 500;
                margin-top: .38rem;
                text-align: center;
            }
            h2 {
                font-size: 0.36rem;
                font-weight: 500;
                color: #E1362E;
                line-height: 0.29rem;
                text-align: center;
                margin-top: .91rem;
            }

            p {
                width: 5.73rem;
                text-align: center;
                margin-top: .3rem;
                margin: .3rem auto 0;
                color: #333333;
                font-size: 0.24rem;
                line-height: 0.36rem;
                font-weight: 400;
            }
        }
        .bottom-content {
            position: absolute;
            bottom: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .vote-time {
                font-size: 0.26rem;
                font-weight: 500;
                color: #E1362E;
                line-height: 0.29rem;
            }
            .vote-status {
                margin-top: .23rem;
                ul {
                    display: flex;
                    li {
                        .status {
                            display: flex;
                            align-items: center;
                            p {
                                width: 0.78rem;
                                height: 0.78rem;
                                background: #666666;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                img {
                                    width: .43rem;
                                    height: .44rem;
                                }
                            }
                            .line {
                                width: 1.01rem;
                                height: 0.03rem;
                                background: #666666;
                                margin: 0 .26rem;
                            }
                        }
                        span {
                            color: #343434;
                            font-size: 0.28rem;
                            font-weight: 400;
                            margin-top: .23rem;
                            display: inline-block;
                        }
                        &.statusActive {
                            p {
                                background: #E1362E;
                            }
                            span {
                                color: #E1362E;
                            }
                        }
                    }
                }
            }
            .enter {
                margin-top: .52rem;
                margin-bottom: .98rem;
                button {
                    width: 5.88rem;
                    height: 0.84rem;
                    background: #E1362E;
                    border-radius: 0.4rem;
                    font-size: 0.36rem;
                    color: #FFFFFF;
                    font-weight: 500;
                }
            }
        }
        
    }
</style>