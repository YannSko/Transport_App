import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Prediction( {journey} ) {
  const [journeyData, setJourneyData] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState([]);

    
  
  useEffect(() => {
    setJourneyData(journey)
    const extractedData = extractPhysicalModeAndCode(journeyData);
    setResult(extractedData);
    handleSubmit('TRAM 1');
  }, []);

    const handleSubmit = async (e) => {
      try {
        const response = await fetch('http://localhost:5000/prediction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: inputData }),
        });
        const result = await response.json();
        setPrediction(result.prediction);
        console.log(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des prédictions :', error);
      }
    };

    const extractPhysicalModeAndCode = (journeyData) => {
      if (!Array.isArray(journeyData)) {
        console.error('Data should be an array');
        return [];
      }

      return journeyData
        .map(item => item.properties)
        .filter(properties => {
            return properties.physical_mode && properties.code &&
                  ["Métro", "Tramway", "RER"].includes(properties.physical_mode);
        })
        .map(properties => `${properties.physical_mode.toUpperCase()} ${properties.code}`);
          
    };
    return (
      <div>
         {result.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
        {prediction ? prediction : ("")}
      </div> 
    );
}