// GLOBAL VARIABLES
var lastWord = ""

function chopItOff(word) {
  var charAscii = word[word.length - 1].charCodeAt(0);
  if (charAscii < 65 || charAscii > 90 && charAscii < 97 || charAscii > 122) {
    return word.substring(0, word.length - 1);
  } else {
    return word;
  }
}

function randomlySelectAWordsLocation(element) {
  var wordList = element.textContent.split(" ")
  var word = ""

  var thereIsWordsGreaterThan3 =
    wordList.filter(word => word.length >= 3).length > 0

  while (word.length < 3 && thereIsWordsGreaterThan3) {
    var selection = Math.floor(Math.random() * wordList.length)
    word = wordList[selection]
  }

  return selection
}

function stringToHTML(str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

function range(a, b) {
  return Math.random() * (b - a) + a
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getLightColor(){
  var r = range (150, 255)
  var g = range (150, 255)
  var b = range (150, 255)
  var color = {r,g,b}
  return color
}

function isLight(color) {
  return color.r >= 150
}

function getDarkColor(){
  var r = range (0, 100)
  var g = range (0, 100)
  var b = range (0, 100)
  var color = {r,g,b}
  return color
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function setBoxColors(box) {
  // var hex = getRandomColor();
  // var rgb = hexToRgb(hex);
  var rgb = getLightColor()
  var colorR = rgb.r;
  var colorG = rgb.g;
  var colorB = rgb.b;
  var color = "rgb("+colorR+","+colorG+","+colorB+")"
  box.style.backgroundColor = color;
  if ((colorR * 0.299 + colorG * 0.587 + colorB * 0.114) > 150) {
    box.style.color = "#000000";
  } else {
    box.style.color = "#FFFFFF";
  }
  return rgb;
}

function getTextColor(color){
  var textColor
  if ((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 150) {
    textColor = "#000000";
  } else {
    textColor = "#FFFFFF";
  }
  return textColor;
}

function formatColor (object){
  var string = "rgb(" + object.r + "," + object.g + "," + object.b + ")"
  return string
}

function invertColor(rgb){
  var r = 255 - rgb.r;
  var g = 255 - rgb.g;
  var b = 255 - rgb.b;
  return {r,g,b};
}

function isJsonBorked(json, word) {
  var isContentsNull = json.contents === null
  var wikiDom = stringToHTML(json.contents);
  var isMissingTag = wikiDom.getElementsByTagName("p").length == 0
  var isSameWord = word == lastWord
  var isBorked = isContentsNull || isMissingTag || isSameWord
  if (isBorked) {
    // console.log("its borked: " + word +
    //   " isContentsNull=" + isContentsNull +
    //   " isMissingTag=" + isMissingTag +
    //   " isSameWord=" + isSameWord
    // )
  }
  return isBorked
}

var slotTakenObject = {}

function addSpan(element, location) {
  var words = element.textContent.split(" ");
  var word = words[location];
  word = " <span>" + word + "</span> ";

  element.innerHTML =
    words.slice(0, location).join(" ")
    + word
    + words.slice(location+1, words.length).join(" ");

  var span = element.getElementsByTagName("span")[0];
  span.style.backgroundColor = "yellow";
  return span;
}

function createAndStyleBox(textContent) {
  var box1 = document.createElement("DIV");

  var columns = 6
  var rows = 2
  var numberOfSlots = columns * rows

  var x = Math.round(range(0, columns-1));
  var y = Math.round(range(0, rows-1));

  while (slotTakenObject[x + "," + y]) {
    x = Math.round(range(0, columns-1));
    y = Math.round(range(0, rows-1));
  }

  slotTakenObject[x + "," + y] = true

  console.log(Object.keys(slotTakenObject).length)
  if (Object.keys(slotTakenObject).length == numberOfSlots) {
    slotTakenObject = {}
    var lines = Array.from(document.getElementsByClassName("lineDiv"));
    for (var i=0; i<lines.length; i++){
      var lineDiv = lines[i];
      lineDiv.parentNode.removeChild(lineDiv);
    }
    var dim = document.createElement("div");
    document.body.appendChild(dim);
    dim.style.position = "fixed";
    dim.style.left = 0;
    dim.style.top = 0;
    dim.style.margin = "0";
    dim.style.padding = "0";
    dim.style.width = "100%";
    dim.style.height = (window.innerHeight - essayBox.clientHeight - 40) / 2 + "px";
    dim.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  }

  document.body.appendChild(box1);
  var padLR = 1; // % each side (left right)
  var padTB = 10; // px each side (top bottom)
  box1.textContent = textContent
  box1.style.position = "fixed";
  box1.style.padding = padTB + "px " + padLR + "% " + padTB + "px " + padLR + "%";
  var rgb = setBoxColors(box1);
  // var irgb = invertColor(rgb);
  // var irgb = getDarkColor();
  var topHeight = (window.innerHeight - essayBox.clientHeight - 40) / 2; // white space above essaybox
  var width = (100 / columns) - (padLR * 2);
  var height = (topHeight / rows) - (padTB * 2);
  box1.style.fontSize = "13px";
  box1.style.width = width + "%";
  box1.style.height = height + "px";
  box1.style.overflow = "scroll";
  box1.style.left = x * (width + padLR*2) + "%";
  box1.style.top = y * (height + padTB*2) + "px";

  return box1;
}

function chopParagraph(paragraph) {
  var words = paragraph.split(" ")
  if (words.length > 45) {
    var shortParagraph = words.slice(0, 46)
    shortParagraph.push("...")
  } else {
    var shortParagraph = words
  }
  return shortParagraph.join(" ")
}

function getParagraphFromJson(json) {
  var wikiDom = stringToHTML(json.contents);
  var paragraph = Array.from(wikiDom.getElementsByTagName("p"))
    .map(p => p.innerText)
    .join(" ")
  return paragraph
}

function drawLine(x1, y1, x2, y2) {
  var distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
  var xMid = (x1 + x2) / 2;
  var yMid = (y1 + y2) / 2;
  var slopeR = Math.atan2(y1 - y2, x1 - x2);
  var slopeD = (slopeR * 180) / Math.PI;
  var line = document.createElement("div");
  line.className = "lineDiv";
  document.body.appendChild(line);
  line.style.position = "fixed";
  // debugger;
  line.style.width = distance + "px";
  line.style.height = "2px";
  line.style.left = (xMid - (distance / 2)) + "px";
  line.style.top = yMid + "px";
  line.style.transform = "rotate(" + slopeD + "deg)";
  line.style.zIndex = "2";
  return line;
}

function isParagraphBorked(paragraph) {
  if (paragraph.split(" ").length < 50) {
    // console.log("Paragraph is borked")
    return true
  }
  return false
}

// if (longListOfWord.join(" ").includes("may refer to:")) {
//   console.log("its a list homie: " +
//     wikiDom.getElementsByClassName("mw-parser-output")[0].getElementsByTagName("ul")[0].getElementsByTagName("a")[0].href
//   )
// }

// var line = document.createElement("DIV");
// line.setAttribute("id", "line1");
// document.body.appendChild(line);

// function newsPop() {
//   var newsBox = document.createElement("DIV");
//   document.body.appendChild(newsBox);
//   newsBox.textContent = news1;
//   newsBox.style.position = "fixed";
//   newsBox.style.padding = "20px";
//   newsBox.style.width = Math.random() * 350 + 200 + "px";
//   newsBox.style.left = Math.random() * (window.innerWidth - newsBox.clientWidth) + "px";
//   newsBox.style.top = Math.random() * (window.innerHeight - newsBox.clientHeight) + "px";
//   newsBox.style.backgroundColor = "green";
//   newsBox.style.color = "white";
//   newsBox.style.zIndex = "3";
//   var theword = document.getElementById("theword")
//   var from = theword.getBoundingClientRect()
//   var to = newsBox.getBoundingClientRect()
//   drawLine(
//     from.left,
//     from.top,
//     to.left,
//     to.top);
// }

function loadNextPage(lastBox, lastBoxColor) {
  var word
  var urlToLoad
  var selection = randomlySelectAWordsLocation(lastBox);
  var words = lastBox.textContent.split(" ")
  var span = addSpan(lastBox, selection)
  word = chopItOff(words[selection])
  // console.log("word = " + word)
  urlToLoad = `https://api.allorigins.win/get?url=${encodeURIComponent('https://en.wikipedia.org/wiki/'+word)}`

  fetch(urlToLoad)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Network response was not ok.')
      }
    })
    .then(json => {
      if (isJsonBorked(json, word)) {
        loadNextPage(lastBox,lastBoxColor);
      } else {
        var paragraph = getParagraphFromJson(json)
        if (isParagraphBorked(paragraph)) {
          loadNextPage(lastBox,lastBoxColor);
        } else {
          var shortText = chopParagraph(paragraph)
          var box1 = createAndStyleBox(shortText)
          // var wordColor = "rgb(" + irgb.r + "," + irgb.g + "," + irgb.b + ")"
          // console.log(wordColor);
          var spanColor = isLight(lastBoxColor)? getDarkColor(): getLightColor();
          span.style.backgroundColor = formatColor(spanColor);
          span.style.color = getTextColor(spanColor);
          var from = span.getBoundingClientRect()
          var to = box1.getBoundingClientRect()
          var line = drawLine(from.left, from.top, to.left, to.top);
          line.style.backgroundColor = formatColor(spanColor);
          box1.style.backgroundColor = formatColor(spanColor);
          box1.style.color = getTextColor(spanColor);
          // remember the last word, so we don't repeat it
          // its a global variable
          lastWord = word;
          setTimeout(function() {
            loadNextPage(box1,spanColor)
          }, 2000)
        }
      }
    });
}

var essayBox = document.getElementById("essays");
loadNextPage(essayBox, {r:255, g:255, b:255})
