/*!
 * Android Assets for Photoshop
 * =============================
 *
 * Version: 0.0.5
 * Author: Gaston Figueroa (Uncorked Studios)
 * Site: uncorkedstudios.com
 * Licensed under the MIT license
 */


// Photoshop variables

var docRef = app.activeDocument,
	activeLayer = docRef.activeLayer;


// Run main function

init();

// The other functions

function init() {
	saveFunc('xxhdpi');
	saveFunc('xhdpi');
	saveFunc('hdpi');
	saveFunc('mdpi');
	saveFunc('ldpi');
}

function resizeDoc(document, scale) {
	var calcWidth  = activeLayer.bounds[2] - activeLayer.bounds[0],
	calcHeight = activeLayer.bounds[3] - activeLayer.bounds[1],
	newWidth, newHeight;

	if(scale === 'xxhdpi') {
		newHeight = calcHeight;
		newWidth = calcWidth;
	} else if(scale === 'xhdpi') {
		newHeight = calcHeight / 3 * 2;
		newWidth = calcWidth / 3 * 2;
	} else if(scale === 'hdpi') {
		newHeight = calcHeight / 2;
		newWidth = calcWidth / 2;
	} else if(scale === 'mdpi') {
		newHeight = calcHeight / 3;
		newWidth = calcWidth / 3;
	} else if(scale === 'ldpi') {
		newHeight = calcHeight / 3 * .75;
		newWidth = calcWidth / 3 * .75;
	}

	document.resizeImage(UnitValue(newWidth,"px"),UnitValue(newHeight,"px"),null,ResampleMethod.BICUBIC);
}

function dupToNewFile() {	
	var fileName = activeLayer.name.replace(/\.[^\.]+$/, ''), 
		calcWidth  = activeLayer.bounds[2] - activeLayer.bounds[0],
		calcHeight = activeLayer.bounds[3] - activeLayer.bounds[1],
		docResolution = docRef.resolution,
		document = app.documents.add(calcWidth, calcHeight, docResolution, fileName, NewDocumentMode.RGB,
		DocumentFill.TRANSPARENT);

	app.activeDocument = docRef;

	activeLayer.duplicate(document, ElementPlacement.INSIDE);

	app.activeDocument = document;
	activeLayer2 = document.activeLayer;
	activeLayer2.translate(-activeLayer2.bounds[0],-activeLayer2.bounds[1]);
	activeLayer2.merge();
}

function saveFunc(dpi) {
	dupToNewFile();
	var docRef2 = app.activeDocument;
	resizeDoc(docRef2, dpi);

	var Name = docRef2.name.replace(/\.[^\.]+$/, ''), 
		Ext = decodeURI(docRef2.name).replace(/^.*\./,''), 
		Path = docRef.path,
		folder = Folder(Path + '/assets/' + dpi);
		
	if(!folder.exists) {
		folder.create();
	}

	var saveFile = File(folder + "/" + Name +".png");

	var sfwOptions = new ExportOptionsSaveForWeb(); 
		sfwOptions.format = SaveDocumentType.PNG; 
		sfwOptions.includeProfile = false; 
		sfwOptions.interlaced = 0; 
		sfwOptions.optimized = true; 
		sfwOptions.quality = 100;
		sfwOptions.PNG8 = false;

	activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);
	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}