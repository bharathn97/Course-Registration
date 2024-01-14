import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
  try {
    if (mongoose.connections[0]?.readyState) {
      // Use the existing database connection
      return handler(req, res);
    }

    // Create a new connection if one doesn't exist
    await mongoose.connect("mongodb://127.0.0.1:27017/iris-db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
    return handler(req, res);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb;
