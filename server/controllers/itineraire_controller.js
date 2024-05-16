// https://api.navitia.io/v1/journeys?from=-122.4752;37.80826&to=-122.402770;37.794682
// https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/journeys?from=2.3865494;48.8499182&to=2.3643739;48.854

import * as itineraireModel from '../models/itineraire_model.js'

export async function getItineraireController(req, res){
    itineraireModel.getItineraireModel(req)
    .then((output) => {
        JSON.stringify(output)
        res.status(200).send(output)
    })
    .catch((error) => {
        res.status(500).send(error)
    });
}