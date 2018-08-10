module.exports=function(app,dirname){
	app.get("/login",function(req,res){
		res.sendFile(dirname+"/view/login/login.html");
	});
}
