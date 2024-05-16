// import GetGeoJSON from '../../components/map_itineraire/index.js'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useLocation, useNavigate } from 'react-router-dom';
import * as request from '../../common/requests/request.js';
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import '../../App.css';

export default function Itineraire() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [from, setFrom] = useState(searchParams.get('from'));
    const [to, setTo] = useState(searchParams.get('to'));
    const [geojson, setGeojson] = useState([]);
    const geojsonDataArray = [];
    const position = [48.9017166349691, 2.20873722193315];

    useEffect(() => {
        if (from && to) {
            request.TryGetItineraire(from, to)
                .then((result) => {
                    const newJourney = result.journeys[0].sections;
                    const newGeojsonArray = newJourney
                        .filter(entry => entry.hasOwnProperty('geojson'))
                        .map(entry => entry.geojson);
                    setGeojson(newGeojsonArray);
                    console.log(geojson)
                })
                .catch((error) => console.error('Error fetching output:', error));
        }
    }, [from, to]);

    const renderMap = geojson.length > 0 && (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geojson} />
        </MapContainer>
    );

    return (
        <div style={{ display: 'flex' }}>
            {renderMap}
        </div>
    );
};