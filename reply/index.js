//中间件函数模块

const sha1 = require('sha1');
const { getUserDataAsync, parseXMLData, formatJsData } = require('../utils/tools');

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
      const xmlData = await getUserDataAsync(req);
      const jsData = parseXMLData(xmlData);
      const userData = formatJsData(jsData)
      let content = '可以帮我浇点水吗?';
      if (userData.Content.indexOf('你是谁') !== -1) {
        content = '我是一只树.';
      } else if (userData.Content === '什么树') {
        content = '狗尾巴树.'
      } else if (userData.Content === '浇水') {
        content = '谢谢.'
      } else if (userData.Content === '我是谁') {
        content = '你是我失散多年的亲儿子.'
      } else if (userData.Content === '陈功是谁') {
        content = '即将秃顶的码农.'
      } else if (userData.Content === '儿子') {
        content = '叫谁儿子呐?'
      }else if (userData.Content === '不可以') {
        content = '那你滚吧!'
      }

      const replyMessage = `<xml>
           <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
           <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
           <CreateTime>${Date.now()}</CreateTime>
           <MsgType><![CDATA[text]]></MsgType>;
           <Content><![CDATA[${content}]]></Content>
           </xml>`
      //返回响应
      res.send(replyMessage);
    } else {
      res.end('error');
    }
  }

}
