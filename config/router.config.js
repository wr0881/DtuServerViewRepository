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
          {
            path: '/in-out-library/terminal',
            name: '终端仓库',
            component: './InOutLibrary/Terminal',
          }
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
      // 项目管理
      {
        path: '/project',
        name: '项目管理',
        icon: 'yuque',
        routes: [
          {
            path: '/project/add-project',
            name: '新建项目',
            component: './Project/AddProject/AddProject',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/project/add-project',
                redirect: '/project/add-project/add-project-name',
              },
              {
                path: '/project/add-project/add-project-name',
                name: '新建项目名',
                component: './Project/AddProject/AddProjectName',
              },
              {
                path: '/project/add-project/add-sector-name',
                name: '新建区间名',
                component: './Project/AddProject/AddSectorName',
              },
              {
                path: '/project/add-project/add-member-info',
                name: '添加人员信息',
                component: './Project/AddProject/AddMemberInfo',
              },
              {
                path: '/project/add-project/add-sector-info',
                name: '新建区间信息',
                component: './Project/AddProject/AddSectorInfo',
              },
              {
                path: '/project/add-project/result',
                name: '新建成功',
                component: './Project/AddProject/Result',
              },
            ],
          },
          {
            path: '/project/selectSector',
            name: '区间管理',
            component: './Project/EditSector/SelectSector',
            hideChildrenInMenu: true,
          },
          {
            path: '/project/editSector',
            name: '区间管理',
            component: './Project/EditSector/EditSelectorWrapper',
            hideChildrenInMenu: true,
            hideInMenu: true,
            routes: [
              {
                path: '/project/editSector',
                redirect: '/project/editSector/bindMember',
              },
              {
                path: '/project/editSector/bindMember',
                name: '绑定人员信息',
                component: './Project/EditSector/BindMember',
              },
              {
                path: '/project/editSector/bindImg',
                name: '绑定图片信息',
                component: './Project/EditSector/BindImg',
              },
              {
                path: '/project/editSector/bindMonitorBasis',
                name: '绑定监测依据',
                component: './Project/EditSector/BindMonitorBasis',
              },
              {
                path: '/project/editSector/bindPoint',
                name: '绑定测点',
                component: './Project/EditSector/BindPoint',
              },
            ],
          },
          {
            path: '/project/memberinfo',
            name: '人员管理',
            component: './Project/MemberInfo/MemberInfo',
          },
          {
            path: '/project/userinfo',
            name: '用户管理',
            component: './Project/UserInfo/UserInfo',
          },
          {
            path: '/project/monitorbasis',
            name: '监测依据',
            component: './Project/MonitorBasis/MonitorBasis',
          },
          // {
          //   path: '/project/selectSector',
          //   name: '区间管理',
          //   component: './Project/EditSector/SelectSector',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/project/selectSector/editSector/',
          //       name: '编辑区间',
          //       component: './Project/EditSector/EditSelectorWrapper',
          //       routes: [
          //         {
          //           path: '/project/selectSector/editSector',
          //           redirect: '/project/selectSector/editSector/bindMember',
          //         },
          //         {
          //           path: '/project/selectSector/editSector/bindMember',
          //           name: '绑定人员信息',
          //           component: './Project/EditSector/BindMember',
          //         },
          //         {
          //           path: '/project/selectSector/editSector/bindImg',
          //           name: '绑定图片信息',
          //           component: './Project/EditSector/BindImg',
          //         },
          //         {
          //           path: '/project/selectSector/editSector/bindMonitorBasis',
          //           name: '绑定监测依据',
          //           component: './Project/EditSector/BindMonitorBasis',
          //         },
          //         {
          //           path: '/project/selectSector/editSector/bindPoint',
          //           name: '绑定测点',
          //           component: './Project/EditSector/BindPoint',
          //         },
          //       ],
          //     }
          //   ],
          // },
        ],
      },
      // // dashboard
      // { path: '/', redirect: '/in-out-library/sensor', authority: ['admin', 'user'] },
      // { path: '/', redirect: '/in-out-library/sensor' },
      { path: '/', redirect: '/user/login' },
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: 'dashboard',
      //   routes: [
      //     {
      //       path: '/dashboard/analysis',
      //       name: 'analysis',
      //       component: './Dashboard/Analysis',
      //     },
      //     {
      //       path: '/dashboard/monitor',
      //       name: 'monitor',
      //       component: './Dashboard/Monitor',
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'workplace',
      //       component: './Dashboard/Workplace',
      //     },
      //   ],
      // },
      // // forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
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
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
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
      {
        component: '404',
      },
    ],
  },
];
