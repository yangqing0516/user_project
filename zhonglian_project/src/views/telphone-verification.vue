<template>
    <!-- 手机号验证 -->
    <div class="telphone-verification wrapper">
        <!-- 投票识别码验证 -->
        <div class="identification-code-verification" @click="onVote">
            <span>投票识别码验证</span>
            <img src="../assets/next.png" alt="" />
        </div>
        <!-- 手机号验证 -->
        <div class="tel-verification"><h2>手机号验证</h2></div>
        <div class="form">
            <van-form @submit="onSubmit">
                <!-- 通过 pattern 进行正则校验 -->
                <van-field
                    clearable
                    v-model="telphone"
                    maxlength="11"
                    type="tel"
                    placeholder="请输入手机号"
                    name="pattern"
                    :rules="[{ pattern, message: '请填写正确的手机号码!' }]"
                />
                <van-field
                    v-model="imgCode"
                    center
                    clearable
                    maxlength="4"
                    placeholder="请输入图片验证码"
                >
                    <template #button>
                        <span @click.prevent="getImgCode">
                            <img :src="imgCodeInfo.result" alt="">
                        </span>
                    </template>
                </van-field>
                <van-field
                    v-model="verCode"
                    center
                    clearable
                    type="number"
                    maxlength="4"
                    placeholder="请输入短信验证码"
                >
                    <template #button>
                        <van-button 
                            v-if="show"
                            @click.prevent="getCode"
                            :disabled="isCode"
                            native-type="button"
                            color="#E1362E" 
                            size="small" 
                            type="info"
                        >获取验证码</van-button>
                        <van-button v-if="!show" size="small" type="info" disabled color="#D8D8D8" class="countActive">{{count}} s</van-button>
                    </template>
                </van-field>
                <div style="margin-top: .7rem;" class="btn">
                    <van-button round :disabled="isVerification" block type="info" color="#E1362E" native-type="submit">验证</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
import {  getImgCodeApi, getVerCode, mobileVerification, userList } from '@/api/index';
export default {
    name: 'telphoneVerification',
    data() {
        return {
            telphone: '',
            verCode: "",
            imgCode: "",
            show: true,
            count: '',
            timer: null,
            isCode: true,
            isVerification: true,
            pattern: /^1[3456789]\d{9}$/,
            imgCodeInfo: {},
            userInfo: {}
        };
    },
    watch: {
        // 手机号
        // telphone(val) {
        //     if (this.pattern.test(val)) {
        //         // this.isCode = false;
        //     }
        // },
        // 图文码
        imgCode(val){
            if (this.pattern.test(this.telphone)&&val.length==4) {
                this.isCode = false;
            }
        },
        // 短信验证码
        verCode(val) {
            if (val.length == '4') {
                this.isVerification = false;
            }
        }
    },
    mounted() {
        this.getImgCode();
        this.onaxios();
    },
    methods: {
        onaxios(){
            let data = {
                sbm: localStorage.getItem('sbm'),
                sx_id: this.$route.query.id,
            }
            userList(data).then(res=>{
                let data = res.data;
                if (data.code == 200) {
                    this.userInfo = data.result;
                }
            })
        },
        // 验证
        onSubmit(values) {
            let data = {
                SJH: this.telphone,
                YZM: this.verCode,
                sx_id: localStorage.getItem('sx_id')
            }
            mobileVerification(data).then(res=>{
                let result = res.data;
                // console.log(result)
                if (result.success) {
                    localStorage.setItem('userId', result.result.id);
                    this.$router.push({
                        path:'/sign-in',
                        query: {
                            id: localStorage.getItem('sx_id'),
                            userId: result.result.id
                        }
                    });
                } else {
                    this.$toast.fail(result.message);
                }
            })
        },
        // 获取验证码
        getCode(){
            if(!this.show) return;
            let data = {
                SJH: this.telphone,
                YZM: this.imgCode,
            }

            getVerCode(data).then(res=>{
                let data = res.data;
                if (data.success) {
                    this.show  = false;
                    this.isCode = true;
                    this.timeDown();
                } else {
                    this.$toast.fail(data.message);
                }
            })
            
        },
        // 获取图片验证码
        getImgCode(){
            getImgCodeApi().then(res=>{
                let data = res.data;
                if (data.success) {
                   this.imgCodeInfo = data;
                }
            })
        },
        // 进入投票识别码验证
        onVote(){
            this.$router.push({
                path: '/vote-verification',
                query: {
                    id: this.$route.query.id
                }
            })
        },
        timeDown(){
            const TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.show = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000)
            }
        }
    }
};
</script>
<style lang='scss'>
.telphone-verification {
    .van-field__control {
        font-size: .32rem!important;
    }
}
</style>
<style scoped lang="scss">
.telphone-verification {
    .identification-code-verification {
        margin-top: 0.6rem;
        margin-right: 0.32rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        span {
            color: #e1362e;
            font-size: 0.32rem;
            font-weight: 400;
            line-height: 0.45rem;
        }
        img {
            width: 0.28rem;
            height: 0.3rem;
            margin-left: 0.13rem;
        }
    }
    .tel-verification {
        margin-top: 0.89rem;
        h2 {
            font-size: 0.62rem;
            font-weight: 500;
            color: #111111;
            line-height: 0.87rem;
            margin-left: 0.5rem;
        }
    }
    .form {
        margin-top: .5rem;
        .van-form {
            .van-cell {
                padding: .2rem .5rem;
                color: #888888;
                font-size: 0.32rem;
                line-height: inherit;
            }
            .van-cell::after{
                border-bottom: .02rem solid #E6E6E6;
                left: .5rem;
                right: .5rem;
            }
            .van-field__button {
                padding-left: 0;
                .van-button {
                    height: .6rem;
                    width: 2.47rem;
                    /* background: #E1362E; */
                    border-radius: .3rem;
                    .van-button__content {
                        span {
                            font-size: .32rem;
                        }
                    }
                }
            }
            .van-count-down {
                position: relative;
                span {
                    position: absolute;
                    right: .5rem;
                    top: .2rem;
                    font-size: .32rem;
                    height: .6rem;
                    line-height: .6rem;
                    width: 2.47rem;
                    background: #D8D8D8;
                    border-radius: .3rem;
                }
            }
            .btn {
                button {
                    margin: 0 auto;
                    width: 6.5rem;
                    height: 0.8rem;
                    /* background: #D8D8D8; */
                    .van-button__content {
                        span {
                            font-size: .32rem;
                            color: #FFFFFF;
                            font-weight: 400;
                        }
                    }
                }
            }

        }
    }
}
</style>
