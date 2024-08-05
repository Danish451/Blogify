const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const path = require("path")
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const cookieParser = require('cookie-parser')
const app = express()

const PORT = process.env.PORT || 3000
mongoose.connect(process.env.MONGO_URL)
.then((e) => console.log("MongoDB Connected"))

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const { checkForAuthenticationCookie } = require("./middlewares/auth")

app.set('view engine', "ejs")
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))


app.use('/user', userRoute)
app.use('/blog', blogRoute)
app.use(express.static(path.resolve('./public')))

app.get('/', async(req, res)=>{
    const allBlogs = await Blog.find({})  // -1 means descending sort
    return res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
})
app.listen(process.env.PORT, ()=> console.log(`Server Started at PORT: ${PORT}`))
