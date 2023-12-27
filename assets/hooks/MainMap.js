const MainMap = {
    mounted() {
        mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbmhodW5nMTExMTIwMDIiLCJhIjoiY2xuOG5xbXhyMDBqdzJqb3o2eTg4ZDdvNCJ9.c1wnXUMq8opOXn7NrPIwhA';

        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/traffic-night-v2',
        center: [105.8066925,15.9030623],
        zoom:4.5
        });

        map.addControl(
        new MapboxDirections({
        accessToken: mapboxgl.accessToken
        }),
        'top-left'
        );
        

    
        // Add geolocate control to the map.
        map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
        })
        );

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            // Select which mapbox-gl-draw control buttons to add to the map.
            controls: {
            polygon: true,
            trash: true
            },
            // Set mapbox-gl-draw to draw by default.
            // The user does not have to click the polygon control button first.
            defaultMode: 'draw_polygon'
            });
            map.addControl(draw);
            
            map.on('draw.create', updateArea);
            map.on('draw.delete', updateArea);
            map.on('draw.update', updateArea);
            
            function updateArea(e) {
            const data = draw.getAll();
            const answer = document.getElementById('calculated-area');
            if (data.features.length > 0) {
            const area = turf.area(data);
            // Restrict the area to 2 decimal points.
            const rounded_area = Math.round(area * 100) / 100;
            answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
            } else {
            answer.innerHTML = '';
            if (e.type !== 'draw.delete')
            alert('Click the map to draw a polygon.');
            }
            }


        // Add the control to the map.
        map.addControl(
        new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
        })
        );

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
        // map.addLayer(
        //   {
        //     id: 'trees-heat',
        //     type: 'heatmap',
        //     source: 'trees',
        //     maxzoom: 15,
        //     paint: {
        //       // increase weight as diameter breast height increases
        //       'heatmap-weight': {
        //         property: 'dbh',
        //         type: 'exponential',
        //         stops: [
        //           [1, 0],
        //           [62, 1]
        //         ]
        //       },
        //       // increase intensity as zoom level increases
        //       'heatmap-intensity': {
        //         stops: [
        //           [11, 1],
        //           [15, 3]
        //         ]
        //       },
        //       // assign color values be applied to points depending on their density
        //       'heatmap-color': [
        //         'interpolate',
        //         ['linear'],
        //         ['heatmap-density'],
        //         0,
        //         'rgba(236,222,239,0)',
        //         0.2,
        //         'rgb(208,209,230)',
        //         0.4,
        //         'rgb(166,189,219)',
        //         0.6,
        //         'rgb(103,169,207)',
        //         0.8,
        //         'rgb(28,144,153)'
        //       ],
        //       // increase radius as zoom increases
        //       'heatmap-radius': {
        //         stops: [
        //           [11, 15],
        //           [15, 20]
        //         ]
        //       },
        //       // decrease opacity to transition into the circle layer
        //       'heatmap-opacity': {
        //         default: 1,
        //         stops: [
        //           [14, 1],
        //           [15, 0]
        //         ]
        //       }
        //     }
        //   },
        //   'waterway-label'
        // );
        // map.addLayer(
        //   {
        //     id: 'trees-point',
        //     type: 'circle',
        //     source: 'trees',
        //     minzoom: 14,
        //     paint: {
        //       // increase the radius of the circle as the zoom level and dbh value increases
        //       'circle-radius': {
        //         property: 'dbh',
        //         type: 'exponential',
        //         stops: [
        //           [{ zoom: 15, value: 1 }, 5],
        //           [{ zoom: 15, value: 62 }, 10],
        //           [{ zoom: 22, value: 1 }, 20],
        //           [{ zoom: 22, value: 62 }, 50]
        //         ]
        //       },
        //       'circle-color': {
        //         property: 'dbh',
        //         type: 'exponential',
        //         stops: [
        //           [0, 'rgba(236,222,239,0)'],
        //           [10, 'rgb(236,222,239)'],
        //           [20, 'rgb(208,209,230)'],
        //           [30, 'rgb(166,189,219)'],
        //           [40, 'rgb(103,169,207)'],
        //           [50, 'rgb(28,144,153)'],
        //           [60, 'rgb(1,108,89)']
        //         ]
        //       },
        //       'circle-stroke-color': 'white',
        //       'circle-stroke-width': 1,
        //       'circle-opacity': {
        //         stops: [
        //           [14, 0],
        //           [15, 1]
        //         ]
        //       }
        //     }
        //   },
        //   'waterway-label'
        // );
        // map.addLayer(
        //   {
        //     'id': 'traffic',
        //     'type': 'line',
        //     'source': {
        //       'type': 'vector',
        //       'url': 'mapbox://mapbox.mapbox-traffic-v1'
        //     },
        //     'source-layer': 'traffic',
        //     'paint': {
        //       'line-color': [
        //         'match',
        //         ['get','congestion'],
        //         'heavy',
        //         '#ff0000',
        //         'moderate',
        //         '#FBCEB1',
        //         'low',
        //         '#00FF00',
        //         'white'
        //       ],
        //       'line-width': 3
        //     }
        //   }
        // );
        });
    }
  }
  
  export default MainMap;