//@Author : Yusef Sohail

var OBJLoader;
(function(exports) {


	var activeMaterial = null;
	exports.parse = function (str) {

		var lines = str.split("\n");

		activeMaterial = null;

		var out = {
			vertices : [],
			normals : [],
			texCoords : [],
			groups : {}
		};

		while(lines.length){
			lines = exports._parse(lines, out);
		}

		return out;

	}

	//assumes valid .obj file. explods if stuff is wrong. 
	exports._parse = function (lines, out) {

		var vertices = out.vertices,
			normals = out.normals,
			coords = out.texCoords,
			groups = out.groups;

		var faces = [];
		var name = null;

		var i = 0;

		mainloop:
		for(i = 0; i < lines.length;i++){//@TODO textureCoords + mateirals. + 4faced faces
			var tokens = lines[i].replace(/\s+/g, " ").split(" ")
			var t0 = tokens[0];
			switch(t0){
				case 'g':
					if(name === null){
						name = tokens[1];
					}else{
					//console.log("BREAKING!", tokens);
						break mainloop;
					}
					break;
				case "usemtl":
						activeMaterial = tokens[1];
					break;
				case 'v':
					vertices.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vt':
					coords.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vn':
					normals.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'f':
					var face =  [ tokens[1].split("/"),  tokens[2].split("/"), tokens[3].split("/") ]
					for(var n = 0; n < face.length;n++){
						var v = face[n];
						for(var j = 0; j < v.length;j++){
							v[j] = (v[j].length)? parseInt ( v[j] )-1: null;
						}

						for(var j = v.length; j < 3;j++){
							v[j] = null;
						}
					}
					faces.push(face);
					break;
			}


		}

		//conconsole.log(name, faces[0], "ASd", i, lines.length);
		if(name !== null){
			groups[name] = {
				vertices : vertices,
				normals : normals,
				texCoords : coords,
				faces : faces,
				material : activeMaterial
			}
		}

		return lines.splice(i+1);
	}

	exports.load = function (url, cb) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
				cb(exports.parse(xmlhttp.responseText))
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	exports.loadAll = function (urls, cb) {
		var objs = [];
		var toLoad = urls.length;

		urls.forEach(function(url, index) {
			exports.load(url, function (obj) {
				objs[index] = obj;	
				if(--toLoad === 0) cb(objs);
			})
		})

		if(toLoad === 0 || toLoad === undefined){
			cb([]);
		}
	}

	//prob shouldnt have this here but meh. its related. 
	exports.createJSString = function (name, obj) {
		var str = "";
		str += "var " + name + "= {}\n";
		str += name + ".vertices = " + JSON.stringify(obj.vertices) + "\n"
		str += name + ".normals = " + JSON.stringify(obj.normals) + "\n"
		str += name + ".texCoords = " + JSON.stringify(obj.texCoords) + "\n"
		str += name + ".groups = {}\n"
		for(var key in obj.groups ){
			var keyStr = "'" + key + "'";
			str += name + ".groups[" + keyStr + " ] = {}\n"
			str += name + ".groups[" + keyStr + " ].vertices = " + name + ".vertices\n"
			str += name + ".groups[" + keyStr + " ].normals = " + name + ".normals\n"
			str += name + ".groups[" + keyStr + " ].texCoords = " + name + ".texCoords\n"
			str += name + ".groups[" + keyStr + " ].faces = " + JSON.stringify(obj.groups[key].faces) + "\n"
			str += name + ".groups[" + keyStr + " ].material ='" + obj.groups[key].material + "'\n"

		}
		return str;
	}

})(OBJLoader = {})

module.exports = OBJLoader;