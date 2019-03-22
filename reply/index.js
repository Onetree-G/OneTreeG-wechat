//中间件函数模块

const sha1 = require('sha1');
const { getUserDataAsync, parseXMLData, formatJsData } = require('../utils/tools');
const template = require('./template');
const handleResponse = require('./handle-response');

module.exports = () => {

  return async (req, res) => {

    console.log(req.query);

    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'OneTreeG'
    const sha1Str = sha1([token, timestamp, nonce].sort().join(''));

    if (req.method === 'GET') {
      //3)开发者获得加密后的字符串可以于signature对比,标识该请求来自微信.
      if (sha1Str === signature) {
        //  该消息来自微信服务器
        res.end(echostr);
      } else {
        //  该消息不是来自微信服务器
        res.end('error');
      }
    } else if (req.method === 'POST') {
      //过滤不是微信服务器发送过来的消息
      if (sha1Str !== signature) {
        res.end('error');
        return;

      }
      //获取用户发送的信息
      const xmlData = await getUserDataAsync(req);
      //将xml文件转换为JS对象
      const jsData = parseXMLData(xmlData);
      //格式化jsData
      const userData = formatJsData(jsData);
      //处理用户发送的消息
      const options = handleResponse(userData);
      //定义回复用户消息的六种模式
      const replyMessage = template(options);
      //查看打印结果
      console.log(replyMessage);
      //返回响应
      res.send(replyMessage);

    } else {
      res.end('error');
    }
  }
}