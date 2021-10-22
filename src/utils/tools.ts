/**
 * 格式化日期
 * @param obj 数据对象
 */
const formatDate = <T>(obj: T) => {
  if (obj instanceof Array) {
    obj.forEach((item) => formatDate(item));
  } else if (obj instanceof Object) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key.includes('_json')) {
          if (obj[key]) {
            obj[key] = JSON.parse(obj[key as string]);
          } else {
            obj[key as string] = [];
          }
        } else if (typeof obj[key] == 'string' && obj[key as string].includes('/Date(')) {
          obj[key] = obj[key as string].toDate();
          obj[key + '__'] =
            obj[key as string].getFullYear() +
            '-' +
            ('0' + (obj[key as string].getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + obj[key as string].getDate()).slice(-2) +
            ' ' +
            ('0' + obj[key as string].getHours()).slice(-2) +
            ':' +
            ('0' + obj[key as string].getMinutes()).slice(-2);
          obj[key + '_'] = obj[key + '__'].substring(0, 10);
          obj[key + '_M'] = obj[key + '__'].substring(0, 7);
        } else if (obj[key] instanceof Object || obj[key] instanceof Array) {
          formatDate(obj[key]);
        }
      }
    }
  }
};

/**
 * 将[1][2][3]转成数组
 * @param str 需要转换的字符串
 */
const stringToArray = (str: string): Array<string> => {
  if (!str) return [];
  str = str.replace(/\]\[/g, ',');
  str = str.replace(/\]/g, '');
  str = str.replace(/\[/g, '');
  return str.split(',');
};

/**
 * 将数组转[a][b][c]
 * @param arr 需要转换的数组
 */
const arrayToString = <T>(arr: Array<T>): string => {
  const array = arr || [];
  const str = array.join('][');
  return '[' + str + ']';
};

/**
 * 防抖函数
 * @param fn 回调函数
 * @param delayTime 延迟执行毫秒数
 */
const debounce = (fn: Function, delayTime = 300) => {
  let timer: NodeJS.Timeout | null = null;

  return function (this: any, ...args: any) {
    timer && clearTimeout(timer) && (timer = null);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delayTime);
  };
};

/**
 * localStorage操作
 */
const local = {
  set: function (key: string, value: string | number | null | undefined) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  get: function (key: string) {
    const value = window.localStorage.getItem(key);
    if (value == null || value == '""' || value == undefined) {
      return null;
    } else {
      return value;
    }
  },
  remove: function (key: string) {
    window.localStorage.removeItem(key);
  },
  clear: function () {
    window.localStorage.clear();
  }
};

/**
 * sessionStorage操作
 */
const session = {
  set: function (key: string, value: string | number | null | undefined) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  get: function (key: string) {
    const value = window.sessionStorage.getItem(key);
    if (value == null || value == '""' || value == undefined) {
      return null;
    } else {
      return value;
    }
  },
  remove: function (key: string) {
    window.sessionStorage.removeItem(key);
  },
  clear: function () {
    window.sessionStorage.clear();
  }
};

export { formatDate, stringToArray, arrayToString, debounce, local, session };
