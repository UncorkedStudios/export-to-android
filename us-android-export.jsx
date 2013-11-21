/*

Android Export for Adobe Photoshop
=========================================
Version: 0.0.5
Author: Gaston Figueroa (Uncorked Studios)
Site: uncorkedstudios.com
Updated: 11-20-13

*/

var docRef = app.activeDocument;
activeLayer = docRef.activeLayer;

main();

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
	var fileName = activeLayer.name.replace(/\.[^\.]+$/, ''); 
	var calcWidth  = activeLayer.bounds[2] - activeLayer.bounds[0];
	var calcHeight = activeLayer.bounds[3] - activeLayer.bounds[1];
	var docResolution = docRef.resolution;
	var document = app.documents.add(calcWidth, calcHeight, docResolution, fileName, NewDocumentMode.RGB,
		DocumentFill.TRANSPARENT);
	app.activeDocument = docRef;

	activeLayer.duplicate(document, ElementPlacement.INSIDE);

	app.activeDocument = document;
	activeLayer2 = document.activeLayer;
	activeLayer2.translate(-activeLayer2.bounds[0],-activeLayer2.bounds[1]);
	activeLayer2.merge();

	// CREATE SLICE FROM LAYER =======================================================
	var idMk = charIDToTypeID( "Mk  " );
	    var desc15 = new ActionDescriptor();
	    var idnull = charIDToTypeID( "null" );
	        var ref8 = new ActionReference();
	        var idslice = stringIDToTypeID( "slice" );
	        ref8.putClass( idslice );
	    desc15.putReference( idnull, ref8 );
	    var idUsng = charIDToTypeID( "Usng" );
	        var desc16 = new ActionDescriptor();
	        var idType = charIDToTypeID( "Type" );
	        var idsliceType = stringIDToTypeID( "sliceType" );
	        var idLyr = charIDToTypeID( "Lyr " );
	        desc16.putEnumerated( idType, idsliceType, idLyr );
	        var idLyr = charIDToTypeID( "Lyr " );
	            var ref9 = new ActionReference();
	            var idLyr = charIDToTypeID( "Lyr " );
	            var idOrdn = charIDToTypeID( "Ordn" );
	            var idTrgt = charIDToTypeID( "Trgt" );
	            ref9.putEnumerated( idLyr, idOrdn, idTrgt );
	        desc16.putReference( idLyr, ref9 );
	    var idslice = stringIDToTypeID( "slice" );
	    desc15.putObject( idUsng, idslice, desc16 );
	executeAction( idMk, desc15, DialogModes.NO );	
}

function main() {
	saveFunc('xxhdpi');
	saveFunc('xhdpi');
	saveFunc('hdpi');
	saveFunc('mdpi');
	saveFunc('ldpi');
}

function saveFunc(dpi) {
	dupToNewFile();
	var docRef2 = app.activeDocument;
	resizeDoc(docRef2, dpi);

	var Name = docRef2.name.replace(/\.[^\.]+$/, ''); 
	var Ext = decodeURI(docRef2.name).replace(/^.*\./,''); 
	var Path = docRef.path;

	var folder = Folder(Path + '/assets/' + dpi);
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