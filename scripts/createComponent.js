var util = require("util");

var MESSAGES = {
	CREATE_COMPONENT: "Component %s doesn't exist... creating a new one",
	CREATE_FOLDER: "Creating folder %s",
	CREATE_FILE: "Creating file %s",
	FILE_EXISTS: "File %s exists. Skipping",
	FOLDER_EXISTS: "The folder %s already exists, please choose a different name or delete that folder"
}


var LOG_LEVEL = process.env.LOG || 1;
var TEMPLATE_PATH  = './templates/'

var fs = require('fs');
var path = require('path');
var ejs = require ('ejs');


var args = [].slice.call (process.argv, 2 - process.argv.length);
var name = args[0] || "Component";
var connected = args [1] || false;
var folder = path.join (__dirname, "../src/app/components/");
var path = folder + name;

var files = ['actions', connected?'connectedComponent':'component', 'reducers'];

if (!connected) files = [files [1]]

var js = files.map ((fileName) => {
	var opt = {name:titleCase (name)}

	return require ([TEMPLATE_PATH,fileName,'.ejs'].join (""))(opt)
})

if (!fs.existsSync(path)){
	log (1, MESSAGES.CREATE_COMPONENT)

	name.replace ("\\","/").split ("/").reduce ((path, folder) => {
		var newFolder = path + "/" + folder
		if (!fs.existsSync(newFolder)){
			log (1, MESSAGES.CREATE_FOLDER , folder, name)
		    fs.mkdirSync(newFolder);
		 }
		    return newFolder
	}, folder)

	js.forEach ((data,i) => {
		var map = connected?[,"index",]:["index"],
			file = map[i] || files[i],
			filePath = path + "/" + (file),
			fileName = filePath + ".js";



		if (!fs.existsSync(filePath)){
			log (1, MESSAGES.CREATE_FILE, file)
			fs.writeFile(fileName, data, function(err) {
			    if(err) {
			        return console.err(err);
			    }
			}); 
		} else {
			log (1, MESSAGES.FILE_EXISTS , files [i])
		}
	})
} else {
	log (1, MESSAGES.FOLDER_EXISTS, name )
}

function titleCase (name, lower) {
	var m =	["toUpperCase","toLowerCase"]
	return name.slice (0,1)[m[~~lower % 2]]()+name.slice (1)
}

function log (level) {
	var args = [].slice.call (arguments,1);
	var str = util.format.apply (util, args);
	if (LOG_LEVEL >= level )
		console.log (str);
}		