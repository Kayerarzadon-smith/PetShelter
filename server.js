// Require the Express Module
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/PetShelterdb');
var validate = require('mongoose-validator')
var extend = require('mongoose-validator').extend
const ObjectId = require('mongodb').ObjectID;

const PetSchema = new mongoose.Schema({
    name: { type: String, required:[true, '{PATH} is required'], minlength: 2},
    type: { type: String, required:true, minlength:2 }, 
    description: { type: String, required: true, minlength: 5 },
    skillone: { type: String, required: true, minlength: 2 }, 
    skilltwo: { type: String, required: true, minlength: 2 },
    skillthree: { type: String, required: false, minlength: 2 },
    likes: {type: Number, min: 0}},
    
    {timestamps: true});

const Pet = mongoose.model('Pet', PetSchema);

// Use native promises
mongoose.Promise = global.Promise;

// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static( __dirname + '/AngualrApp/dist' ));

// Require path
const path = require('path');
// app.use(express.static(path.join(__dirname, './static')));



app.get('/pets', function(req, res) {
    Pet.find({}, function(err, pets) {
        if(err){
            console.log("error retrieving pets");
            res.json({message: "Error", error: err})
        } else {
            res.json({message: "Success", data: pets})
        }
    })
})



app.post('/pets', function(req,res) {
    let pet = new Pet(req.body);
    pet.likes = 0;
    pet.save(function (err) {
        if (err) {
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success"});
        }
    });
});



app.get('/pets/:id', function(req,res) {
    console.log("ID " + req.params.id);
    Pet.findOne({_id: ObjectId(req.params.id)}, function(err,pet) {
        console.log(pet);
        if (err) {
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success", pet: pet});
        }
    })
})




// app.put('/pets/:id', function(req,res){
//     Pet.update({_id: ObjectId(req.params.id)}, req.body, function (err, pet){
//         if (err){
//             res.json({message: "Error", error: err})
//         } else {
//             res.json({message: "Success - Pet Updated"})
//         }
//     });
// })

app.put('/pets/:id', function(req,res) {
    Pet.findOne({_id: ObjectId(req.params.id)}, function(err,pet) {
        if (err) {
            res.json({message: "Error", error: err});
        } else {
            pet.name = req.body.name;
            pet.type = req.body.type;
            pet.description = req.body.description;
            pet.skillone = req.body.skillone;
            pet.skilltwo = req.body.skilltwo;
            pet.skillthree = req.body.skillthree;
            console.log(pet);
            pet.save(function(err) {
                if (err) {
                    res.json({message: "the minimum price wasn't met, now redirecting to dashboard", error: err});
                } else {
                    res.json({message: "Thanks for updating"});
                }
            })
        }
    })
})


app.delete('/pets/:id', function(req,res) {
    Pet.findByIdAndRemove({_id: ObjectId(req.params.id)}, function(err,pet) {
        if (err) {
            res.json({message: "Error", error: err});
        } else {
            res.json({message: "Success"});
        }
    });
})


app.post('/pets/:id/like', function(req, res){
    console.log("fiting the like round, dude!");
    Pet.findOneAndUpdate(
        {_id: req.params.id},
        {$inc: { 'likes': req.body.change}},
        function(err, numAffected){
            if (err){
                res.json({message: "Error", error: err});
            } else {
                res.json({message: "Success dude!"});
            }
        }
    )
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./AngualrApp/dist/index.html"))
  });

app.listen(7000, function() {
    console.log("listening on port 7000");
})


