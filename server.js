const express = require('express');
const app = express();

const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const path = require('path');
const exjwt = require('express-jwt');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




const PORT = 3000;

const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256'],
});

let users = [
    {
        id: 1,
        username: 'mahith',
        password: '123'
    },
    {
        id: 2,
        username: 'katta',
        password: '456'
    }
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let token;
    for (let user of users) {
        if (username == user.username && password == user.password) {
            token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '300s' });
            break;
        }
    }
    if (token) {
        res.json({
            success: true,
            err: null,
            token
        });
    }
    else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Incorrect Username or password'
        });
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });

});

app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Price is $343'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialErr: err,
            err: 'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});


app.listen(PORT, () => {
    console.log(`Serving at ${PORT}`);
});