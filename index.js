const express = require("express")
const cors= require("cors")
const dotenv= require("dotenv")
dotenv.config()
const connectDB= require("./config/db")
const authRoutes = require("./routes/authRoutes")
const adminRoutes= require("./routes/adminRoutes")
const userRoutes= require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require("./routes/cartRoutes")
const orderRoutes=require("./routes/orderRoutes")
const paymentRoutes= require("./routes/paymentRoutes")


//middleware
const app = express()
app.use(express.json())
app.use(cors(
    {
    origin:"https://shopeasebylingareddy.netlify.app/",
    credentials:true
    }
))


app.get("/" ,(req, res)=>res.send("API IS RUNNING"))
app.use("/api/auth",authRoutes)
app.use("api/admin",adminRoutes)
app.use("api/user",userRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

const serverstart = async ()=>{
    try{
    await connectDB()
     app.listen(5000,()=> console.log("server is running at 5000"))
    }
    catch(error)
    {
        console.log(error)
    }
}
serverstart()



