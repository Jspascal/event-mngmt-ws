import io from 'socket.io-client';

const endpoint = import.meta.env.PROD
  ? 'https://event-mngmt-ws.onrender.com'
  : 'http://localhost:3001';

export default io(endpoint);
