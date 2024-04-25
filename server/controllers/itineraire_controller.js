// https://api.navitia.io/v1/journeys?from=-122.4752;37.80826&to=-122.402770;37.794682
// https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/journeys?from=2.3865494;48.8499182&to=2.3643739;48.854

require('dotenv').config();

// const apiKey = process.env.IDF_key;
const apiKey = "XglKdcGug0EUZUkb1cixn2x2BcmR3P37"
const axios = require("axios");

const fs = require('fs');

const Base_url = "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia";
let url = "/journeys?from=2.2894840;48.8796547&to=2.3264231;48.8656213"

const axiosInstance = axios.create({
    baseURL: Base_url,
    headers: {
      'apiKey': apiKey,
    },
  });
  
  axiosInstance.get(url)
    .then(response => {
      console.log('Response data: success ✔');
      let data = JSON.stringify(response.data.journeys[0].sections[1].geojson, null, 2);
      fs.writeFile('itin.json', data, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File written successfully');
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });