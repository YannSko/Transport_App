//API request
// https://api.navitia.io/v1/journeys?from=-122.4752;37.80826&to=-122.402770;37.794682
// https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/journeys?from=2.3865494;48.8499182&to=2.3643739;48.854

import * as common from '../common/common_function.js'

export function getItineraireModel(req){
    const axiosInstance = common.authHttpHeader()
    let url = "/journeys?from="+ req.query.to+"&to="+req.query.from
    
    return axiosInstance.get(url)
    .then(response => {
        console.log('Response data: success ✔');
        return response.data
    })
    .catch(error => {
        console.error('Error:', error);
        throw error
    });
}