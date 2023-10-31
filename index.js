const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const usersRoutes = require("./routes/usersRoutes")
const advertisementRoutes = require("./routes/advertismentsRoutes");


const app = express();
dotenv.config();

app.use(express.json());
app.use("/api", usersRoutes)
app.use("/api", advertisementRoutes);

const PORT = process.env.PORT || 5001;

const connectDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Server is connected to the database");
    } catch (error) {
      console.error("Error occurred while connecting to the database:", error.message);
    }
  };
  
  connectDb();

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
});  