import React, { useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { Marker, useMap } from 'react-leaflet';

import { promiseToFlyTo, getCurrentLocation } from 'lib/map';

import Layout from 'components/Layout';
import Map from 'components/Map';

import gatsby_astronaut from 'assets/images/gatsby-astronaut.jpg';

const LOCATION = {
  lat: 37.773972,
  lng: -122.431297,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 13;
const ZOOM = 13;

const timeToZoom = 2000;
const timeToOpenPopupAfterZoom = 4000;
const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

const popupContentHello = `<p>Hello 👋</p>`;
const popupContentGatsby = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-image">
      <img class="gatsby-astronaut" src=${gatsby_astronaut} />
    </div>
    <div class="popup-gatsby-content">
      <h1>Hello San francisco</h1>
      <p></p>
    </div>
  </div>
`;

/**
 * MapEffect
 * @description This is an example of creating an effect used to zoom in and set a popup on load
 */

const MapEffect = ({ markerRef }) => {
  const map = useMap();

  useEffect(() => {
    if ( !markerRef.current || !map ) return;

    ( async function run() {
      const popup = L.popup({
        maxWidth: 800,
      });

      const location = await getCurrentLocation().catch(() => LOCATION );

      const { current: marker } = markerRef || {};

      marker.setLatLng( location );
      popup.setLatLng( location );
      popup.setContent( popupContentHello );

      setTimeout( async () => {
        await promiseToFlyTo( map, {
          zoom: ZOOM,
          center: location,
        });

        marker.bindPopup( popup );

        setTimeout(() => marker.openPopup(), timeToOpenPopupAfterZoom );
        setTimeout(() => marker.setPopupContent( popupContentGatsby ), timeToUpdatePopupAfterZoom );
      }, timeToZoom );
    })();
  }, [map, markerRef]);

  return null;
};

const IndexPage = () => {
  const markerRef = useRef();

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Map</title>
      </Helmet>

      <Map {...mapSettings}>
        <MapEffect markerRef={markerRef} />
        <Marker ref={markerRef} position={CENTER} />
      </Map>
    </Layout>
  );
};

export default IndexPage;
