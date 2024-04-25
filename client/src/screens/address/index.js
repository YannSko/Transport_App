import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as request from '../../common/requests/request.js'

export default function FindAddress() {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState([]);
  const [elements, setElements] = useState(null)

  // Function to call when the input value changes
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    request.TryInputAddress(newValue)
      .then((result) => setOutput(result.places))
      .catch((error) => console.error('Error fetching output:', error));
    
    setElements(output.map((item, index) => <p key={index}>{item.name}</p>));
  };

  return (
    <div>
      <form>
        <label>
          Type something:
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
        </label>
      </form>
      <div>
        {output ? <p>{elements}</p> : <p>Type something to see the result...</p>}
      </div>
    </div>
  );
};
