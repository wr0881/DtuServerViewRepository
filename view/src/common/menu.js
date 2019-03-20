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
    name: '出入库平台',
    icon: 'inbox',
    path: 'library',
    children: [
      {
        name: '传感器仓库',
        path: 'sensorLib',
      },
    ],
  },

  {
    name: '服务管理',
    icon: 'area-chart',
    path: 'server',
    children: [
      {
        name: '有人DTU服务',
        path: 'youren',
      },
      {
        name: '测智终端服务',
        path: 'cezhi',
      },
    ],
  },
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
