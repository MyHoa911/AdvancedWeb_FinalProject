const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const roomsRoutes = require('./routes/rooms.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});