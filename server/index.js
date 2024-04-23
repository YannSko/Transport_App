const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors())

app.listen(3001, () => {
    console.log("✅ : App connected to port 3001\n");
})

app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

