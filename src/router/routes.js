const routes = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/objectives',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ObjectivesPage.vue') }],
  },
  {
    path: '/chatbot',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ChatBotPage.vue') }],
  },
  {
    path: '/more',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MorePage.vue') }],
  },
  {
    path: '/sub',
    children: [{ path: '', component: () => import('pages/SubPage.vue') }],
  },
  {
    path: '/',
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
