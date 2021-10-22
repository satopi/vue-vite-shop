//手机号验证
export const checkPhone = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
    callback();
  } else {
    return callback(new Error('请输入正确的手机号'));
  }
};
