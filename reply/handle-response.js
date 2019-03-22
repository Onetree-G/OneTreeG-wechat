//处理用户发送的消息

module.exports = (userData) => {
  //自动回复
  let options = {
    toUserName: userData.FromUserName,
    fromUserName: userData.ToUserName,
    createTime: Date.now(),
    type: 'text',
    content: '今天又是充满希望的一天'
  }
  //用户发送的是文本消息
  if (userData.MsgType === 'text') {
    if (userData.Content === '你是谁') {
      options.content = '我是一只树'
    }
    else if (userData.Content === '我是谁') {
      options.content = '你是我失散多年的亲儿子'
    }
  }
  //用户发送的是语音消息(将语音识别结果返回给用户[需要开通才能生效])
  else if (userData.MsgType === 'voice') {
    options.content = userData.Recognition;
  }
  //用户发送的是地理位置
  else if (userData.MsgType === 'location') {
    options.content =
      `地理位置纬度:${userData.Location_X}
    \n地理位置经度:${userData.Location_Y}
    \n地图缩放大小:${userData.Scale}
    \n地理位置信息:${userData.Label}`;
  }
  return options;
}