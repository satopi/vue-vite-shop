import { IRecord } from '@/components/Record/typing';
import { IRole } from '@/pages/System/Role/typing';
import { IPower, IUserInfo } from '@/typings';
import '@/utils/jsExtend';

// 用户信息
export const userInfo: IUserInfo = {
  id: 1000,
  account: 'wxyihkhk33',
  mobile: 13569852641,
  role: '系统管理员',
  roleKey: 1,
  power: '[1000][1001][1002][1003][1004][1005]',
  nickName: '萧策安',
  headImgUrl: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  creator: '沈兰舟',
  creatorAccount: '33khkhiyxw',
  date: new Date().format('yyyy-MM-dd')
};

// 角色列表
export const roleList: Array<IRole> = [
  {
    id: 1,
    name: '系统管理员',
    description: '维护平台运行',
    power: ['1000', '1001', '1002', '1003', '1004', '1005'],
    creator: '程敏',
    account: 'wdwwde56dc',
    date: '2021-09-04'
  },
  {
    id: 2,
    name: '商家',
    description: '管理店铺',
    power: ['1000', '1002', '1003'],
    creator: '吴秀兰',
    account: 'dfds5434k5',
    date: '2021-09-04'
  },
  {
    id: 3,
    name: '财务员',
    description: '清算平台收支',
    power: ['1000', '1003'],
    creator: '邹超',
    account: 'asd4235656',
    date: '2021-09-04'
  },
  {
    id: 4,
    name: '审核员',
    description: '审核商家入驻、商品上新',
    power: ['1000', '1001'],
    creator: '侯杰',
    account: 'gfg5745c5v',
    date: '2021-09-04'
  }
];

// 权限列表
export const powerList: Array<IPower> = [
  {
    id: '1000-1',
    label: '首页',
    disabled: false,
    children: [
      { id: '1000', label: '系统管理员', disabled: false },
      { id: '1006', label: '商家', disabled: false }
    ]
  },
  { id: '1001', label: '商家管理', disabled: false },
  { id: '1002', label: '店铺管理', disabled: false },
  { id: '1003', label: '订单管理', disabled: false },
  {
    id: '1004-1',
    label: '系统管理',
    disabled: false,
    children: [
      { id: '1004', label: '账号管理', disabled: false },
      { id: '1005', label: '角色管理', disabled: false }
    ]
  }
];

// 经营范围
export const businessRange: string[] = [
  '互联网科技',
  '医疗器械',
  '本地生活',
  '广告文化',
  '游戏',
  '餐饮',
  '金融服务',
  '商贸',
  '电影休闲娱乐',
  '职业人才中介',
  '建筑',
  '旅游',
  '教育'
];

// 商家管理流程
export const businessState: string[] = ['已入驻', '已撤离', '待审核', '已驳回'];

// 操作记录列表
export const recordList: IRecord[] = [];
