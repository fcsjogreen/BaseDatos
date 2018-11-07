const http = require('http'),
      express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),      
      mongoose = require('mongoose'); 

const mongoDB ='mongodb://localhost/agenda';

const PORT =  process.env.PORT || 8082;
const app = express();
const Server = http.createServer(app);



mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.once('open', () => {
  console.log("Conected to DB");

  db.db.collection("user", function (err, collection) {
    collection.find({}).toArray(function (err, data) {
      //console.log(data); // it will print your collection data
    })
  });

}).on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(require('./rutas.js'));
app.use(express.static('client'));

Server.listen(PORT, function() {
  console.log('Server is listeng on port: ' + PORT)
})
