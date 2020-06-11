import axios from 'axios';
 
const api = axios.create({
    baseURL: 'https://estudobiblico.herokuapp.com/livro'
});
 
export default api;