const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const commentsRoute = require('./routes/comments')


app.use(cors())
const corsOption = {
    origin: '*',
    credential: true

};

app.use(cors(corsOption));

const ConnectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!");
    }
    catch(err){
        console.log(err);
    }
}

//middleware
dotenv.config()
app.use(express.json())

app.use("/images", express.static(path.join(__dirname , "/images")))
console.log(cors())

app.use(cookieParser())
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/comments", commentsRoute)

//upload img
const storage = multer.diskStorage({
    destination:(req,file,fn) => {
        fn(null, "image")
    },
    filename: (req,file,fn) => {
        fn(null, req.body.img)
    }
})

const upload = multer({storage:storage})
app.post("api/upload",upload.single("file"), (req,res) => {
    req.status(200).json("Image uploaded successfully")
})


app.listen(process.env.PORT,() => {
    ConnectDB();
    console.log("App listening on port "+ process.env.PORT);
})
 
