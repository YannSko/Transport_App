const express = require('express');
const app = express();
const cors = require('cors');
// set up pyspark
const { exec } = require('child_process');

app.use(cors())

app.listen(3001, () => {
    console.log("✅ : App connected to port 3001\n");
})

app.get('/', (req, res) => {
      res.send('Hello from our server!')
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

