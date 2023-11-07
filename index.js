const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const usersRoutes = require("./routes/usersRoutes")
const advertisementRoutes = require("./routes/advertismentsRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const path = require("path")


const app = express();
dotenv.config();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use("/api", usersRoutes)
app.use("/api", advertisementRoutes);
app.use("/api", wishlistRoutes);

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