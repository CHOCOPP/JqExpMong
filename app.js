var express = require("express");
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var fs=require("fs");
var app=express();
var MongoClient=mongodb.MongoClient;
var dbUrl="mongodb://localhost:27017";
var urlencodedParser=bodyParser.urlencoded({extend:false});

//创建express实例
var app=express();

//接收post请求
var urlencodedParse=bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());

//设置静态资源
app.use(express.static("./public"));
app.use(express.static("./view"));

var router=require("./routes");
//console.log("router:",router);
//console.log("__dirname:",__dirname+"/public/js/jquery-1.11.3.min.js");
router(app,__dirname);

app.get("/getData",function (req,res) {
    getDb(res);
})

app.post("/addPost",urlencodedParser,function (req,res) {
    var obj=req.body;
    addPost(obj);
})


//添加mongodb
function addPost(obj) {
    MongoClient.connect(dbUrl,{useNewUrlParser: true},function (err,client) {
        if (err) {
            console.log("连接数据库失败");
        } else{
            console.log("连接数据库成功");
            var dbase = client.db("loginAndReg");
            dbase.collection("reg").insert(obj,function (err,result) {
                if (err) {
                    console.log("数据添加到mongodb失败",err);
                } else{
					console.log("数据添加到mongodb成功",result);
                    client.close();
                }
            })
        }
    })
}



//获取mongodb
function getDb (res) {
    MongoClient.connect(dbUrl,{useNewUrlParser: true},function (err,client) {
        if (err) {
            console.log("连接数据库失败");
        } else{
            console.log("连接数据库成功");
            var dbase = client.db("loginAndReg");

            dbase.collection("reg").find().toArray(function (err,result) {
                if (err) {
                    console.log("数据添加到mongodb失败",err);
                } else{
                    console.log("数据添加到mongodb成功",result);
                    res.send(result);
                    client.close();
                }
            })
        }
    })

}
app.listen(8080,function(){
	console.log("OK 8080");
})
