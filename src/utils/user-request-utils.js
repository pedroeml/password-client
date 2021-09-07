import axios from 'axios';
import environment from '../environment';

export function getUsers(ids) {
  return axios.all(ids.map(id => axios.get(`${environment.API_URL}/users/${id}`)));
}
