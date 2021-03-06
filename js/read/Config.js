const BaseScriptChangeColor =
    `
     (function () {
        var height = null;
        var tags = document.getElementsByTagName('*');
        for(var i=0; i<tags.length; i++){
           tags[i].style.backgroundColor="#484848";
           tags[i].style.color="white";
        }
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setInterval(changeHeight, 100);
    } ())
    `
const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setInterval(changeHeight, 100);
    } ())
    `
export default {BaseScript,BaseScriptChangeColor}