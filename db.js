var mongodb = require("mongodb"); //引入mongodb
var MongoClient = mongodb.MongoClient;
var dbUrl = "mongodb://localhost:27017";
var myDb = "mydb02";

//{useNewUrlParser:true}

/*
//版本1
MongoClient.connect(dbUrl,function(err, db) {
	if(err) {
		console.log("连接数据库失败"); //网络中断/数据库地址错误/端口号错误/数据服务没有启动
		res.send({
			msg: 0
		});
	} else {
		console.log("数据库连接成功");
		var dbase = db.db(myDb); //数据库名

		obj.id = getTime.getTime();

		dbase.collection(cName).insert(obj, function(err, result) {
			if(err) {
				console.log("数据添加到数据库失败");
				res.send({
					msg: 1
				});
			} else {
				console.log("数据添加到数据库成功", result);
				db.close();
				res.send({
					msg: 2
				});
			}
		})
	}
})
*/

 //第2个版本
 module.exports.insertOne1 = function(cName,obj,res,cb) {
	MongoClient.connect(dbUrl, function(err, db) {
		if(err) {
			console.log("连接数据库失败"); //网络中断/数据库地址错误/端口号错误/数据服务没有启动
			res.send({
				msg: 0
			});
		} else {
			console.log("数据库连接成功");
			var dbase = db.db(myDb); //数据库名
			dbase.collection(cName).insert(obj, function(err, result) {
				cb(err,result,db);
			})
		}
	})
}

//封装版本
//连接数据库
function connectMGDB(cb0,res){
	MongoClient.connect(dbUrl,function(err,db){
		if(err){
			console.log("连接数据库失败");
			res.send({
				msg:0
			});
			db.close();
		}else{
			var dbase=db.db(myDb);
			cb0(dbase,db);
		}
	})
}

//插入数据
module.exports.insert = function(cName,obj,res,cb) {
	connectMGDB(function(dbase,db){
		dbase.collection(cName).insert(obj,function(err,result){
			cb(err,result,db);
		})
	},res);
}

//查询符合条件的所有数据
module.exports.find = function(cName,whereObj,res,cb){
	whereObj.find?whereObj.find:whereObj.find={};
	whereObj.sort?whereObj.sort:whereObj.sort={};
	whereObj.limit?whereObj.limit:whereObj.limit=0;
	whereObj.skip?whereObj.skip:whereObj.skip=0;
	
	connectMGDB(function(dbase,db){
		dbase.collection(cName).find(whereObj.find).sort(whereObj.sort).skip(whereObj.skip).limit(whereObj.limit).toArray(function(err,result){
			cb(err,result,db);
		},res);
	});
}

//查询符合条件的一条数据
/*module.exports.findOne=function(cName,whereObj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).findOne(whereObj,function(err,result){
			cb(err,result,db);
		})
	})
}*/

//根据ID查找某一条数据
module.exports.findOneById=function(cName,obj,res,cb){
	//console.log("mongodb.ObjectId(obj.id):",mongodb.ObjectId(obj.id));
	var whereObj={};
	try{
		whereObj._id=mongodb.ObjectId(obj.id);
	}catch(err){
		console.log("你输入的ID不正确的!");
		whereObj._id="";
	}
	connectMGDB(function(dbase,db){
		dbase.collection(cName).findOne(whereObj,function(err,result){
			cb(err,result,db);
		})
	})
}

//删除符合条件的所有数据
module.exports.deleteMany=function(cName,obj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).deleteMany(obj,function(err,result){
			cb(err,result,db);
		})
	})
}

//根据ID删除某一条数据
module.exports.deleteOneById=function(cName,obj,res,cb){
	//console.log("mongodb.ObjectId(obj.id):",mongodb.ObjectId(obj.id));
	var whereObj={};
	try{
		whereObj._id=mongodb.ObjectId(obj.id);
	}catch(err){
		console.log("你输入的ID不正确的!");
		whereObj._id="";
	}
	connectMGDB(function(dbase,db){
		dbase.collection(cName).deleteOne(whereObj,function(err,result){
			cb(err,result,db);
		})
	})
}

//修改符合条件的所有数据
module.exports.updateMany=function(cName,whereObj,updateObj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).updateMany(whereObj,updateObj,function(err,result){
			cb(err,result,db);
		})
	})
}
//根据ID修改某一条数据
module.exports.updateOneById=function(cName,obj,updateObj,res,cb){
	//console.log("mongodb.ObjectId(obj.id):",mongodb.ObjectId(obj.id));
	var whereObj={};
	try{
		whereObj._id=mongodb.ObjectId(obj.id);
	}catch(err){
		console.log("你输入的ID不正确的!");
		whereObj._id="";
	}
	connectMGDB(function(dbase,db){
		dbase.collection(cName).updateOne(whereObj,updateObj,function(err,result){
			cb(err,result,db);
		})
	})
}

//查询符合条件的所有数据条数
module.exports.count = function(cName,whereObj,res,cb){
	connectMGDB(function(dbase,db){
		dbase.collection(cName).count(whereObj).then(function(count){
			cb(count,db);
		},res);
	});
}
