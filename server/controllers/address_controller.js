import * as addressModel from '../models/address_model.js'

export async function getAddressController(req, res){
    addressModel.getAddressModel(req)
    .then((output) => {
        console.log('Output:', output);
        res.status(200).send(output)
    })
    .catch((error) => {
        res.status(500).send(error)
    });
}