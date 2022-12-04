const http = require('http')
const axios = require('axios')
const config = require('./config');


async function login() {
    let res = (await doPost('/signin/login', { username: config.username, password: config.password }));
    config.token=res.token;
    config.id=res.id;
}
async function getUsername(user_id){
    let res=(await doGet('/user/get_username',{user_id}));
    return res.name;
}
async function user_info(user_id){
    let res=(await doGet('/class/stu_info',{user_id}));
    return res;
}
async function reg_lists(contest_id){
    let res=(await doGet('/contest/reg_list',{contest_id:contest_id}));
    return res.data;
}
async function print_contest_reg_lists(contest_id){
    let data=await reg_lists(contest_id);
    let arr=[];
    for(let item of data)
    {
        let res=await user_info(item.usr_id);
        let username=await getUsername(item.usr_id);
        console.log(res.real_name);
        arr.push({username:username,'学号':res.sid,'班级':res.class_name,'姓名':res.real_name})
    }
    console.table(arr);
}
async function doGet(url,params){
    let res = (await axios({
        headers: {
            authorization: config.token
        },
        url: url,
        params: params,
        baseURL: config.baseUrl,
        method: 'get',
    })).data;
    return res;
}
async function doPost(url, body) {

    if (config.token) {
        let res = (await axios({
            headers: {
                authorization: config.token
            },
            url: url,
            data: body,
            baseURL: config.baseUrl,
            method: 'post',
        })).data;
        return res.data;
    }
    else {
        let res = (await axios({
            url: url,
            data: body,
            baseURL: config.baseUrl,
            method: 'post',
        })).data;
        return res.data;
    }
}

async function main() {
    await login();
    // console.log(await getUsername(20));
    // console.log(await user_info(20));
    await print_contest_reg_lists(106);
    // console.log(await getUsername(139));
    // console.log(await user_info(139));
    // console.log(await reg_lists(106));
    
}
main().then(function(){

})