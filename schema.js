const mongoose=require("mongoose")
const pschema=new mongoose.Schema({
  pid:Number,
  pname:String,
  pprice:Number,
  pcat:String,
  pdesc:String,
  pimage:String  
})
module.exports=mongoose.model("ptable",pschema)