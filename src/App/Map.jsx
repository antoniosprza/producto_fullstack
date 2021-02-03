import React, { useRef, useEffect } from 'react';
import * as L from 'leaflet';
import carto from '@carto/carto.js';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import { getPoints } from '../Utils/ApiUils';
import './Map.css';
import axios from 'axios';

function Map (props) {
  const {
    lat,
    lng,
    zoom,
    basemapURL,
    requestPoint
  } = props;

  let username = '';
  let apiKey = '';
  let tableName = '';
  if (process && process.env) {
    if(process.envREACT_APP_USERNAME) {
      username = process.env.REACT_APP_USERNAME;
    }
    if(process.REACT_APP_API_KEY) {
      apiKey = process.env.REACT_APP_API_KEY;
    }
    if(process.REACT_APP_TABLE_NAME) {
      tableName = process.env.REACT_APP_TABLE_NAME;
    }
  }

  const map = useRef({});

  requestPoint.current = async () => {
    const pointsLayer = await createPointsLayer(username, apiKey, tableName);
    const popup = L.popup({ closeButton: true });
    pointsLayer.addTo(map.current);

    pointsLayer.eachLayer(async point=> {
      point.on('click', async e => {
        let htmlContent;
        htmlContent = await makeMarkupOnePoint(e.latlng.lat, e.latlng.lng, e.direction);
        popup.setContent(htmlContent);
        popup.setLatLng(e.latlng);
        if (!popup.isOpen()) {
          popup.openOn(map.current);
        }
      });
    });
  };


  useEffect(() => {
    map.current = L.map('map', {
      center: [lat, lng],
      zoom,
      zoomControl: false
    });
    const basemap = L.tileLayer(basemapURL, {
      detectRetina: true,
      retina: '@2x',
    });
    basemap.addTo(map.current)

  }, [
    lat,
    lng,
    zoom,
    basemapURL,
  ]);
  return (
    <div id="map"/>
  );
}

const createPointsLayer = async (user, key, tableName) => {
  let pointData;
  await getPoints(user, key, tableName).then(data=>pointData = data);

  const pointsArray = [];
  pointData.forEach(p=>{
    const circleMarker = L.circleMarker(p, {
      color: '#3388ff'
    }).setRadius(1);
    pointsArray.push(circleMarker);
  });

  return L.layerGroup(pointsArray);
};



function getAdd(lat, longi){
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    + lat + ',' + longi
    + '&key=AIzaSyDzffiJHKOuLRrQm7FbKrwIzJMCXqaZGGA';
  //let response = await axios.get(url);
  //return await
  return axios.get(url)
    .then(response => {
      //props = {address: resp.data.results[0].formatted_address}
      this.response = response.data
      //let object = {addres: resp.data.results[0].formatted_address}
      //let props {address} = resp.data.results[0].formatted_address
      //return resp.data.results[0].formatted_address
      return this.response.results[0].formatted_address
    });
}

const  axiosTest =  async (la, lo)=>{
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    + la + ',' + lo
    + '&key=AIzaSyDzffiJHKOuLRrQm7FbKrwIzJMCXqaZGGA';
  const promise = await axios.get(url);
  const dataPromise = promise
  return dataPromise
}

const funcionAxios = (latitud, longitud) => {
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    + latitud + ',' + longitud
    + '&key=AIzaSyDzffiJHKOuLRrQm7FbKrwIzJMCXqaZGGA';
  axios.get(url)
    .then((result) => {
      return result
    })
    .catch((error) => {
      return error
    })
}



const  makeMarkupOnePoint = async (lat, lng, info = '')  =>{
  var latitud = lat;
  var longitud = lng;
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    + lat + ',' + lng
    + '&key=AIzaSyDzffiJHKOuLRrQm7FbKrwIzJMCXqaZGGA';

  var a;
  await axiosTest(latitud, longitud)
    .then(res => {
      a = res.data.results[0].formatted_address
      console.log(res.data.results[0].formatted_address)
      //data.json({ message: 'Request received!', data })
    })
    .catch(err => console.log(err));

  const principal = async() => {
    const resultadoAxios = await funcionAxios(latitud, longitud)
  }

  return `
    <div class="widget">
    ${lat ? `
    <h3>${lat}, ${lng}</h3>
    `: ''}
    ${a ? `
    <h4>${a}</h4>
    `: '<h4>No hay dirección</h4>'}
    </div>
  `;
}


Map.propTypes = {
  basemapURL: PropTypes.string,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  requestPoint: PropTypes.shape({
    current: PropTypes.func,
  })
};
Map.defaultProps = {
  zoom: 13,
  basemapURL: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
  requestPoint: {
    current: () => {},
  }
}

export default Map;
