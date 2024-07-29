<template>
  <div class="table-container">
    <h1>User Table</h1>
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.address }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: []
    };
  },
  // dosjdod
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8081/getUser');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }
};
</script>

<style>
.table-container {
  max-width: 1000px; /* 最大宽度限制 */
  margin: 0 auto; /* 居中对齐 */
  padding: 20px;
}

.table-wrapper {
  overflow-x: auto; /* 启用水平滚动 */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>