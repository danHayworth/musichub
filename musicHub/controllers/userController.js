const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');



exports.createNewUser = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exists'
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
                        email: req.body.email,
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


exports.createLogin = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Authentication failed '
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
                   email: user[0].email,
                   userId: user[0]._id                    
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
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


exports.deleteUser = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(res => {
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

    