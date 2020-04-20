import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  lat: number;
  long: number;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    const geo = this.router.snapshot.paramMap.get('geo');
    const geoData = geo.substr(4).split(',');
    this.lat = Number(geoData[0]);
    this.long = Number(geoData[1]);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG16ODY2IiwiYSI6ImNrOTNudW0zbzA0ODkzZXFtZHpteW1hcmEifQ.2uJURjUxH0WCeavjS2ORzA';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.long, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
      });

      map.on('load', () => {
        map.resize();

        new mapboxgl.Marker().setLngLat([this.long, this.lat]).addTo(map);


        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;
         
        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
        }
        }
         
        map.addLayer(
        {
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
        },
        labelLayerId
        );
        });
  }
}
