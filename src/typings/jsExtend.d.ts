declare global {
  /**
   * jS对象扩展方法
   */
  interface String {
    /** 替换字符 */
    replaceAll(oldstr: string, newstr: string): string;

    /** 从字符串中获取数字 */
    GetNumber: () => Number;

    /** 从字符串中提取整数，并以数组形式返回结果 */
    ToIntArray: () => Array<number>;

    /** 从字符串中获取整数 */
    GetInt: () => string;

    /** 返回一个布尔值，指示字符串中是否包含目标字符串 */
    contains: (findStr: string) => boolean;

    /** 将不符合金钱格式的字符去提  例如将: 100xxx.00 变成 100.00 */
    strToMoney: () => string;

    /** 用于金额分段，例如8000=>8,000 */
    priceFormat: () => string;

    /** 判断是否为数字（包含小数） */
    isNumber: () => boolean;

    /** 将yyyy-MM-ddT HH:mm:ss字符串转换为日期对象 */
    StringtoDate: () => Date | undefined;

    /** 截取两个字符串中间的字符串 */
    substringMiddle: (beginStr: string, endStr: string) => string | undefined;
  }
  interface Date {
    /** 日期格式化的扩展方法 */
    format: (format: string) => string;

    /** 时间分钟加减 */
    addMinute: (num: number) => Date;

    /** 时间小时加减 */
    addHour: (num: number) => Date;

    /** 日期天数加减 */
    addDay: (num: number) => Date;

    /** 日期月份加减 */
    addMonth: (num: number) => Date;

    /** 日期年份加减 */
    addYear: (num: number) => Date;

    /** 与当前的时间差分钟 */
    timeDifference: () => number | undefined;
  }
  interface Number {
    /** 四舍五入 */
    round: (pos: number) => Number;
  }
}
export {};
