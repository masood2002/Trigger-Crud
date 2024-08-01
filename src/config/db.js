import mongoose from "mongoose";
const Url =
  "mongodb+srv://masood:masood123@cluster0.wbgi0tq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
