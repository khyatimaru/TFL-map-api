import React from 'react';
import L from 'leaflet';
import getRequest from '../services/api.js';
import "wrld.js";


export class LoadMap extends React.Component {

    componentDidMount() {
        this.getLinesInfo();
    }
    constructor() {
        super();
        this.state = {

            lineItems: undefined,
            lineColors : {
                "bakerloo":"#996633",
                "central":"#CC3333",
                "circle":"#FFCC00",
                "district":"#006633",
                "hammersmith-city":"#CC9999",
                "jubilee":"#868F98",
                "metropolitan":"#660066",
                "northern":"#000000",
                "piccadilly":"#0019A8",
                "victoria":"#0099CC",
                "waterloo-city":"#66CCCC"
            }
        }
        this.getLinesInfo = this.getLinesInfo.bind(this);
    }

    /*Makes Request to TFL API to load line data*/
    getLinesInfo = () => {

        const position = [51.517327, -0.120005];
        const map = L.eeGeo.map("map", "fa97b71f5ee87ae3edd5a5f5c76d7328", {
            center: position,
            zoom: 15
        });

        const lineURL = 'https://api.tfl.gov.uk/line/mode/tube';
        getRequest(lineURL).then(
            (result) => {
                let lines = [];
                result.map((line, index) => {
                    lines.push(line);
                    this.getLineStops(line.id, map)
                });

                this.setState({
                     lineItems: lines,
                });
            },
        )
    }
    /* Makes request to get stops for particular line*/
    getLineStops = (id, map) => {

        const lineURL = 'https://api.tfl.gov.uk/line/'+id+'/route/sequence/outbound';
        getRequest(lineURL).then(
            (result) => {
                result.stopPointSequences.map((stops, index) => {
                    this.drawLine(stops, id, map)
                });
            }
        );

    }
    /*Draws Line with color */
    drawLine = (stops, id, map) => {
        let line = [], stopPoints = {};
        stops.stopPoint.map((stopPoint, index) => {
            line.push([stopPoint.lat, stopPoint.lon]);
            this.drawStops(stopPoint.id, stopPoint.name, stopPoint.lat, stopPoint.lon, map);
        });
        L.polyline(line, {weight:8, color:this.state.lineColors[id]}).addTo(map);
    }

    /*Marks Stops*/
    drawStops = (stopPointId, name, lat, lon, map) => {
        let stopPoints = {}
        if (!(stopPointId in stopPoints))
        {
            var latLon = [lat, lon];
            var marker = L.marker(latLon, {
                title: name,
                options: {"id":stopPointId, "name":name}
            }).addTo(map);
            marker.bindPopup(name);

            stopPoints[stopPointId] = marker;
        }
    }

    render() {
        return (
            <div id="map"></div>
        );
    }
}


