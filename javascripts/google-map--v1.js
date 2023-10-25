/**
 * WVU Google Map component
 * ==================================================
 * Required JavaScript for the WVU Google Map component.
 * This JS fetches JSON and outputs points and information
 * onto a Google Map.
 * @blame: Adam Glenn & Adam Johnson
*/

/* global crypto google fetch */
const googleMap = (() => {
  'use strict';

  //
  // Variables
  //

  const getJsonSource = `${document.querySelector('#js-dataSrc')?.innerText}?=${crypto.randomUUID()}`;
  const getLat = document.querySelector('#js-lat')?.innerText;
  const getLong = document.querySelector('#js-long')?.innerText;
  const getMarkersEl = document.querySelector('#js-markers');
  const getMapEl = document.querySelector('#js-map');
  const getZoomEl = document.querySelector('#js-zoom');
  const zoomLevel = Number(getZoomEl?.innerText);
  const centerCoord = new google.maps.LatLng(getLat, getLong);
  const arrMarkers = [];
  const arrInfoWindows = [];
  let map;

  const mapOptions = {
    zoom: zoomLevel,
    center: centerCoord,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      }
    ]
  };

  //
  // Methods
  //

  // Fetch JSON:
  const fetchData = async (source) => {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error('Network response was not OK.');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching JSON:', error);
      renderFetchError(error);
    }
  };

  // Render fetch errors to the UI:
  const renderFetchError = (error) => {
    const liError = document.createElement('li');
    liError.innerText = `${error} Please contact the site administrator about this issue and include this URL.`;
    getMarkersEl.appendChild(liError);
  };

  // Render an error to the UI and console if a DOM element doesn't exist as it should:
  const renderDomError = () => {
    const liError = document.createElement('li');
    liError.innerText = 'One of the required HTML elements for this map is missing. Please contact the site administrator about this issue and include this URL.';
    getMarkersEl.appendChild(liError);
    console.error('Missing DOM element: check that each DOM node we\'re looking for via querySelector exists and that the selectors actually match what we\'re looking for.');
  };

  // Render an error to the UI and console if there's no places in the JSON data:
  const renderNoPlacesError = () => {
    const liError = document.createElement('li');
    liError.innerText = 'No places have been added to this map. Please contact the site administrator about this issue and include this URL.';
    getMarkersEl.appendChild(liError);
    console.warn('Missing child pages: add child pages that use the \'Place\' template underneath this page. This makes markers show up on the map. Be sure to fill out each page\'s Custom Data. Right now, there\'s no data in the places array; hence, the blank map.');
  };

  // Render `<li>`s to the left side of the map:
  const renderPlacesList = (item, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<button type="button" class="marker__btn btn-link bg-transparent border-0 text-start" data-index="${index}"></button>`;
    listItem.firstChild.innerText = item.title;
    getMarkersEl.appendChild(listItem);
  };

  // Render map markers (pins) and infoWindows:
  const renderMapItems = (data, map) => {
    // If no places exist, notify user:
    if (!data?.places?.length) {
      return renderNoPlacesError();
    }

    // Render places and infoWindows:
    data.places.forEach((item, i) => {
      renderPlacesList(item, i);

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.lat, item.lng),
        map: map,
        title: item.title
      });
      arrMarkers[i] = marker;

      const infoWindow = new google.maps.InfoWindow({
        maxWidth: 300,
        content: `
          <div id="infoWindow" class="text-dark">
            <h3 class="infoWindow__h3 mb-0">${item.title}</h3>
            <div class="infoWindow__image">${item.img}</div>
            <div class="infoWindow__address">${item.address}</div>
            <div class="infoWindow__description">${item.description}</div>
            <div class="infoWindow__url">${item.url}</div>
          </div>
        `
      });
      arrInfoWindows[i] = infoWindow;

      // If an infoWindow is already open on the map, close it when opening a different infoWindow:
      google.maps.event.addListener(marker, 'click', () => {
        arrInfoWindows.forEach(infoWindow => {
          infoWindow.close();
        });
        infoWindow.open(map, marker);
      });
    });
  };

  const infoWindowState = (map, markers) => {
    markers.addEventListener('click', (event) => {
      if (!event.target.matches('#js-markers button')) return;
      const i = event.target.getAttribute('data-index');

      // Close all open infoWindows before opening the selected one:
      arrInfoWindows.forEach(infoWindow => {
        infoWindow.close();
      });
      arrInfoWindows[i].open(map, arrMarkers[i]);
    }, false);
  };

  //
  // Classes
  //

  // Center map button creator class:
  class HomeControl {
    constructor (controlDiv, map) {
      controlDiv.style.padding = '1px';

      const controlUI = document.createElement('button');
      controlUI.type = 'button';
      controlUI.id = 'js-center-map';
      controlUI.classList.add('btn', 'btn-white', 'btn-sm', 'mt-1');
      controlUI.title = 'Reset the map to center';
      controlUI.innerText = 'Center Map';
      controlDiv.appendChild(controlUI);

      document.addEventListener('click', (event) => {
        if (!event.target.matches('#js-center-map')) return;
        map.setCenter(centerCoord);
        map.setZoom(zoomLevel);
      }, false);
    }
  }

  //
  // Inits
  //

  const mapInit = async () => {
    map = new google.maps.Map(getMapEl, mapOptions);

    const homeControlDiv = document.createElement('div');
    const centerMap = new HomeControl(homeControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP].push(homeControlDiv);

    const data = await fetchData(getJsonSource);
    renderMapItems(data, map);
    infoWindowState(map, getMarkersEl);
  };

  // Variable guards:
  if (!getJsonSource || !getLat || !getLong || !getMarkersEl || !getMapEl || !getZoomEl) {
    return renderDomError();
  }

  // Start the party:
  mapInit();
})();
