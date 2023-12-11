const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router");
const errorMiddleware = require("./middleware/error.middleware");

dotenv.config();
const PORT = process.env.PORT || 5040;
const app = express();

app.use(express.json());
app.use(cookieParser());
//в середині вказуєм з яким доменом потрібно обмінюватися куками
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.URL);

    app.listen(PORT, () => console.log(`Server started in port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
