//工具函数模块
const { parseString } = require('xml2js');

module.exports = {
    //获取用户发送过来的消息
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', data => {
                    xmlData += data.toString();
                })
                .on('end', () => {
                    resolve(xmlData);
                })
        })
    },
    //将消息格式转换为JS对象
    parseXMLData(xmlData) {
        let jsData = null;
        parseString(xmlData, { trim: true }, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })
        return jsData;
    },
    formatJsData(jsData) {
        const { xml } = jsData;
        const userData = {};
        for (let key in xml) {
            const value = xml[key];
            userData[key] = value[0];
        }
        return userData;
    }
}