import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/2',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout2.vue'),
    children: [
    ],
  },
  {
    path: '/etree',
    component: () => import('layouts/ExecutionTree.vue'),
    children: [
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
