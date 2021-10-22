//jS对象扩展方法
//  替换字符
String.prototype.replaceAll = function (oldstr, newstr) {
  return this.split(oldstr).join(newstr.toString());
};

//  从字符串中获取数字
String.prototype.GetNumber = function () {
  let newStr = '';
  const _this = String(this);
  for (let i = 0; i < _this.length; i++) {
    if ('0123456789.'.indexOf(_this[i]) != -1) {
      if (_this[i] != '.') {
        newStr += _this[i];
      } else if (newStr.indexOf('.') == -1) {
        newStr += _this[i];
      }
    }
  }
  if (/^\d+\.$/.test(_this)) newStr = _this.substring(0, _this.length - 1);
  if (newStr[0] == '.') newStr = '0' + newStr;
  return Number(newStr);
};

//  从字符串中提取整数，并以数组形式返回结果
String.prototype.ToIntArray = function () {
  const arr: Array<any> = this.match(/\d+/g) || [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(arr[i]);
  }
  return arr;
};

//  从字符串中获取整数
String.prototype.GetInt = function () {
  let newStr = '';
  for (let i = 0; i < this.length; i++) {
    if ('0123456789'.indexOf(this[i]) > -1) newStr += this[i];
  }
  return newStr;
};

//  返回一个布尔值，指示字符串中是否包含目标字符串
String.prototype.contains = function (findStr) {
  return this.indexOf(findStr) != -1;
};

//	将不符合金钱格式的字符去提  例如将: 100xxx.00 变成 100.00
String.prototype.strToMoney = function () {
  return this.replace(/[^0-9.]+/g, '');
};

// 用于金额分段，例如8000=>8,000
String.prototype.priceFormat = function () {
  return this.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, '$&,');
};

//  日期格式化的扩展方法
//  y:年, M:月, d:日, h:时, m:分, s:秒, S:毫秒, q:季, w:周, H:上下午
Date.prototype.format = function (format) {
  format = format || 'yyyy-MM-dd';
  const o = {
    'M+': this.getMonth() + 1, //月
    'd+': this.getDate(), //日
    'H+': this.getHours(), //时
    'h+': this.getHours(), //时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季
    'w+': '日一二三四五六'[this.getDay()],
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));

  for (const k in o)
    if (new RegExp('(' + k + ')').test(format))
      if (k == 'h+') {
        const over12 = o[k] > 12;
        const noon = over12 ? '下午' : '上午';
        if (over12) o[k] = o[k] - 12;

        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? noon + o[k] : noon + ('00' + o[k]).substr(('' + o[k]).length));
      } else {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }

  return format;
};

//时间分钟加减
Date.prototype.addMinute = function (num) {
  this.setMinutes(this.getMinutes() + num);
  return this;
};

//时间小时加减
Date.prototype.addHour = function (num) {
  this.setHours(this.getHours() + num);
  return this;
};

//日期天数加减
Date.prototype.addDay = function (num) {
  this.setHours(this.getHours() + num * 24);
  return this;
};

//日期月份加减
Date.prototype.addMonth = function (num) {
  this.setMonth(this.getMonth() + num);
  return this;
};

//日期年份加减
Date.prototype.addYear = function (num) {
  this.setFullYear(this.getFullYear() + num);
  return this;
};

//四舍五入
Number.prototype.round = function (pos) {
  const pow = Math.pow(10, pos || 0);
  return Math.round(parseInt((this.valueOf() * pow).toFixed(6))) / pow;
};

//判断是否为数字（包含小数）
String.prototype.isNumber = function () {
  //return (/^((\d+\.\d*[1-9]\d*)|(\d*[1-9]\d*\.\d+)|(\d*[1-9]\d*))$/).test(this);
  return !(this == '' || isNaN(parseInt(this.valueOf())));
};

//将yyyy-MM-ddT HH:mm:ss字符串转换为日期对象
String.prototype.StringtoDate = function () {
  if (this) {
    return new Date((this || '').replace('T', ' ').replace(/\.\d+/, ''));
  }
};

//与当前的时间差分钟
Date.prototype.timeDifference = function () {
  if (this) {
    const curTimestamp = new Date().getTime(); //当前时间戳
    const compareTime = this.getTime();
    return (curTimestamp - compareTime) / 1000 / 60; // 参数时间戳与当前时间戳相差秒数
  }
};

//截取两个字符串中间的字符串
String.prototype.substringMiddle = function (beginStr, endStr) {
  if (this) {
    const beginIndex = this.indexOf(beginStr);
    const endIndex = this.indexOf(endStr);
    return this.substring(beginIndex + beginStr.length, endIndex);
  }
};
