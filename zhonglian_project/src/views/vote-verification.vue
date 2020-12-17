<template>
    <div class="vote-verification wrapper">
        <!-- 手机号码验证 -->
        <div class="identification-code-verification" @click="onTel">
            <span>手机号码验证</span>
            <img src="../assets/next.png" alt="" />
        </div>
        <!-- 投票识别码验证 -->
        <div class="tel-verification"><h2>投票识别码验证</h2></div>
        <div class="form">
            <van-form @submit="onSubmit">
                <!-- 通过 pattern 进行正则校验 -->
                <van-field
                    clearable
                    v-model="code"
                    maxlength="6"
                    type="number"
                    placeholder="请输入投票识别码"
                    :rules="[{ required: true, message: '请填写您的投票识别码！' }]"
                />
                <div style="margin-top: 1.95rem;" class="btn">
                    <van-button round block type="info" :disabled="isDisable" color="#E1362E" native-type="submit">验证</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
import {  userList } from '@/api/index';
export default {
    name: "voteVerification",
    data(){
        return {
            code: '',
            isDisable: true,
            userInfo: {}
        }
    },
    watch: {
        code(val) {
            if (val.length=='6') {
                this.isDisable = false;
            }
        }
    },
    methods: {
        onSubmit(values) {
            let data = {
                sbm: this.code,
                sx_id: localStorage.getItem('sx_id'),
            }
            userList(data).then(res=>{
                let data = res.data;
                if (data.code == 200) {
                    if (data.success) {
                        localStorage.setItem('userId', data.result.id);
                        localStorage.setItem('sbm', data.result.tpyhSbm)
                        this.$router.push({
                            path: "/sign-in",
                            // query: {
                            //     tpyhQd: data.result.tpyhQd
                            // }
                        })
                    }
                }
            })
        },
        // 进入手机号验证
        onTel(){
            this.$router.push('/telphone-verification')
        }
    }
}
</script>
<style lang='scss'>
.vote-verification {
    .van-field__control {
        font-size: .32rem!important;
    }  
}   
</style>
<style scoped lang="scss">
.vote-verification {
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
                    background: #E1362E;
                    border-radius: .3rem;
                    .van-button__content {
                        span {
                            font-size: .32rem;
                        }
                    }
                }
            }
            .btn {
                button {
                    margin: 0 auto;
                    width: 6.5rem;
                    height: 0.8rem;
                    background: #D8D8D8;
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