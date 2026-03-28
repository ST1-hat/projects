const express = require('express');
const path = require('path');
const { sequelize, ProfilePicture } = require('./models'); // import model too
const apiRouter = require('./routes/api');

const app = express();
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/certificates', express.static(path.join(__dirname, '..', 'frontend', 'certificates')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

// Sync all models (including ProfilePicture)
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});