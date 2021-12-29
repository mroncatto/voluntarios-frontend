const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');


app.use(express.static(__dirname + '/dist/voluntario-frontend'));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname +
        '/dist/voluntario-frontend/index.html'));
});


const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
  }
app.use(cors(corsOptions));
app.listen(process.env.PORT || 8080);