// import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../../App.css';
import React from 'react';
import FindAddress from '../../components/address';
import DataGeojson from '../../common/traces-du-reseau-ferre-idf.json'
// import FuturDataGeojson from '../../common/projets_lignes_idf.json'


// const apiCall = () => {
//   axios.get('http://localhost:3001/').then((data) => {
//     //this console.log will be in our frontend console
//     console.log(data)
//   })
// }


export default function Home() {
    const [geojson, setGeojson] = React.useState(DataGeojson);
    const position = [48.9017166349691, 2.20873722193315];

    const onEachFeature = (feature, layer) => {
        if (feature.properties?.picto_final) {
            const popupContent = `
              <div style='display:flex; justify-content: center;
              align-items: center;'>
                <img 
                  src="${feature.properties.picto_final}" 
                  alt="${feature.properties.res_com} logo" 
                  style="width: 40px; height: 40px;" 
                />
              </div>
            `;
            const popup = layer.bindPopup(popupContent, { closeButton: false });
        
            layer.on('mouseover', () => {
            popup.openPopup();
            });
        
            layer.on('mouseout', () => {
            popup.closePopup();
            });
        }
    };

    const lineStyle = (feature) => {
        return {
          color: "#" + feature.properties.colourweb_hexa, // Default to black if color not specified
          weight: 3,
        };
    };

    return(
      <div style={{
        display: 'flex',
        }}>
        <FindAddress/>
        <MapContainer center={position} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geojson} onEachFeature={onEachFeature} style={lineStyle}/>
        </MapContainer>
        </div>
    )
}