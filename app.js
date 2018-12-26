//Requiring NPM packages
const express  = require("express");
const exphbs   = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


//Init app variable
const app      = express();


//Map global Promise - get rid of warning on Mongoose

mongoose.Promise = global.Promise;

//Connecting with mongoose

mongoose.connect("mongodb://localhost/jotspot_dev");

//load IdeaModel

require("./models/Idea");
const Idea = mongoose.model('ideas');
 

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Index Route
app.get("/", function(req, res){
   const title = "Welcome";    
   res.render("index", {
       
       title: title
   }); 
    
});

// About Page

app.get("/about", function(req, res){
    res.render("about");
});

//Notes index page

app.get("/notes", function(req, res){
    Idea.find({})
        .sort({date: "desc"})
        .then(ideas => {
           res.render("notes/index", {
               ideas: ideas
           }); 
        
        });
     
});

//Add idea Form

app.get("/notes/add", function(req, res){
    res.render("notes/add");
});

//Edit Note Form

app.get("/notes/edit/:id", function(req, res){
    Idea.findOne({
       _id: req.params.id 
    })
    .then(idea => {
       res.render("notes/edit", {
          idea:idea 
       });
    });
});

//Process form to add note

app.post("/notes", function(req, res){
    let errors = [];
    if(!req.body.title){
        errors.push({text: "Please add a title"});
    }
    
    if(!req.body.details){
        errors.push({text: "Please add some details"});
    }
    
    if(errors.length > 0){
        res.render("notes/add", {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
        } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect("/notes");
            })
    }
});



//Node Server Code
const port    = "Cloud 9's Server";
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Your app is running on " + port);
    
});