const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        console.log("file",file)
        cb(null,"src/Uploads")
    },
    filename:function(req,file,cb){
        const fileName =`${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }
})

 const allowedTypes =['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']

 const fileFilter =(req,file,cb)=>{
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Upload proper file format"),false)
    }
 }

 const Upload =multer({
    storage:storage,
 })

 module.exports=Upload