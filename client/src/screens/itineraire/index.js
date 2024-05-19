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


    const [geojsonArr, setGeojsonArr] = useState([]);
    const [journey, setJourney] = useState('');
    const [geojson, setGeojson] = useState('');
    
    

    
    useEffect(() => {
        if (from && to) {
            request.TryGetItineraire(from, to)
                .then((result) => {
                    setJourney(result.journeys)
                })
                .catch((error) => console.error('Error fetching output:', error));
        }
    }, [from, to]);    


    const TryGetGeojson = (journey) => {
        if (journey) {
            for (let i=0; i<journey.length; i++){
                const tempGeojsonarr = geojsonArr;
                const newJourney = journey[i].sections;
                const newGeojsonArray = newJourney
                    // .filter(entry => entry.hasOwnProperty('geojson'))
                    .map(entry => ({
                        "type": "Feature",
                        "geometry": entry.geojson,
                        "properties": entry.display_informations || {color: '0000FF'}
                    }));
                const tempGeojson = {
                    "type": "FeatureCollection",
                    "features": newGeojsonArray
                };
                tempGeojsonarr.push(tempGeojson);
                setGeojsonArr(tempGeojsonarr);
            }
        }
    };

    const filteredGeojsonByIndex = (index) => {
        TryGetGeojson(journey);
        const filteredGeojson = geojsonArr[index];
        console.log(index);
        setGeojson(filteredGeojson);
    };
    
    return (
        <div>
            <ButtonGenerator onChangeIndex={filteredGeojsonByIndex} geojson={geojson} journey={journey}/>
        </div>
    );
};

const ItineraireMap = ( {geojson, mapKey} ) => {
    const position = [48.8615405601169, 2.3428100161477863];
    const [key, setKey] = useState(mapKey);
  
    useEffect(() => {
        setKey(mapKey);
    }, [mapKey]);

    const onEachFeature = (feature, layer) => {
        let popupContent = ''
        if (feature.properties?.name) {
            popupContent = `
              <div style='display:flex; justify-content: center;
              align-items: center;'>
              ${feature.properties.name}
              </div>
            `;
        }else{
            popupContent = `
              <div style='display:flex; justify-content: center;
              align-items: center;'>
              walking
              </div>
            `;
        }
            const popup = layer.bindPopup(popupContent, { closeButton: false });
        
            layer.on('mouseover', () => {
            popup.openPopup();
            });
        
            layer.on('mouseout', () => {
            popup.closePopup();
            });
        
    };

    const lineStyle = (feature) => {
        return {
          color: "#" + feature.properties.color,
          weight: 3,
        };
    };

    return (
        <div>
            <MapContainer center={position} zoom={13} key={key}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                <GeoJSON data={geojson} style={lineStyle} onEachFeature={onEachFeature}/>
            </MapContainer>
        </div>
    );
};

const ButtonGenerator = ({ onChangeIndex, geojson, journey }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mapKey, setMapKey] = useState(1);
    const NbrJourney = journey.length;

    const handleButtonChange = (index) => {
        setMapKey(prevKey => prevKey + 1);
        setSelectedIndex(index);
        onChangeIndex(index);
    };

    return ( 
    <div>
        <div>
            {[...Array(NbrJourney)].map((_, index) => (
                <button 
                key={index}
                value={selectedIndex}
                onClick={() => handleButtonChange(index)}>
                    {`Journey ${index + 1}`
                }</button>
                ))}
        </div>
        <ItineraireMap geojson={geojson} mapKey={mapKey}/>
    </div>
    );
};