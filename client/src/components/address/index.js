import * as request from '../../common/requests/request.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{
          height: '10rem',
          width: '25rem',
          position: 'absolute',
          margin: 'auto',
          backgroundColor:'white',
          borderRadius: '10px',
          padding: '1rem',
          zIndex: 2,
        }}>
          <form style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          
          }}>
            <label>
              <input
                style={{
                  boxSizing: 'border-box',
                  border: '2px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                type="text"
                placeholder='origin'
                value={firstInputValue}
                onChange={(e) => handleInputChange(e, setFirstInputValue, setFirstOutput)}
              />
            </label>
            <br />
            <label>
              <input
              style={{
                boxSizing: 'border-box',
                border: '2px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
                type="text"
                placeholder='destination'
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
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '0.5rem',
          }}
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
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '0.5rem',
            }}
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
