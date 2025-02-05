const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/gaming_platform', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Multer Configuration for Image Uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error("Only images are allowed!"));
    }
});

// Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const gameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    releaseDate: { type: Date, default: Date.now },
    publisher: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
});
const Game = mongoose.model('Game', gameSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
        
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '24h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Game Routes
app.get('/api/games', async (req, res) => {
    try {
        const { category, featured, trending, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (featured) query.featured = featured === 'true';
        if (trending) query.trending = trending === 'true';
        if (search) query.title = { $regex: search, $options: 'i' };
        const games = await Game.find(query);
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/games/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid game ID' });
        }
        const game = await Game.findById(req.params.id).populate('reviews.userId', 'username');
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Library Routes
app.post('/api/library/:gameId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const gameId = req.params.gameId;

        if (user.library.includes(gameId)) {
            return res.status(400).json({ message: 'Game already in library' });
        }

        user.library.push(gameId);
        await user.save();
        res.json({ message: 'Game added to library' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
