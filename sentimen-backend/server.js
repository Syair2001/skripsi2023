const express = require('express');
const cors = require('cors');
const sentimenRoutes = require('./routes/sentimen.routes')
const networkRoutes = require('./routes/network.routes')
const db = require("./models");
const loginController = require('./controllers/login.controller');
const cookieParser = require('cookie-parser');
const { getAllSentimen } = require('./controllers/sentimen.controller');
const isAutenticated = require('./middleware/isAuthenticated');
const logoutController = require('./controllers/logout.controller');
const { getAllNetwork } = require('./controllers/network.controller');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Atur asal yang diperbolehkan
  credentials: true, // Izinkan kredensial (cookies)
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser())

db.sequelize.sync();

app.get('/', (req, res) => {
  res.json({
    message: "It's Work"
  })
})

app.post('/login', loginController)
app.get('/logout', isAutenticated, logoutController)

app.use('/sentimen', sentimenRoutes)
app.use('/network', networkRoutes)
app.get('/list-sentimen', isAutenticated, getAllSentimen)
app.get('/list-network', isAutenticated, getAllNetwork)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}.`);
})