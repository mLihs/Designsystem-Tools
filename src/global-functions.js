

export function hello(){
	log("hello")

}


export function hexAtoRgba(colorInput){
var result = colorInput.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
return result ? {
  r: parseInt(result[1], 16),
  g: parseInt(result[2], 16),
  b: parseInt(result[3], 16),
  a: Math.round(1/255 * parseInt(result[4], 16) * 100) /100,
  hex: '#' + result[1]+result[2]+result[3]
} : null;
}
