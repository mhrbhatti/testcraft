const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const questionsRouter = require('./routes/questions');
const generateRouter  = require('./routes/generate');
const exportRouter    = require('./routes/export');
const boardRouter     = require('./routes/board');
const authRouter      = require('./routes/auth');
const studentRouter   = require('./routes/student');
const adminRouter     = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testcraft';

app.use(cors());
app.use(express.json());

app.use('/api/questions', questionsRouter);
app.use('/api/generate',  generateRouter);
app.use('/api/export',    exportRouter);
app.use('/api/board',     boardRouter);
app.use('/api/auth',      authRouter);
app.use('/api/student',   studentRouter);
app.use('/api/admin',     adminRouter);

app.get('/', (req, res) => res.json({ status: 'TestCraft API running' }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
