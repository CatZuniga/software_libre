

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

const mongoose = require('mongoose');
//const db = mongoose.connect('mongodb://127.0.0.1:27017/api_db');

const db = mongoose.connect('mongodb://127.0.0.1:27017/api_db', function (error) {
    if (error) console.log(error);

    console.log("connection db successful");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())




const { User, UserAllowedAttributes } = require('./models/userModel');

function getHostUrl(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}


///////GET///////////

app.get('/api/users', (req, res) => {
    User.find(function (err, users) {
        if (err) {
            handleError(res, err, 500);
        }
        res.json(users);
    });
});

function userParams(body) {
    // strong parameters
    var user = {};

    Object.keys(body).forEach((key) => {
        if (UserAllowedAttributes.indexOf(key) > -1) {
            user[key] = body[key];
        }
    });
    console.log(user);
    return user;
}

///////POST///////////

app.post('/api/users', (req, res) => {

    var user = userParams(req.body);
    user = new User(user);

    user.save(function (err) {
        if (err) {
            handleError(res, err, 422);
        }
        res.status(201);
        res.setHeader('location', `${getHostUrl(req)}?id=${user._id}`);
        res.json(user);
    });
});

///////Patch///////////


app.patch('/api/users', (req, res) => {
    var user = {};
    const userId = req.query.id;

    // check if user exists and if ID is valid
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        handleError(res, 'User not found', 404);
    }

    user = userParams(req.body, user);

    // execute the update
    User.findByIdAndUpdate(userId, user, {new: true}, (err, updatedUser) => {
        if(err) {
            handleError(res, err, 500);
        }
        res.status(200);
        res.json(updatedUser);
    });
});


app.listen(PORT, () => console.log('running on port 3000!'));