// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

// import map
import mapboxgl from "C:/Users/THANH HUNG/node_modules/@types/mapbox-gl/index";
// get hook from map_live.html.heex
let Hooks = {}
Hooks.MainMap = {
  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbmhodW5nMTExMTIwMDIiLCJhIjoiY2xuOG5xbXhyMDBqdzJqb3o2eTg4ZDdvNCJ9.c1wnXUMq8opOXn7NrPIwhA';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [105.8066925,15.9030623],
      zoom:4.5
    });

    const layerList = document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');

    for (const input of inputs) {
      input.onclick = (layer) => {
      const layerId = layer.target.id;
      map.setStyle('mapbox://styles/mapbox/' + layerId);
      };
    }
  
  map.on('load', () => {
    // Add a geojson point source.
    // Heatmap layers also work with a vector tile source.
    map.addSource('earthquakes', {
    'type': 'geojson',
    'data': './images/trains.geojson'
    });
     
    map.addLayer(
    {
    'id': 'earthquakes-heat',
    'type': 'heatmap',
    'source': 'earthquakes',
    'maxzoom': 9,
    'paint': {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    0,
    0,
    6,
    1
    ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0,
    1,
    9,
    3
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.2,
    'rgb(103,169,207)',
    0.4,
    'rgb(209,229,240)',
    0.6,
    'rgb(253,219,199)',
    0.8,
    'rgb(239,138,98)',
    1,
    'rgb(178,24,43)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0,
    2,
    9,
    20
    ],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    1,
    9,
    0
    ]
    }
    },
    'waterway-label'
    );
     
    map.addLayer(
    {
    'id': 'earthquakes-point',
    'type': 'circle',
    'source': 'earthquakes',
    'minzoom': 7,
    'paint': {
    // Size circle radius by earthquake magnitude and zoom level
    'circle-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
    16,
    ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
    ],
    // Color circle by earthquake magnitude
    'circle-color': [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    1,
    'rgba(33,102,172,0)',
    2,
    'rgb(103,169,207)',
    3,
    'rgb(209,229,240)',
    4,
    'rgb(253,219,199)',
    5,
    'rgb(239,138,98)',
    6,
    'rgb(178,24,43)'
    ],
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    // Transition from heatmap to circle layer by zoom level
    'circle-opacity': [
    'interpolate',
    ['linear'],
    ['zoom'],
    7,
    0,
    8,
    1
    ]
    }
    },
    'waterway-label'
    );
    });
  },
  mounted() {
    this.initMap();
  }
}

const scoll = 'nav';
let items = document.querySelectorAll('.item');
let nav = document.getElementById('nav');
document.addEventListener('scroll', (event) => {
    if(window.scrollY > 500){
        nav.classList.add('tofixed');
    }else{
        nav.classList.remove('tofixed');
    }
    items.forEach(item =>{
        if(item.offsetTop - window.scrollY < 350){
            item.classList.add('active');
        }
    })
})
  


let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
    params: {_csrf_token: csrfToken},
    hooks: Hooks
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

