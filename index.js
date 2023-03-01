let express=require('express');
let bodyparser=require('body-parser');
const mongoose = require('mongoose');
let isConnected=false;
mongoose.connect("mongodb://localhost:27017/itemsDB", {useNewUrlParser: true}).then(() => {
    console.log('Connected to Database!!')
    isConnected=true
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB', err) 
isConnected=false})

mongoose.set('strictQuery', true);

let app=express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));



const itemsSchema = new mongoose.Schema({
name:String
});
const Items = mongoose.model("Item",itemsSchema);



const workSchema = new mongoose.Schema({
    name:String
    });
    const Works = mongoose.model("Work",workSchema);




app.get('/',async function (req,res){
    if(isConnected)
 {
    let founItem= await Items.find().catch((e)=>{console.log(e)});
 
let today=new Date();

    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }

   
    let day=today.toLocaleDateString("en-us",options);
    res.render('list',{listTitle:day,getItems:founItem})}
    else{
        res.write("Error while connecting DB ...")
        res.end()}


})
app.post('/',function(req,res){


    if(req.body.list==="Work"){
        let workitem=req.body.newItem;
      const item3= new Works({
        name:workitem
      })
      item3.save();
        res.redirect('/work')
    }
    else{
        let itemName = req.body.newItem;
        const item2 = new Items({
            name:itemName
        })
        item2.save();
       
        res.redirect('/')
    }

})
app.get('/work', async function(req,res){
    
    let foundwork= await Works.find();
    
    res.render('list',{listTitle:"Work List",getItems:foundwork})
  
})
app.post('/delete',async function(req,res){

    const checkedItemId =req.body.delete;
    let listName=req.body.name
    
    if(req.body.list==="Work List"){

 let deleteitem=await Works.findByIdAndRemove(checkedItemId).catch((e)=>{console.log(e)}).then(()=>{console.log("Work deleted")});
 res.redirect('/work')
    }
    else{
        
 let deleteitem=await Items.findByIdAndRemove(checkedItemId).catch((e)=>{console.log(e)}).then(()=>{console.log("Item deleted")});
   res.redirect('/')
    }

})
app.get('/about',function(req,res){
    res.render('about')
})
app.listen( process.env.PORT || 3000,function(){
    console.log("listening On Port 3000 ");
})
