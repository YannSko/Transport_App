// import axios from 'axios';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import '../../App.css';
import React from 'react';
// import DataGeojson from '../../common/itin.json'
import FuturDataGeojson from '../../common/projets_lignes_idf.json'


// const apiCall = () => {
//   axios.get('http://localhost:3001/').then((data) => {
//     //this console.log will be in our frontend console
//     console.log(data)
//   })
// }


export default function Itineraire() {
    const [geojson, setGeojson] = React.useState(FuturDataGeojson);
    const position = [48.9017166349691, 2.20873722193315];

    return(
        <MapContainer center={position} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geojson}/>
        </MapContainer>
    )
}