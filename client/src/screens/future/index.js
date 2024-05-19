import futurSubwayData from '../../common/projets_lignes_idf.json'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import React, { useState, useEffect } from 'react';


export default function Future() {
    const position = [48.8615405601169, 2.3428100161477863];
    const [geojson, setGeojson] = useState(futurSubwayData);

    const onEachFeature = (feature, layer) => {
        if (feature.properties?.nom_projet || feature.properties?.label) {
            const popupContent = `
              <div style='display:flex; justify-content: center;
              align-items: center;'>
                <p style="width: 40px; height: 40px;">${feature.properties.nom_projet}</p>
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
            color: feature.properties.rvb,
            weight: 3,
          };
      };

    return(
    <MapContainer center={position} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geojson} onEachFeature={onEachFeature} style={lineStyle} />
      </MapContainer>
    )
}