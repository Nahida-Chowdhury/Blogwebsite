const express = require("express")
const router = express.Router()
const User = require('../models/User')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')


///Register
router.post("/register", async(req, res) => {
    try{
        const {username,email,password} = reg.body
        const salt = await bcyrpt.genSalt(10)
        const hashedpassword = await bcyrpt.hashSync(password,salt)
        const newUser = new User({
            username,email,password:hashedpassword
        })
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)    
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
)


///Login
router.post("/login", async(req, res) => {
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match = await bcyrpt.compare(req.body.password, user.password)
        if(!match)
        {
            return res.status(401).json("Wrong Password")
        }
        const token = jwt.sign({_id, username:user.username, email:user.email}, process.env.SECRET, {expiresIn: "3d"})
        const {password, ...info} = user._doc
        res.cookie("token",token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',

        }).status(200).json(info)
    }
    catch(err)
    {
        res.status(500).json(err)
    }
}
)


///LogOut
router.get("/logout", async(req,res) => {
    try{
        res.clearCookie("token", {
            sameSite: 'None',
            secure: true,
        }).status(200).send("User logged out successfully")
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})

//Refatch

router.get("/refatch", async(req,res) => {
    const token = req.cookie.token
    jwt.verify(token, process.env.SECRET, {}, async(err, data) => {
        if(err)
        {
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports=router