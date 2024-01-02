const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Create express app 
const app = express();

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notes', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err=> console.error('Failed to connect to MonogoDB', err));

// Define Note schema
const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        deafult: Date.now
    }
});

app.get('/notes', (req, res) => {
    Note.find()
        .then(notes => res.json(notes))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Create Note model
const Note = mongoose.model('notes',noteSchema);

// Middleware
app.use(bodyParser.json());

//API Endpoint

// Create Note
app.post('/notes', (req,res)=>{
    const {title,content } = req.body;

    const note = new Note({
        title,content
    });

    note.save()
    .then(note => res.json(notes))
    .catch(err => res.status(500).json({error: err.message}));
});

//Retrive Signle Note
app.get('/notes/:id', (req,res) => {
    const {id} = req.params;

    Note.findById(id)
    .then(note => {
        if (!note) {
            return res.status(404).json({ error: 'Note not found '});
        }
        res.json(note);
    })
    .catch(err => res.status(500).json({error: err.mesage}));
});

// Update Note
app.put('/notes/:id', (res,req) => {
    const { id } = req.params;
    const {title,content} = req.body;

    Note.findByIdAndUpdate(id, {title, content, updatedAt: Date.now()}, {new: true})
    .then(updateNote => {
        if (!updateNote){
            return res.status(404).json({ erorr: 'Note not Found'});
        }
        res.json(updateNote);
    })
    .catch(err => res.status(500).json({ error: err.message}));
});

// Delete Note
app.delete('/notes/:id', (req,res) => {
    const {id}= req.params

    Note.findByIdAndDelete(id)
    .then(deleteNote => {
        if (!deleteNote){
            return res.status(404).json({
                error: 'Note not Found'
            });
        }
        res.json({ message: 'Note deleted Successfully'});
    })
    .catch(err => res.status(500).json({error: err.message}));
})

//Start the server
app.listen(3000 , () => {
    console.log('Server started on port 3000');
});
