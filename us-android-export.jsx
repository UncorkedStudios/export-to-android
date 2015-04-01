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
	activeLayer = docRef.activeLayer,
	activeLayer2,
	newWidth, 
	newHeight,
	docName = docRef.name;


// Run main function
init();

// The other functions
function init() {
	if(!isDocumentNew()) {
		saveFunc('xxxhdpi');
		saveFunc('xxhdpi');
		saveFunc('xhdpi');
		saveFunc('hdpi');
		saveFunc('mdpi');
		saveFunc('ldpi');
	} else {
		alert("Please save your document before running this script.");
	}

}

// Test if the document is new (unsaved)
// http://2.adobe-photoshop-scripting.overzone.net/determine-if-file-has-never-been-saved-in-javascript-t264.html

function isDocumentNew(doc){
	// assumes doc is the activeDocument
	cTID = function(s) { return app.charIDToTypeID(s); }
	var ref = new ActionReference();
	ref.putEnumerated( cTID("Dcmn"),
	cTID("Ordn"),
	cTID("Trgt") ); //activeDoc
	var desc = executeActionGet(ref);
	var rc = true;
		if (desc.hasKey(cTID("FilR"))) { //FileReference
		var path = desc.getPath(cTID("FilR"));
		
		if (path) {
			rc = (path.absoluteURI.length == 0);
		}
	}
	return rc;
};


function resizeDoc(document, scale) {

	var calcWidth  = activeLayer.bounds[2] - activeLayer.bounds[0], // Get layer's width
	calcHeight = activeLayer.bounds[3] - activeLayer.bounds[1]; // Get layer's height
	// newWidth, newHeight; 

	if(scale === 'xxxhdpi') {
		newHeight = calcHeight;
		newWidth = calcWidth;
	} else if(scale === 'xxhdpi') {
		newHeight = Math.floor(calcHeight / 16 * 12);
		newWidth = Math.floor(calcWidth / 16 * 12);
    } else if(scale === 'xhdpi') {
		newHeight = Math.floor(calcHeight / 16 * 8);
		newWidth = Math.floor(calcWidth / 16 * 8);
	} else if(scale === 'hdpi') {
		newHeight = Math.floor(calcHeight / 16 * 6);
		newWidth = Math.floor(calcWidth / 16 * 6);
	} else if(scale === 'mdpi') {
		newHeight = Math.floor(calcHeight / 16 * 4);
		newWidth = Math.floor(calcWidth / 16 * 4);
	} else if(scale === 'ldpi') {
		newHeight = Math.floor(calcHeight / 16 * 3);
		newWidth = Math.floor(calcWidth / 16 * 3);
	}

	// Resize temp document using Bicubic interpolation
	resizeLayer(newWidth);

	// Merge all layers inside the temp document
	activeLayer2.merge();
}


// document.resizeImage doesn't seem to support scalestyles so we're using this workaround from http://ps-scripts.com/bb/viewtopic.php?p=14359
function resizeLayer(newWidth) {
	var idImgS = charIDToTypeID( "ImgS" );
	var desc2 = new ActionDescriptor();
	var idWdth = charIDToTypeID( "Wdth" );
	var idPxl = charIDToTypeID( "#Pxl" );
	desc2.putUnitDouble( idWdth, idPxl, newWidth);
	var idscaleStyles = stringIDToTypeID( "scaleStyles" );
	desc2.putBoolean( idscaleStyles, true );
	var idCnsP = charIDToTypeID( "CnsP" );
	desc2.putBoolean( idCnsP, true );
	var idIntr = charIDToTypeID( "Intr" );
	var idIntp = charIDToTypeID( "Intp" );
	var idBcbc = charIDToTypeID( "Bcbc" );
	desc2.putEnumerated( idIntr, idIntp, idBcbc );
	executeAction( idImgS, desc2, DialogModes.NO );
}

function dupToNewFile() {	
	var fileName = activeLayer.name.replace(/\.[^\.]+$/, ''), 
		calcWidth  = Math.ceil(activeLayer.bounds[2] - activeLayer.bounds[0]),
		calcHeight = Math.ceil(activeLayer.bounds[3] - activeLayer.bounds[1]),
		docResolution = docRef.resolution,
		document = app.documents.add(calcWidth, calcHeight, docResolution, fileName, NewDocumentMode.RGB,
		DocumentFill.TRANSPARENT);

	app.activeDocument = docRef;

	// Duplicated selection to a temp document
	activeLayer.duplicate(document, ElementPlacement.INSIDE);

	// Set focus on temp document
	app.activeDocument = document;

	// Assign a variable to the layer we pasted inside the temp document
	activeLayer2 = document.activeLayer;

	// Center the layer
	activeLayer2.translate(-activeLayer2.bounds[0],-activeLayer2.bounds[1]);
}

function saveFunc(dpi) {
	dupToNewFile();
	var docRef2 = app.activeDocument;
	resizeDoc(docRef2, dpi);

	var Name = docRef2.name.replace(/\.[^\.]+$/, ''), 
		Ext = decodeURI(docRef2.name).replace(/^.*\./,''), 
		Path = docRef.path,
		folder = Folder(Path + '/' + docName + '-assets/' + 'drawable-' + dpi);
		
	if(!folder.exists) {
		folder.create();
	}

	var saveFile = File(folder + "/" + Name + ".png");

	var sfwOptions = new ExportOptionsSaveForWeb(); 
		sfwOptions.format = SaveDocumentType.PNG; 
		sfwOptions.includeProfile = false; 
		sfwOptions.interlaced = 0; 
		sfwOptions.optimized = true; 
		sfwOptions.quality = 100;
		sfwOptions.PNG8 = false;

	// Export the layer as a PNG
	activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions);

	// Close the document without saving
	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}