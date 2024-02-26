<template>
  <div class="events">
    <h1>Events</h1>
    <div v-if="loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Event ID</th>
            <th scope="col">Event Name</th>
            <th scope="col">Event Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.id }}</td>
            <td>{{ event.name }}</td>
            <td>{{ event.date }}</td>
            <td>
              <router-link
                :to="{ name: 'Tables', params: { eventId: event.id } }"
                class="btn btn-primary"
                >View Tables</router-link
              >
              <router-link
                :to="{ name: 'Guests', params: { eventId: event.id } }"
                class="btn btn-secondary"
                >View Guests</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'EventsList',
  data() {
    return {
      events: [],
      loading: true
    };
  },
  created() {
    this.socket = io('http://localhost:3001');
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('events', (data) => {
      this.events = data;
      this.loading = false;
    });
  },
  beforeUnmount() {
    this.socket.close();
  }
};
</script>

<style></style>
