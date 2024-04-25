// import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../../App.css';
import React from 'react';
import GetGeoJSON from '../../components/map_itineraire/index.js'
// import FuturDataGeojson from '../../common/projets_lignes_idf.json'
// import FindAddress from '../../components/address';


export default function Itineraire() {
    // const [geojson, setGeojson] = React.useState(FuturDataGeojson);
    const position = [48.9017166349691, 2.20873722193315];
    const data = GetGeoJSON()
    console.log(data)
    return(
        <div style={{display:'flex'}}>
            {/* <FindAddress/> */}
            <MapContainer center={position} zoom={13} style={{}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {/* <GeoJSON data={geojson}/> */}
            </MapContainer>
        </div>
    )
}