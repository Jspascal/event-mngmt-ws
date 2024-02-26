<template>
  <div class="tables">
    <h1>Tables for Event {{ eventId }}</h1>
    <div v-if="loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Table Capacity</th>
            <th scope="col">Table Occupancy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="table in tables" :key="table.id">
            <td>{{ table.id }}</td>
            <td>{{ table.name }}</td>
            <td>{{ table.capacity }}</td>
            <td>{{ table.occupancy }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import socket from '@/config/socket';
export default {
  name: 'TablesList',
  props: ['eventId'],
  data() {
    return {
      tables: [],
      loading: true
    };
  },
  created() {
    socket.on('tables', (data) => {
      this.tables = data.filter((table) => table.eventId === this.eventId);
      this.loading = false;
    });
  },
  beforeUnmount() {
    socket.close();
  }
};
</script>

<style></style>
