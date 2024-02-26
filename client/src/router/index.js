import { createRouter, createWebHistory } from 'vue-router';
import EventsList from '@/views/EventsList.vue';
import TablesList from '@/views/TablesList.vue';
import GuestsList from '@/views/GuestsList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Events',
      component: EventsList
    },
    {
      path: '/tables/:eventId',
      name: 'Tables',
      component: TablesList,
      props: true
    },
    {
      path: '/guests/:eventId',
      name: 'Guests',
      component: GuestsList,
      props: true
    }
  ]
});

export default router;
