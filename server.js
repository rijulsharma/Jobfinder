const express = require('express');
const mongoose = require("mongoose");
const app = express();

app.get("/", (req,res) => {
  console.log("hi we are in / route");
});

const PORT = 3001;

//connect to db
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Db connected!"))
    .catch((error) => console.log("Failed to connect", error));

//health api
app.get("/health", (req, res) => {
    res.json({
        service: "job listing server",
        status: "Active",
        time: new Date(),
    });
});


app.listen(PORT, () =>{
   console.log(`server is running at ${PORT}`);
});




