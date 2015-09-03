// Set Up
var express   = require('express');
var app       = express();                    // Create our app w/express
var mongoose  = require('mongoose');          // mongoose for mongodb
var morgan    = require('morgan');          // Log requests to the console (express4)
var bodyParser= require('body-parser');     // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// config
mongoose.connect('mongodb://localhost/tasksia');    // connect to mongoDB database in localhost

app.use(express.static(__dirname + '/public'));                 // Set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// Define Model
// This is where you get to set what a "todo" looks like.
// This can be edited with ease thanks to mongoose.
/*
    Title: Title of task
    Urgency: number from 1 - 10 describing task urgency at users discretion.
    AssignDate: Date task entered the system.
    DueDate: Date task must be completed.
    SWP: Number from 1-3, School(1), Work(2), Personal(3). Organizes the task into three broad categories for later extension use.
 */
var Todo = mongoose.model('Todo', {
  title: String,
  urgency: Number,
  assigndate: String,
  duedate: String,
  swp: Number,
  tags: String
});

//...
// routes
  // api --
  // get all todos
  app.get('/api/todos', function(req, res) {
    // Use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)
      res.json(todos); // return all todos in JSON format
    });
  });  

  // Create todo and send back all todos after creation
  app.post('/api/todos', function(req, res) {
    // create a todo, information comes from AJAX request from Angular
    // This will take the Request body tag info and pass it into the this API.
    Todo.create({
      title:req.body.title,
      urgency:req.body.urgency,
      assigndate:req.body.assigndate,
      duedate:req.body.duedate,
      swp:req.body.swp,
      tags:req.body.tags,
      done: false
    }, function(err, todo) {
      if (err)
        res.send(err);
      // Send back todos with new one included!
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos); // Return todos in JSON format!
      });
    });
  });

  // Delete a todo
  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id : req.params.todo_id
    }, function (err, todo) {
      if (err)
        res.send(err);
      // get and return all the todos after you delete one.
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });
//...

//...
// application --
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
//...

// listen (start app with node server.js)
app.listen(8080);
console.log("app listening on port 8080");