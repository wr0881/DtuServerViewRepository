export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 出入库平台
      {
        path: '/in-out-library',
        name: '出入库平台',
        icon: 'yuque',
        routes: [
          {
            path: '/in-out-library/sensor',
            name: '传感器仓库',
            component: './InOutLibrary/index',
          },
        ],
      },
      // 设备管理
      {
        path: '/device',
        name: '设备管理',
        icon: 'inbox',
        routes: [
          {
            path: '/device/device-bind',
            name: '设备绑定',
            component: './Device/DeviceBindList',
          },
        ],
      },
      // 服务管理
      {
        path: '/server',
        name: '服务管理',
        icon: 'cloud-server',
        routes: [
          {
            path: '/server/youren',
            name: '有人DTU服务',
            component: './Server/DtuServer',
          },
          {
            path: '/server/cezhi',
            name: '测智终端服务',
            component: './Server/CzServer',
          },
        ],
      },
      // 数据管理
      {
        path: '/data',
        name: '数据管理',
        icon: 'database',
        routes: [
          {
            path: '/data/querydata',
            name: '数据查询',
            component: './Data/QueryData',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: '表格',
        routes: [
          {
            path: '/list/table-list',
            name: '查询表格',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: '标准列表',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: '卡片列表',
            component: './List/CardList',
          },
          
        ],
      },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/basic/:id',
      //       hideInMenu: true,
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: ['admin'],
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // //  editor
      // {
      //   name: 'editor',
      //   icon: 'highlight',
      //   path: '/editor',
      //   routes: [
      //     {
      //       path: '/editor/flow',
      //       name: 'flow',
      //       component: './Editor/GGEditor/Flow',
      //     },
      //     {
      //       path: '/editor/mind',
      //       name: 'mind',
      //       component: './Editor/GGEditor/Mind',
      //     },
      //     {
      //       path: '/editor/koni',
      //       name: 'koni',
      //       component: './Editor/GGEditor/Koni',
      //     },
      //   ],
      // },
      // {
      //   component: '404',
      // },
    ],
  },
];
