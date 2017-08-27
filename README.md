# Android Assets for Photoshop


A Photoshop script for exporting assets for Android projects.

The script works by duplicating the selected layer (or layergroup) to a new document, then scaling it to each of the 5 most common Android sizes (XXXHDPI, XXHDPI, XHDPI, HDPI, and MDPI) and then placing the files inside a folder next to the PSD.

After starting the script you are asked for giving a qualifier to your export. 
- The qulifier list is here: https://developer.android.com/guide/topics/resources/providing-resources.html#QualifierRules
- If you choose "port" as example , for the xhdpi resuoltion the forlder name will be "drawable-port-xhdpi"


## Installation
1. Download the script here

2. Move the **.jsx** file to your Photoshop scripts folder:

	- Mac: **/Applications/Adobe Photoshop.../Presets/Scripts/**
	- PC 64bit: **C:\Program Files\Adobe\Adobe Photoshop... (64 Bit)\Presets\Scripts\**
	- PC 32bit: **C:\Program Files\Adobe\Adobe Photoshop...\Presets\Scripts\**

