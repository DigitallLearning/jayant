const mongoose=require("mongoose")
const cschema=new mongoose.Schema({
  pname:String,
  pprice:Number,
  pimage:String
})
module.exports=mongoose.model("cart",cschema)