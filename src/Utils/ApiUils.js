import axios from 'axios';

axios.defaults.headers.common.Accept = 'application/json';

const fetch = (endpoint) => {
return axios
    .get('http://localhost:8080/api/points')
    .then((res) => res)
    .catch((err) => {
    console.error(
        'Error catch in Apiutils at fetch method. It will be thrown...');
    throw err;
    });
}

export const getPoints = (user = '', apiKey = '', table = '') => {
    const query = `https://${user}.carto.com/api/v2/sql?api_key=${apiKey}&q=SELECT latitude, longitude FROM ${table}`;
    return fetch(query)
      .then(res=> {
        const data = [];
        res.data.forEach(point=>{
          data.push({lat: point.latitude, lng: point.longitude})
        })
        return data;
      });
  };
