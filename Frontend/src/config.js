const API_BASE_URL = import.meta.env.PROD 
  ? '' // In production, serve from the same domain
  : 'http://127.0.0.1:5000'; // In development, use the local server

export default API_BASE_URL;
