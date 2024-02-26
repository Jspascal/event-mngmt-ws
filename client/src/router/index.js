import { createRouter, createWebHistory } from 'vue-router';
import Events from '../views/Events.vue';
import Tables from '../views/Tables.vue';
import Guests from '../views/Guests.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Events',
      component: Events
    },
    {
      path: '/tables/:eventId',
      name: 'Tables',
      component: Tables,
      props: true
    },
    {
      path: '/guests/:eventId',
      name: 'Guests',
      component: Guests,
      props: true
    }
  ]
});

export default router;
