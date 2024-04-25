import axios from "axios";


// export const TryInputAddress = async (data) => {
//     return axios({
//         method: 'put',
//         url: 'http://localhost:3001/getAddress?q=1+rue',
//         data: data,
//     })
//     .then((res) => {
//         return({status: res.status})
//     })
//     .catch((res) => {
//         return({status: res.response.status, data: res.response.data})
//     })
// }

export const TryInputAddress = (query) => {
    return axios
      .get('http://localhost:3001/getAddress', {
        params: { q: query },
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data; // Return the data on success
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .catch((error) => {
        throw new Error(`Error during API call: ${error.message}`); // Handle errors
      });
  };