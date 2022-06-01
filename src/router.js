import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard.vue';

Vue.use(Router);

// Check if user is authenticated or redirect to login page
const isUserAuthenticated = (to, from, next) => {
  // TODO: Validate JWT
  if (localStorage.getItem('jwt') !== null) {
    next();
    return;
  }
  next('/login');
};

// Check if user is not authenticated or redirect to dashboard
const isUserNotAuthenticated = (to, from, next) => {
  if (localStorage.getItem('jwt') === null) {
    next();
    return;
  }
  next('/');
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'Dashboard' },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/Auth/Login.vue'),
      beforeEnter: isUserNotAuthenticated,
    },
    {
      path: '/connector',
      name: 'Connector',
      component: () => import('./views/Connector/Connector.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/brokers',
      name: 'Brokers',
      component: () => import('./views/Brokers/Brokers.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings/Settings.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/dataassets',
      name: 'DataAssets',
      component: () => import('./views/DataAsset/DataAssets.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/dataassets/:id',
      name: 'DataAsset',
      component: () => import('./views/DataAsset/DataAsset.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/job',
      name: 'Jobs',
      component: () => import('./views/Job/Jobs.vue'),
      beforeEnter: isUserAuthenticated,
    },
    {
      path: '/datasource',
      component: () => import('./views/DataSource/DataSources.vue'),
      beforeEnter: isUserAuthenticated,
      children: [
        {
          path: 'select',
          name: 'SelectDataSource',
          components: () => import('./views/DataSource/SelectDataSource.vue'),
          beforeEnter: isUserAuthenticated,
        },
        {
          path: 'create/:typeAdapter',
          name: 'CreateDataSource',
          component: () => import('./views/DataSource/CreateDataSource.vue'),
          props: true,
          beforeEnter: isUserAuthenticated,
        },
        {
          path: 'edit/:typeAdapter/:sourceid',
          name: 'EditDataSource',
          component: () => import('./views/DataSource/CreateDataSource.vue'),
          props: true,
          beforeEnter: isUserAuthenticated,
        },
        {
          path: 'dataasset/create/:sourceid',
          name: 'CreateDataAsset',
          component: () => import('./views/DataSource/CreateDataAsset.vue'),
          props: true,
          beforeEnter: isUserAuthenticated,
        },
      ],
    },
  ]
})
