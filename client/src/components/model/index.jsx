import React, { useState } from 'react';
import axios from 'axios';

export default function Prediction( {journey} ) {
    const [inputData, setInputData] = useState('');
    const [prediction, setPrediction] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
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
      } catch (error) {
        console.error('Erreur lors de la récupération des prédictions :', error);
      }
    };
    console.log(journey);
    return (
      <div>

        {/* <form onSubmit={handleSubmit}>
          <input type="text" value={inputData} onChange={(e) => setInputData(e.target.value)} />
          <button type="submit">Prédire</button>
        </form>
        {prediction && <p>Résultat de la prédiction : {prediction}</p>}*/}
      </div> 
    );
}