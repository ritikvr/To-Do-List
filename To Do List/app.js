const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const app=express();
const _=require("lodash");

const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://your name registered in mongodb atlas:passwordxxxxxxxx.mongodb.net/toDoListDB");

const itemsSchema=new mongoose.Schema({
    name:String
});

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome to the new To Do List."
});
const item2=new Item({
    name:"Hit the + button to add a new item."
});
const item3=new Item({
    name:" Tick the checkbox to delete an item."
})
const item4=new Item({
    name:"Type the new List name you want to create in url like localhost:3000/workList"
})
const defaultItems=[item1,item2,item3,item4];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    let Day=date.getDay();
    Item.find().then((items)=>{
        if(items.length===0)
        {
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else
        {
        res.render("list",{ListTitle:Day,newListItems:items});
        }
    })
});
app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const newItem=new Item({
        name:itemName
    });
    if(listName===date.getDay())
    {
        newItem.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name:listName}).then((foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+listName);
        }).catch((err)=>{
            console.log(err);
        });
    }
});

app.post("/delete",function(req,res){
    const delItemId=req.body.checkbox;
    const listName=req.body.listName;
    if(listName===date.getDay())
    {
        Item.deleteOne({_id:delItemId}).then();
        res.redirect("/")
    }
    else
    {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:delItemId}}}).then();
        res.redirect("/"+listName);
    }
    
});

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});

const List=mongoose.model("List",listSchema);

app.get("/:CustomList",function(req,res){
    const CustomListName=_.capitalize(req.params.CustomList);

    List.findOne({name:CustomListName}).then((foundList)=>{
        if(!foundList)
        {
            const list=new List({
                name:CustomListName,
                items:defaultItems
            });
            list.save();
            res.redirect("/"+CustomListName);
        }
        else
        {
            res.render("list",{ListTitle:foundList.name,newListItems:foundList.items});
        }
    }).catch((err)=>{
        console.log(err);
    });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("success");
});