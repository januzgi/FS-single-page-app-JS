// CRU toteutus expressillä (COPY READ UPDATE)
const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// Nämä on kaikkialla, ei väliä mitä appin alaista osoitetta kutsuttiin
app.use(express.static('public'));
app.use(bodyParser.json()); // Onko application.json kun tulee headerit
// Tämä lisää requestiin sen bodyn

// Periaatteissa on vain app.use ja app.config expressissä
// Express ketjuttaa funktioita eli välittää eteenpäin tai palauttaa vastauksen

// Tietokanta
let database = [];
let id = 100;

// res:iin voi laittaa joitain omia cookieita
// app.use((req, res, next) => {
//   console.log('I am a filter');
//   return next();
// });

// Content REST API
// tähän voi tehdä filtteriketjun (req, res, next)
// next on funktio, jota voi esim käyttää filtterinä, että onko e. oikeuksia
// tarkistetaan onko headerissä oleva tokeni mukana
// ja jos on niin mennään next:iin
app.get('/api/shopping', (req, res) => {
  return res.status(200).json(database); // Lähetä status 200 ja tietokanta
}); // eli app.use mutta wräpätty helpommaksi

app.post('/api/shopping', (req, res) => {
  let item = {
    id: id,
    type: req.body.type,
    count: req.body.count,
    price: req.body.price,
  };
  id++;
  database.push(item);
  console.log(database);
  return res.status(200).json({ message: 'ok' });
});

app.delete('/api/shopping/:id', (req, res) => {
  let tempId = parseInt(req.params.id, 10); // parseta kymmenjärjestelmään
  for (let i = 0; i < database.length; i++) {
    if (tempId === database[i].id) {
      database.splice(i, 1); // kohta, montako, eli poistaa kohdasta i yhden
      return res.status(200).json({ message: 'ok' });
    }
  }
  return res.status(404).json({ message: 'not found' });
});

app.listen(3000);

console.log('Running in port 3000.');
