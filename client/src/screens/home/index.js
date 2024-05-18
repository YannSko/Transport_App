import subwayData from '../../common/traces-du-reseau-ferre-idf.json'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import React, { useState, useEffect } from 'react';
import FindAddress from '../../components/address';
import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import Slider from 'rc-slider';
import '../../App.css';

export default function Home() {
  const [geojson, setGeojson] = React.useState('');

  const filterGeojsonByYear = (year) => {

    const filteredGeojson = {
      ...subwayData,
      features: subwayData.features.filter(feature => {
        const constructionDate = new Date(feature.properties.date_mes);
        return constructionDate.getFullYear() < year;
      })
    };

    setGeojson(filteredGeojson);
    console.log(geojson)
  };

  return (
    <div style={{
      display: 'flex',
    }}>
      <FindAddress/>
      <Cursor onChangeYear={filterGeojsonByYear} geojson={geojson} />
    </div>
  );
}

// ----------------------------------------------------------------------------------------------------------------------------

const MapHome = ( {geojson, mapKey} ) => {
  const position = [48.8615405601169, 2.3428100161477863];
  const [key, setKey] = useState(mapKey);
  
  useEffect(() => {
    setKey(mapKey);
  }, [mapKey]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.picto_final || feature.properties?.label) {
        const popupContent = `
          <div style='display:flex; justify-content: center;
          align-items: center;'>
            <img 
            ${feature.properties.picto_final ? 'src="'+feature.properties.picto_final+'"' : 'src="'+feature.properties.label+'"'}
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
        color: "#" + feature.properties.colourweb_hexa,
        weight: 3,
      };
  };

  return(
  <MapContainer center={position} zoom={13} key={key}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geojson} onEachFeature={onEachFeature} style={lineStyle} />
      </MapContainer>
  )
};

// ----------------------------------------------------------------------------------------------------------------------------

const Cursor = ({ onChangeYear, geojson }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [mapKey, setMapKey] = useState(1);

  const handleSliderChange = (year) => {
    setMapKey(prevKey => prevKey + 1);
    setSelectedYear(year);
    onChangeYear(year);
  };

  return (
  <div style={{width:'100%', height: '100%'}}>
      <div style={{ width: '200px', margin: '20px' }}>
        <Slider
          min={1900}
          max={new Date().getFullYear()}
          value={selectedYear}
          onChange={handleSliderChange}
          marks={{ 1900: '1900', [new Date().getFullYear()]: `${new Date().getFullYear()}` }}
        />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          Selected Year: {selectedYear}
        </div>
      </div>
      <MapHome geojson={geojson} mapKey={mapKey}/>
    </div>
  );
};