const express = require('express');
        const mongoose = require('mongoose');
        const cors = require('cors');
        const bodyParser = require('body-parser');
        
        const app = express();
        
        // Middleware
        app.use(cors());
        app.use(bodyParser.json());
        
        // Connect to MongoDB
        mongoose.connect('mongodb://localhost:27017/bookshelf');

        
        // Book Schema
        const bookSchema = new mongoose.Schema({
            title: { type: String, required: true },
            author: { type: String, required: true },
            genre: { type: String, required: true },
            publishedYear: Number,
            pages: Number,
            isbn: String,
            read: { type: Boolean, default: false },
            favorite: { type: Boolean, default: false },
            description: String,
            coverUrl: String
        });
        
        const Book = mongoose.model('Book', bookSchema);
        
        // Routes
        app.get('/api/books', async (req, res) => {
            try {
                const books = await Book.find();
                res.json(books);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
        
        app.post('/api/books', async (req, res) => {
            const book = new Book(req.body);
            
            try {
                const newBook = await book.save();
                res.status(201).json(newBook);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
        
        app.put('/api/books/:id', async (req, res) => {
            try {
                const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(book);
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
        
        app.delete('/api/books/:id', async (req, res) => {
            try {
                await Book.findByIdAndDelete(req.params.id);
                res.json({ message: 'Book deleted' });
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
        
        // Start server
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        
    
