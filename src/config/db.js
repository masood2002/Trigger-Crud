import mongoose from "mongoose";
const Url = "mongodb://localhost:27017";
const dbCon = async () => {
  try {
    await mongoose.connect(Url);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    console.log("connection fail");
  }
};

export default dbCon;
