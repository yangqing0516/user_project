import Vue from 'vue'
import Router from 'vue-router'
// import EntryPage from '@/views/entry-page'

Vue.use(Router)

export default new Router({
    routes: [
        // 入口
        {
            path: '/',
            name: 'EntryPage',
            component: ()=>import('@/views/entry-page')
        },
        // 手机号验证
        {
            path: '/telphone-verification',
            name: 'TelphoneVerification',
            component: ()=>import('@/views/telphone-verification')
        },
        // 投票识别码验证
        {
            path: '/vote-verification',
            name: 'VoteVerification',
            component: ()=>import('@/views/vote-verification')
        },
        // 签到
        {
            path: "/sign-in",
            name: 'SignIn',
            component: ()=>import('@/views/sign-in')
        },
        // 投票---》文章投票
        {
            path: "/article-vote",
            name: 'ArticleVote',
            component: ()=>import('@/views/article-vote')
        },
        // 投票---》人员投票
        {
            path: "/person-vote",
            name: 'PersonVote',
            component: ()=>import('@/views/person-vote')
        },
        {
            path: "/preview-pdf",
            name: 'previewPdf',
            component: ()=>import('@/views/preview-pdf')
        },
    ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
