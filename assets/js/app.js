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
import mapboxgl from "mapbox-gl"
// get hook from map_live.html.heex
let Hooks = {}
Hooks.MainMap = {
  initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbmhodW5nMTExMTIwMDIiLCJhIjoiY2xuOG5xbXhyMDBqdzJqb3o2eTg4ZDdvNCJ9.c1wnXUMq8opOXn7NrPIwhA';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
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
      map.addSource('trees', {
      'type': 'geojson',
      'data': './images/trains.geojson'
      });
      map.addLayer(
        {
          id: 'trees-heat',
          type: 'heatmap',
          source: 'trees',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(236,222,239,0)',
              0.2,
              'rgb(208,209,230)',
              0.4,
              'rgb(166,189,219)',
              0.6,
              'rgb(103,169,207)',
              0.8,
              'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              default: 1,
              stops: [
                [14, 1],
                [15, 0]
              ]
            }
          }
        },
        'waterway-label'
      );
      map.addLayer(
        {
          id: 'trees-point',
          type: 'circle',
          source: 'trees',
          minzoom: 14,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [0, 'rgba(236,222,239,0)'],
                [10, 'rgb(236,222,239)'],
                [20, 'rgb(208,209,230)'],
                [30, 'rgb(166,189,219)'],
                [40, 'rgb(103,169,207)'],
                [50, 'rgb(28,144,153)'],
                [60, 'rgb(1,108,89)']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );
      map.addLayer(
        {
          'id': 'traffic',
          'type': 'line',
          'source': {
            'type': 'vector',
            'url': 'mapbox://mapbox.mapbox-traffic-v1'
          },
          'source-layer': 'traffic',
          'paint': {
            'line-color': [
              'match',
              ['get','congestion'],
              'heavy',
              '#ff0000',
              'moderate',
              '#FBCEB1',
              'low',
              '#00FF00',
              'white'
            ],
            'line-width': 3
          }
        }
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

