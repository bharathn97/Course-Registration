import Faculty from "../../models/Faculty";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      //Get all the faculties
      const faculties = await Faculty.find({});
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Error fetching faculties:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
