import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connect(process.env.MONGLO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MONGLO connect");
    });

    connection.on("error", (error) => {
      console.log("error:", error);
      process.exit();
    });
  } catch (error) {
    console.log("something went wrong");

    console.log("error:", error);
  }
}
