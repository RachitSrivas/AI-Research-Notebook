const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');
const Note = require('./models/Note');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// --- AUTH ROUTES ---
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("SIGNUP ERROR:", error); // <-- Add this line!
        res.status(500).json({ error: "Email might already be in use." });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PROTECTED NOTE ROUTES ---
app.get('/api/notes', authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        // Call Mistral API for summarization
        const aiResponse = await axios.post("https://api.mistral.ai/v1/chat/completions", {
            model: "mistral-tiny",
            messages: [{ role: "user", content: `Summarize the following research note in exactly one concise sentence: "${content}"` }]
        }, {
            headers: { 
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                "Content-Type": "application/json" 
            }
        });

        const aiSummary = aiResponse.data.choices[0].message.content;

        const note = new Note({
            userId: req.user.id,
            content,
            aiSummary
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error("AI or DB Error:", error);
        res.status(500).json({ error: "Failed to process note" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));