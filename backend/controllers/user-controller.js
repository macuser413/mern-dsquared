const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")

const User = require("../models/User")
const Task = require("../models/Task")

router.post("/", (req, res) => {
    const { name, email, password } = req.body

    if(!email || !password){
        return(res.status(400).json({msg: "please fill out form"}))
    }

    User.findOne({ email: email })
        .then(user => {
            if(user){
                return res.status(400).json({msg: "User already exists"})
            }

            const newUser = new User({
                email,
                password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    newUser.password = hash
                    newUser.save()
                        .then(user => {
                            res.json({
                                user: {
                                    id: user._id,
                                    email: user.email
                                }
                            })
                        })
                })
            }
        })
    res.send("register")
})


module.exports = router