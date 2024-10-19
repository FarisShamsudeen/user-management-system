const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
const session = require('express-session')
const nocache = require('nocache')


app.use(nocache())
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
     }
}))

app.set('Cache-Control', 'no-cache, no-store');
app.set('views', path.join(__dirname, 'Views'))
app.set('view engine', 'hbs')
app.use(express.static('Public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const userRoutes = require('./Routes/user')
const adminRoutes = require('./Routes/admin')
const connectDB = require('./DB/connectDB')

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req,res) => {
    res.send('Hello World')
})

app.get('*', (req,res) => {
    res.render('./error.hbs')
})

connectDB()

app.listen(PORT, () => {
    console.log(`Server listening http://localhost:${PORT}/user/login`);
})
