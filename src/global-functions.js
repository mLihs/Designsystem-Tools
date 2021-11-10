

import * as foundationColorsJson from './brandColors.js'
var foundationColors = foundationColorsJson.colors;


var sketch = require('sketch/dom');
var document = sketch.getSelectedDocument()



const FILETYPE = 'html';

export function colorCheckBrandConformity (colorInput){

  var result = foundationColors.find(color => color.color === colorInput.toLowerCase());
  return result ? result : null;

}



export function hexAtoRgba(colorInput){


  var result = colorInput.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);

  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: Math.round(1/255 * parseInt(result[4], 16) * 100) /100,
    hex: '#' + result[1]+result[2]+result[3],
    color: colorCheckBrandConformity ( '#' + result[1]+result[2]+result[3])
  } : null;

}

export function niceColorHexAlphaA(color){

  return("Juri")
}

export function niceColorHexAlpha(color){
  
    var objFontColor = "";
    var obFontColorObj = hexAtoRgba(color)
    if(obFontColorObj.color){
      objFontColor = "<td>"+obFontColorObj.color.name+",</br>Hex: "+obFontColorObj.hex+",</br>Alpha: "+obFontColorObj.a+"</td>";
    } else {
      objFontColor = "<td class='error'>Hex: "+obFontColorObj.hex+",</br>Alpha:"+obFontColorObj.a+"</td>";
    }

    return objFontColor;
}




export function writeToFile(path, content) {
  const resultStr = NSString.stringWithFormat('%@', content)
  resultStr.writeToFile_atomically(path, true)
}


export function getPluginFolderPath (context) {
  // Get absolute folder path of plugin
  let split = context.scriptPath.split('/');
  split.splice(-3, 3);
  return split.join('/');
}




export function documentName(context){

  if (context.document.fileURL() == null) { 

    return "unsaved_Doument";

  } else {

    return context.document.fileURL().path().replace(/\.sketch$/, '')
  
  }

}




export function saveToFile({ filenamePrefix, content: string, fileType }) {
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