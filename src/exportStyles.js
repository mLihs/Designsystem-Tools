
// documentation: https://developer.sketchapp.com/reference/api/




var FILETYPE = 'html';
let LINKINPUT = "sketch://plugin/com.atomatic.plugins.style2csv/"
let LAYERSHOWFUNCTION = "element.show"




let htmlheader = '<!doctype html><html class="no-js" lang=""><head><meta charset="utf-8"><title></title><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color"><style>body{display: flex; justify-content:center; font-family: helvetica; font-size: 14px; color: #282D37;} h1 {font-size:40px; margin: 120px 0 17px 0; }h1::after{content: "";width: 56px; height: 6px;background: #ec0016; display: block; margin: 12px 0; border-radius: 3px; overflow: hidden;} .subline{ padding-bottom: 120px; font-size: 24px; font-weight: 100;} .smallText{font-size:10px} .block{display:block;} .table-wrapper{min-width:1088px; max-width: 1288px; margin:0 64px; } table{border-spacing:0; width: 100%;} th, td {padding: 10px 20px; text-align: left; border-bottom: 1px solid #D7DCE1; min-width:50px;} tr:hover{background: #E0EFFB} .ffamily {width: 110px;} .warning{background:#F75F00; color:#fff} .error{background:#EC0016; color:#fff}</style></head><body>';
let htmlEnd = '</body></html>'

function saveToFile({ filenamePrefix, content: string }) {
  // Configuring save panel
  var savePanel = NSSavePanel.savePanel();
  savePanel.allowedFileTypes = [FILETYPE];
  savePanel.nameFieldStringValue = `${filenamePrefix}`;

  // Launching alert
  var result = savePanel.runModal();
  if (result == NSFileHandlingPanelOKButton) {
    var path = savePanel.URL().path();
    var success = string.writeToFile_atomically_encoding_error(path, true, NSUTF8StringEncoding, null);
    var alert;

    if (success) {
     /* alert = createAlert({
        text: 'The ' + FILETYPE.toUpperCase() + '-file is successfully saved to:\n `' + path + '`',
        buttons: ['OK'],
      });*/

      //alert("Shared Color Palette JSON Exported!", "Styls Exprtet");
    } else {
     /* alert = createAlert({
        text: `The file could not be saved.`,
        buttons: ['OK'],
      });*/
    }
    //alert("Shared Color Palette JSON Exported!", "Styls Not Exprtet");
    //alert.runModal();
  }
}



function getSystemFonts() {
    var fontManager = NSFontManager.sharedFontManager();
    var fonts = [];
    var sys_fonts = fontManager.availableFonts();
    //has to convert them to normal array, as {sys_fonts} is array-like object, and is persistent, so when modified, changes stay between runs of script
    for (var i = 0; i < sys_fonts.length; ++i) {
        fonts.push(sys_fonts[i]);
    }
    return fonts;
}









//import sketch from 'sketch'

var sketch = require('sketch/dom');
var document = sketch.getSelectedDocument()
var sharedStyle = require('sketch/dom').SharedStyle
var UI = require('sketch/ui')




function unselectAllLayer(){
  let selectedLayersObject = document.selectedLayers
  let selectedLayersArray = selectedLayersObject.layers

  selectedLayersArray.forEach(function(layer){
    layer.selected = false;
  })
}



function centerToLayer(obj){
  //document.centerOnLayer(obj)
  MSDocument.currentDocument().eventHandlerManager().currentHandler().zoomToSelection()
}

function createLink(cmd, uri){
  // encodeURIComponent(URI)
  return LINKINPUT+cmd+"?msg="+encodeURIComponent(uri);

}

function createNiceHTMLLink( niceName,link){
  return '<a href="'+link+'">'+niceName+'</a>';
}



function focusOnLayer (id){
  var layer = document.getLayerWithID(id)
  if (layer){
    unselectAllLayer();
    layer.getParentPage().selected = true;
    layer.selected = true;
    centerToLayer(layer)
  }
}



