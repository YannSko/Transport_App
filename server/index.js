import * as addressController from './controllers/address_controller.js';
import * as itineraireController from './controllers/itineraire_controller.js';

import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.get('/getAddress', addressController.getAddressController);

app.get('/getItineraire', itineraireController.getItineraireController);

app.listen(3001, () => {
    console.log("✅ : App connected to port 3001\n");
})



// pour execute un script pyspark
app.post('/run-spark-job', (req, res) => {
    exec('spark-submit script.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`error: ${error.message}`);
            return res.status(500).send({ message: "Erreur lors de l'exécution du script PySpark" });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send({ message: stderr });
        }
        res.send({ message: stdout });
    });
});

