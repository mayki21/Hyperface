const express=require("express")
require("dotenv").config()
const connection=require("./connection/db");
const cors=require("cors");
const app=express()

app.use(express.json())
app.use(cors())


app.use("/users", userRouter)

app.use("/auth",authrouter)



app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("connected to DATABASE");
    } catch (error) {
        console.log(error);
        
        
    }
    console.log(`listening on port ${process.env.port}`);
})