/*

var setSelection = function (context) {
  let query = context.actionContext.query
  id = query.msg
  log(id)
  focusOnLayer("E4381EEA-F904-4DB0-921C-9A37AE4647A2")
}
*/

var setSelection = function (context) {
  let query = context.actionContext.query
  var theID = query.msg
  focusOnLayer (theID)
}



export var exportLayerStyles = function(context) {

  var layerStyles = document.sharedLayerStyles;
  var textStyles = document.sharedTextStyles;
  var documentSwatches = document.swatches;

  var docName = context.document.fileURL().lastPathComponent().split(".sketch")[0];
  let wrapperDivStart = "<div class='table-wrapper'>"
  let docHeader = "<h1>Document Textstyles</h1><p class='subline'>"+docName+"</p>"
  let tableStart = "<table>"
  let tableHeader = "<thead><tr><th>Name</th><th>Used</th><th class='ffamily'>Family</th><th class='fWeight'>Weight</th><th>Size</th><th>Line</th><th>Color</th><th>Color Variable</th></tr></thead>" 
  let tableBodyStart = "<tbody>";
  let tableBodyEnd = "</tbody>";
  let tableEnd = "</table>"
  let wrapperDivEnd = "</div>"


  var outputCSV = htmlheader + wrapperDivStart + docHeader + tableStart + tableHeader + tableBodyStart;
  getAllTextStyles();
  outputCSV += tableBodyEnd + tableEnd + wrapperDivEnd + htmlEnd;
 





 
//console.log(object.fills[0].sketchObject.color().swatchID())
 // console.log(document.sketchObject.documentData())

  function getAllTextStyles(){
    textStyles.forEach(object => {

      
      
      
      var objName = object.name;
      var objfamily = object.style.fontFamily;
      var objFontVariant = object.style.sketchObject.textStyle().fontPostscriptName().split("-")[1];
      var objLineheigt = object.style.lineHeight;
      var objFontSize = object.style.fontSize;
      var objFontColor = object.style.textColor;

      var objUsed = "<td class='warning'>No</td>";

      var objLastName = objName.split("/")
      objLastName = objLastName[objLastName.length -1];


      objName = "<span class='block'>"+objLastName+"</span><span class='block smallText'>"+objName+"</span>";


      if (objfamily == "DB Screen Sans" || objfamily == "DB Screen Head"){
        objfamily = "<td>"+objfamily+"</td>"
      } else {
        objfamily = "<td class='error'>"+objfamily+"</td>"
      }

      
      var regexp = /DB Foundation/i;
      var matchesStandardStyle = objName.match(regexp);

      if (!matchesStandardStyle){

        var textAdapter = object.getAllInstancesLayers()[0];
        if(textAdapter){
          objUsed = "<td>Yes</td>"
        }

      } else {
          objUsed = "<td>DB STD</td>"
      }

      var colorVariable = "<td class='warning'>Not assigned</td>"
      var attributes = object.sketchObject.style().primitiveTextStyle().attributes()
      var swatchID = attributes.MSAttributedStringColorAttribute.swatchID()
      if (swatchID){

       var referenceSwatch = documentSwatches.find(x => x.id == swatchID);
       if (!referenceSwatch){
          colorVariable = "<td class='error'>Broken</td>"
       } else {
          colorVariable = "<td>"+referenceSwatch.name+"</td>"
       }
      }



      if (objLineheigt == null){
       objLineheigt = Math.abs(objFontSize) * 1.25;
      }


      //var link = createLink(LAYERSHOWFUNCTION, object.id)

      var tempArray = ["<tr><td>"+objName+"</td>",objUsed, objfamily,"<td>"+objFontVariant+"</td>","<td>"+objFontSize+" dp</td>","<td>"+objLineheigt+" dp</td>","<td>"+objFontColor+"</td>",colorVariable+"</tr>"]
      outputCSV += tempArray.join(" ");

    })
  }

  saveToFile({
    filenamePrefix: docName+" TextStyle.html",
    content: NSString.stringWithString(outputCSV)
  });


}


