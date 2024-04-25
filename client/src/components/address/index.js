import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as request from '../../common/requests/request.js';

export default function FindAddress() {
    const [firstInputValue, setFirstInputValue] = useState('');
    const [secondInputValue, setSecondInputValue] = useState('');
    const [firstIdValue, setFirstIdValue] = useState('');
    const [secondIdValue, setSecondIdValue] = useState('');
    const [firstOutput, setFirstOutput] = useState([]);
    const [secondOutput, setSecondOutput] = useState([]);
    const navigate = useNavigate();

    const handleInputChange = (event, setValue, setOutput) => {
        const newValue = event.target.value;
        setValue(newValue);
    
        request.TryInputAddress(newValue)
          .then((result) => {
            setOutput(result.places || []);
          })
          .catch((error) => console.error('Error fetching output:', error));
      };

    const handleSuggestionClick = (suggestion, setInput, setOutput, setId) => {
      try{
        setId(suggestion.address.coord.lon + ";" + suggestion.address.coord.lat);
        setInput(suggestion.name);
        setOutput([]);
      }
      catch(e)
      {
        alert("please choose a valid address");
      }
      
    };

    const handleButtonClick = () => {
      navigate('/itineraire?from=' + firstIdValue + '&to=' + secondIdValue);
    };

      return (
        <div>
          <form>
            <label>
              First Address:
              <input
                type="text"
                value={firstInputValue}
                onChange={(e) => handleInputChange(e, setFirstInputValue, setFirstOutput)}
              />
            </label>
            <br />
            <label>
              Second Address:
              <input
                type="text"
                value={secondInputValue}
                onChange={(e) => handleInputChange(e, setSecondInputValue, setSecondOutput)}
              />
            </label>
            <br />
            <button type="button" onClick={handleButtonClick}>
              Click Me
            </button>
          </form>
          <div
          onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
          onMouseLeave={(e) => (e.currentTarget.style.cursor = 'default')}
          >
            {firstOutput.length > 0 ? (
            firstOutput.map((item, index) => (
                <p key={index}
                onClick={() => handleSuggestionClick(item, setFirstInputValue, setFirstOutput, setFirstIdValue)}>
                {item.name}
                </p>
            ))
            ) : (
            <p></p>
            )}
        </div>
        <div
          onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
          onMouseLeave={(e) => (e.currentTarget.style.cursor = 'default')}
          >
            {secondOutput.length > 0 ? (
            secondOutput.map((item, index) => (
                <p key={index}
                onClick={() => handleSuggestionClick(item, setSecondInputValue, setSecondOutput, setSecondIdValue)}>
                {item.name}
                </p>
            ))
            ) : (
            <p></p>
            )}
        </div>
        </div>
      );
    }
