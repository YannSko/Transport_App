import axios from "axios";

export const TryInputAddress = (query) => {
    return axios
      .get('http://localhost:3001/getAddress', {
        params: { q: query },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data; 
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .catch((error) => {
        throw new Error(`Error during API call: ${error.message}`);
      });
  };

export const TryGetItineraire = (from, to) => {
    return axios
      .get('http://localhost:3001/getItineraire', {
        params: { from: from, to: to },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data; 
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .catch((error) => {
        throw new Error(`Error during API call: ${error.message}`);
      });
}