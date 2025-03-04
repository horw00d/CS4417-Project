require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes/routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/routes', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runnin on port ${5000}`));
