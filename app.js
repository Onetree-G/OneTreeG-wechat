const express = require('express');
const sha1 = require('sha1')
const app = express();
app.use((req, res) => {
    console.log(req.query)
    // {
    //     signature: 'ba6201f48bdf7abf246b9a0f14dc62ed8702fd0f',微信加密签名
    //         echostr: '4106535107959062270',微信后台生成的随机字符串
    //             timestamp: '1552996088', 微信后台发送请求的时间戳
    //                 nonce: '1859815505'微信后台生成的随机数字
    // }
    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'OneTreeG'
    //1)将signature,echostr,timestamp,nonce,token字典排序
    const sortedArr = [token, timestamp, nonce].sort();
    console.log(sortedArr);
    //2)将字符串进行拼接sha1加密
    const sha1Str = sha1(sortedArr.join(''));
    console.log(sha1Str)
    //3)开发者获得加密后的字符串可以于signature对比,标识该请求来自微信.
    if (sha1Str === signature) {
        //  该消息来自微信服务器
        res.end(echostr);
    }else{
        //  该消息不是来自微信服务器
        res.end('error');
    }

});
app.listen(4000, err => {
    if (!err) console.log('服务器连接成功');
    else console.log('网络加载超时~');
});