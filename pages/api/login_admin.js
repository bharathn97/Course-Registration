import Admin from "../../models/Admin"; // Assuming admin is your mongoose model for admins
import connectDb from "../../middleware/mongoose";
var CryptoJS=require("crypto-js");
var jwt = require('jsonwebtoken');
require('dotenv').config();

const handler = async (req, res) => {
  if (req.method === "POST") {
    console.log(req.body);
    let admin=await Admin.findOne({"email":req.body.email});
    //Indetify the admin with help of email
    console.log(admin);
    if(admin){
      //Encrypt the password the user types in using Cypto-JS
      const bytes=CryptoJS.AES.decrypt(admin.password,process.env.SECRET);
       var originalText = bytes.toString(CryptoJS.enc.Utf8);
       console.log(originalText)
    if(req.body.email===admin.email &&  req.body.password===originalText)
    {
      //check whether the email and the encrypted password matches the one in the databse
      var token = jwt.sign({email:admin.email,name:admin.name},process.env.TOKEN_SECRET ,{
        expiresIn:"2d"
      });
      const email=admin.email;
      res.status(200).json({success:true,token,email});
    }
    else{
      res.status(200).json({success:false,error:"Invalid Credentials"});
    }
  }
  else{
    res.status(200).json({success:false,error:"No admin found"});
  }

  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

export default connectDb(handler);
