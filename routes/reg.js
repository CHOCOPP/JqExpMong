module.exports=function(app,dirname){
	app.get("/reg",function(req,res){
		res.sendFile(dirname+"/view/reg/reg.html");
	});
}
