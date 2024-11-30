const connection=require("./connection")
const pschema=require("./schema")
const cschema=require("./cartschema")
const rschema=require("./register")
const express=require("express")
const cors=require("cors")
const app=express()
const multer=require("multer")
const schema = require("./schema")
app.use(express.json())
app.use(cors())
app.use(express.static("public"))
const bcrypt=require("bcryptjs")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads/")
    },
    filename:(req,file,cb)=>{
      cb(null,file.originalname)
    }
})
const upload=multer({storage:storage}).single("pimage")
app.post("/",(req,resp)=>{
    upload(req,resp,(err)=>
    {
        if(err)
        {
            resp.send(err)
        }
        else
        {
            const newdata=new pschema({
                pid:req.body.pid,
                pname:req.body.pname,
                pprice:req.body.pprice,
                pcat:req.body.pcat,
                pdesc:req.body.pdesc,
                pimage:"http://localhost:4000/uploads/"+req.file.filename

            })
            newdata.save()
            resp.send("Save data") 
        }
    })
})
app.get("/",async(req,resp)=>{
    const data=await pschema.find()
    resp.send(data)
})
app.post("/register",(req,resp)=>
    {
      // resp.send("upload")
       upload(req,resp,async (err)=>{
           if(err)
           {
             console.log(err)
           }
           else{
              const passhash=await bcrypt.hash(req.body.pass,10)
               const newregister=new rschema({
                   name:req.body.name,
                   pass:passhash,
                   email:req.body.email,
                   mobile:req.body.mobile
                   
               })
               newregister.save()
                resp.send("File Uploaded")
           }
       })
    })
   
app.post("/login",async(req,resp)=>{
   
        const user = await rschema.findOne({ name: req.body.name });
        if (user) {
            const cmppass=await bcrypt.compare(req.body.pass,user.pass)
            if(cmppass)
                {
                 resp.send("Login sucessfully");
                }
                else
                {
                 resp.send("Invalid user id or pass" );
                }
        }
           else {
            resp.send("User deos not exitst" );
        }
     
})
app.post("/cart",(req,resp)=>{
    upload(req,resp,(err)=>
    {
        if(err)
        {
            resp.send(err)
        }
        else
        {
            const newdata1=new cschema({ 
                pname:req.body.pname,
                pprice:req.body.pprice,
                pimage:req.body.pimage
            })
            newdata1.save()
            resp.send("Save data") 
        }
    })
})
app.get("/cart",async (req,resp)=>{
   
            const data=await cschema.find()
            resp.send(data)
      
})
app.get("/search/:key",async (req,resp)=>{
   //console.log(req.params.key)
    const keydata=await schema.find({pid:req.params.key})
    resp.send(keydata)
})
app.listen(4000)