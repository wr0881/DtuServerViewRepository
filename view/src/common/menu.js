import { isUrl } from '../utils/utils';

const menuData = [
  // {
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'analysis',
  //     },
  //   ],
  // },
  {
    name: '测试',
    icon: 'area-chart',
    path: 'monitor',
    children: [
      {
        name: '测试子集',
        path: 'test',
      },
    ],
  },
  // {
  //   name: '数据查询',
  //   icon: 'hdd',
  //   path: 'mydata',
  //   children: [
  //     {
  //       name: '自动监测数据查询',
  //       path: 'moni-data',
  //     },
  //   ],
  // },
  // {
  //   name: '数据修改',
  //   icon: 'form',
  //   path: 'updata',
  //   children: [
  //     {
  //       name: '修改第一次数据',
  //       path: 'upfirst-data',
  //     },
  //   ],
  // },
  // {
  //   name: '手机App',
  //   icon: 'android',
  //   path: 'app',
  //   children: [
  //     {
  //       name: '手机轮播图上传',
  //       path: 'uploadPhonePicture',
  //     },
  //     {
  //       name: '测试专用',
  //       path: 'test',
  //     },
  //   ],
  // },
  // {
  //   name: '手机App',
  //   icon: 'android',
  //   path: 'app',
  //   children: [
  //     {
  //       name: '手机轮播图上传',
  //       path: 'uploadPhonePicture',
  //     },
  //   ],
  // },
  // {
  //   name: '终端绑定',
  //   icon: 'api',
  //   path: 'binding',
  //   children: [
  //     {
  //       name: '珠海终端绑定',
  //       path: 'zhuhaibinding',
  //     },
  //   ],
  // },
  // {
  //   name: '图片设置',
  //   icon: 'picture',
  //   path: 'imagesetting',
  //   children: [
  //     {
  //       name: '布点图点位设置',
  //       path: 'pointmap',
  //     },
  //   ],
  // },
  // {
  //   name: '资源上传',
  //   icon: 'upload',
  //   path: 'upload',
  //   children: [
  //     {
  //       name: '图片上传',
  //       path: 'imageupload',
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
