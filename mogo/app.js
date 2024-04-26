const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'contactsDB';


app.set('view engine', 'pug');


MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  console.log('Connected to MongoDB');
  const db = client.db(dbName);

  const requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
  }


  app.use(requestTime);

  app.get('/', (req, res) => {
    db.collection('contacts').find({}).toArray((err, contacts) => {
      if (err) throw err;
      res.render('index', { contacts: contacts });
    });
  });

  app.get('/contact/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    db.collection('contacts').findOne({ id: contactId }, (err, contact) => {
      if (err) throw err;
      res.render('contact', { contact: contact });
    });
  });


  app.get('/contacts18', (req, res) => {
    db.collection('contacts').find({ age: { $gt: 18 } }).toArray((err, contacts) => {
      if (err) throw err;
      res.render('index', { contacts: contacts });
    });
  });

  app.get('/contacts18ah', (req, res) => {
    db.collection('contacts').find({ age: { $gt: 18 }, name: { $regex: /ah/i } }).toArray((err, contacts) => {
      if (err) throw err;
      res.render('index', { contacts: contacts });
    });
  });
  app.get('/update/:id', (req, res) => {
    const contactId = parseInt(req.params.id);
    db.collection('contacts').updateOne({ id: contactId }, { $set: { firstName: 'Kefi Anis' } }, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.get('/delete', (req, res) => {
    db.collection('contacts').deleteMany({ age: { $lt: 5 } }, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });


  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});