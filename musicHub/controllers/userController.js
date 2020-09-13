var User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


export const createNewUser = (req, res, next) => {
    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'username exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error:err
                    });
                } else {
                    let newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        password: hash
                    });
                    newUser
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created'
                            });
                        })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });   
                    })   ; 
                }
            });
        }
    }) ;
};  

export const createLogin = (req, res, next) => {
    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'authentication failed '
            });
        } 
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{

            if (err) {
                return res.status(401).json({
                message:"Authentication failed 1"
                });
            }  
            if (result) {
                const token = jwt.sign(
                {
                   username: user[0].username,
                   userId: user[0]._id                    
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: "Authentication successful",                    
                    token: token
                });
                
            }
            res.status(401).json({
               message: "Authentication failed 2"
            });
        });
    })
    .catch (err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    }); 
};  

    