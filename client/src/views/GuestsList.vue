<template>
  <div class="guests">
    <h1>Guests for Event {{ eventId }}</h1>
    <div v-if="loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Guest ID</th>
            <th scope="col">Guest Name</th>
            <th scope="col">Guest Email</th>
            <th scope="col">Table ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in guests" :key="guest.id">
            <td>{{ guest.id }}</td>
            <td>{{ guest.name }}</td>
            <td>{{ guest.email }}</td>
            <td>{{ guest.tableId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'GuestsList',
  props: ['eventId'],
  data() {
    return {
      guests: [],
      loading: true
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
    this.socket.on('guests', (data) => {
      this.guests = data.filter((guest) => guest.eventId === this.eventId);
      this.loading = false;
    });
  },
  beforeUnmount() {
    this.socket.close();
  }
};
</script>

<style></style>
