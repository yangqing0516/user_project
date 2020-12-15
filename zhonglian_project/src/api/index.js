import request from '@/utils/request';

// 1、入口页面接口
export function getEnterInfo(params) {
    return request({
        url:'/tp/tpTpsx/queryById',
        method:'get',
        params: params
    })
}


// 2、投票识别码验证登录
export function userList(params) {
    return request({
        url: '/tp/tpTpyh/userLoginBySbm',
        method: 'get',
        params: params
    })
}

// 3、根据事项获取所有内容状态接口（get）
export function getContentStatus(params) {
    return request({
        url:'/tp/tpTpsx/queryBysx_id',
        method:'get',
        params: params
    })
}

// 4、根据内容id获取内容（人员类）(get) + 用户id
export function getContentPerson(params) {
    return request({
        url:'/tp/tpTpnrRy/queryByNyId',
        method:'get',
        params: params
    })
}

// 5、根据内容id获取内容（报告类）(get) + 用户id
export function getContentReport(params) {
    return request({
        url:'/tp/tpTpnrBg/queryByNyId',
        method:'get',
        params: params
    })
}

// 6、签到接口
export function userSignIn(params) {
    return request({
        url:'/tp/tpTpyh/userSignIn',
        method:'get',
        params: params
    })
}

// 7、获取图片验证码
export function getImgCodeApi(params) {
    return request({
        url:'/sys/randomImage/1A2B3C',
        method:'get',
        params: params
    })
}


// 8、获取短信验证码
export function getVerCode(params) {
    return request({
        url:'/tp/tpTpyh/getLoginYzm',
        method:'get',
        params: params
    })
}

// 9、手机号码验证
export function mobileVerification(params) {
    return request({
        url: '/tp/tpTpyh/userLoginByYzm',
        method: 'get',
        params:  params
    })
}


//10、保存投票结果(人员类)
export function saveVoteResult(params) {
    return request({
        url: '/tp/tpTpjgRy/tpnrrybc',
        method: 'post',
        params
    })
}

// 11、提交投票结果(人员类)
export function submitVoteResult(params) {
    return request({
        url: '/tp/tpTpjgRy/tpnrrytj',
        method: 'post',
        params
    })
}

// 12、保存投票内容(报告类)
export function voteSave(params) {
    return request({
        url: '/tp/tpTpjgBg/tpnrbgbc',
        method: 'post',
        params
    })
}

// 13、提交投票内容(报告类)
export function submitVoteContent(params) {
    return request({
        url: '/tp/tpTpjgBg/tpnrbgtj',
        method: 'post',
        params
    })
}

// 14、一键提交
export function submitAll(params) {
    return request({
        url: '/tp/tpTpyhTpsxzt/alltj',
        method: 'get',
        params
    })
}

// 附件访问
export function viewFile(params) {
    return request({
        url: `/sys/common/static/${params.file}`,
        method: 'get'
    })
}