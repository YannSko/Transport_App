import React, { useState } from 'react';
import axios from 'axios';

export default function prediction() {
  const [inputData, setInputData] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/prediction', { data: inputData });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Erreur lors de la récupération des prédictions :', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputData} onChange={(e) => setInputData(e.target.value)} />
        <button type="submit">Prédire</button>
      </form>
      {prediction && <p>Résultat de la prédiction : {prediction}</p>}
    </div>
  );
}