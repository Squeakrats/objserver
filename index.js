var express = require("express"),
	busboy = require("connect-busboy"),
	app = express(),
	OBJLoader = require("./OBJLoader.js")


	app.use(busboy());


	app.get("/", function (req, res) {
		res.sendFile( __dirname + "/public/index.html")
	});

	app.post("/upload", function (req, res) {
		
		//console.log("GOT UPLOAD");
	//	/*
		req.busboy.on("file", function (fieldName, file, fileName) {

			var safe = fileName.replace(".", "").replace(" ", "");


			var chunks = []
			file.on("data", function (data) {
				chunks.push(data);
			})

			file.on("end", function () {
				chunks.forEach(function(e){
					//console.log(e.toString("ascii") , "ASDASDSD");
				})
				//console.log(chunks.length);
				var buffer = Buffer.concat(chunks);
				var str = buffer.toString("ascii")
				//console.log("DONE!");
				try {
					var model = OBJLoader.parse(str);
					var string = OBJLoader.createJSString(safe, model);
					res.set({"Content-Disposition":"attachment; filename=\"" + fileName + ".js" + "\""});
  					res.send(string);
				} 

				catch (e) {
					console.log(e);
					res.send("Failed To Load File!. Please Try Again!");
				}
			})



			//file.pipe(fs.createWriteStream("tmp.txt"));
		})
		req.pipe(req.busboy);// */

	})

	//app.post("/upload")

	app.listen(8080);