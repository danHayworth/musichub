const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');


// Display Song create form on GET.
exports.user_create_get = function(req, res, next) {  
    res.render('user_form', { title: 'Create User'});
    
};

exports.user_create_post = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exists'
            })
        } else {
            if(req.body.pass1 !== req.body.pass2){
                return res.status(409).json({
                    message: "Passwords don't match!"
                })
            } else {
                const password = req.body.pass1;
                bcrypt.hash(password, 10, (err, hash) => {
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
                })
            };
        }
    }) ;
};  

exports.user_login_get = function(req, res, next) {  
    res.render('user_login', { title: 'Create User'});
    
};


exports.user_login_post = (req, res, next) => {
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
                process.env.JWT_PASS,
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


exports.user_delete_post = (req, res, next) => {
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

    