export var exportTextLayer = function(context) {
          // Change font
// This plugin changes the font family of the selected text layers (or all the text layers in the document, if there's no selection)

var docName = context.document.fileURL().lastPathComponent().split(".sketch")[0];

let wrapperDivStart = "<div class='table-wrapper'>"
let docHeader = "<h1>Document Textlayer Styles</h1><p class='subline'>"+docName+"</p>"
let tableStart = "<table>"
let tableHeader = "<thead><tr><th>Name</th><th class='ffamily'>Family</th><th class='fWeight'>Weight</th><th>Size</th><th>Line</th><th>Color</th><th>Shared Style</th></tr></thead>" 
let tableBodyStart = "<tbody>";
let tableBodyEnd = "</tbody>";
let tableEnd = "</table>"
let wrapperDivEnd = "</div>"

var outputCSV = htmlheader + wrapperDivStart + docHeader + tableStart + tableHeader + tableBodyStart;
document.pages.forEach(doSomething)
outputCSV += tableBodyEnd + tableEnd + wrapperDivEnd + htmlEnd;


console.log(docName)


function doSomething(object) {

  if (object.type == "Page"){
      //console.log(object)
     // object.selected = true;
  }
  if (object.type == "Text"){
   
    var objfamily = object.style.fontFamily;
    var objFontVariant = object.sketchObject.font().fontName().split("-")[1];
    var objLineheigt = object.style.lineHeight;
    var objFontSize = object.style.fontSize;

    var objName = object.name;
    var objLastName = objName.split("/")
    objLastName = objLastName[objLastName.length -1];

    var objArtboard = object.getParentArtboard();
    var objArtboardName = "No Artboard"
    if (objArtboard){
      objArtboardName = objArtboard.name;
    }

    var objsharedStyleId = object.sharedStyleId
    var objFontColor = object.style.textColor;

    if (objfamily == "DB Screen Sans" || objfamily == "DB Screen Head"){
      objfamily = "<td>"+objfamily+"</td>"
    } else {
      objfamily = "<td class='error'>"+objfamily+"</td>"
      
    }



    if (objsharedStyleId == null || objsharedStyleId == undefined){
      objsharedStyleId = "<td class='warning'>none</td>"
    } else {
      var tempsharedStyle = document.getSharedTextStyleWithID(objsharedStyleId);
      if(!tempsharedStyle){
        objsharedStyleId = "<td class='error'>broken</td>"
      }else {
        objsharedStyleId = "<td>"+document.getSharedTextStyleWithID(objsharedStyleId).name+"</td>"
      }
    }


    if (objLineheigt == null){
     objLineheigt = Math.abs(objFontSize) * 1.25;
    }

    var link = createLink(LAYERSHOWFUNCTION, object.id)

    objName = "<td><span class='block'>"+createNiceHTMLLink(objLastName, link)+"</span><span class='block smallText'>"+objArtboardName+"</span></td>";
  
    var tempArray = [objName,objfamily,"<td>"+objFontVariant+"</td>","<td>"+objFontSize+" dp</td>","<td>"+objLineheigt+" dp</td>","<td>"+objFontColor+"</td>",objsharedStyleId+"</tr>"]
    
    

    

    var weight = object;


    outputCSV += tempArray.join(" ")  
    

  }

  if (object.layers && object.layers.length) {
    // iterate through the children
    object.layers.forEach(doSomething)

  

  }


}

// start the recursion





/*function replaceTextStyles (){
  var style = document.sharedTextStyles
  style.forEach(function(styling, i){
    var styler = styling.style
    if (styler.styleType == "Text"){
      
    }
  })
}*/



saveToFile({
    filenamePrefix: docName+" Textlayer Style.html",
    content: NSString.stringWithString(outputCSV)
});




          };
          