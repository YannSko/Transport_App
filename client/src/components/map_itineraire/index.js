import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as request from '../../common/requests/request.js';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GetGeoJSON() {
    const navigate = useNavigate();
    const [output, setOutput] = useState('');
    try {
        const location = useLocation();
        const searchParams = new URLSearchParams(location.search);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
    
        request.TryGetItineraire(from, to)
            .then((result) => {
                setOutput(result || '')
            })
            .catch((error) => console.error('Error fetching output:', error));
    }
    catch(e)
    {
        alert("There was an error while loading your request");
        navigate('/');
    }
};