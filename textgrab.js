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

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function setBoxColors(box) {
  var hex = getRandomColor();
  var rgb = hexToRgb(hex);
  var colorR = rgb.r;
  var colorG = rgb.g;
  var colorB = rgb.b;
  var color = "rgb(" + colorR + "," + colorG + "," + colorB + ")"
  box.style.backgroundColor = color;
  if ((colorR * 0.299 + colorG * 0.587 + colorB * 0.114) > 150) {
    box.style.color = "#000000";
  } else {
    box.style.color = "#FFFFFF";
  }
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
  span.style.backgroundColor =  "yellow";
  return span;
}

function createAndStyleBox(textContent) {
  var topBoxHeight = (window.innerHeight - essayBox.clientHeight - 40) / 4;
  var box1 = document.createElement("DIV");

  var x = Math.round(range(0, 7));
  var y = Math.round(range(0, 1));

  while (slotTakenObject[x + "," + y]) {
    x = Math.round(range(0, 7));
    y = Math.round(range(0, 1));
  }

  slotTakenObject[x + "," + y] = true

  console.log(Object.keys(slotTakenObject).length)
  if (Object.keys(slotTakenObject).length == 16) {
    slotTakenObject = {}
  }

  document.body.appendChild(box1);
  box1.textContent = textContent
  box1.style.position = "fixed";
  box1.style.padding = "10px 1% 10px 1%";
  setBoxColors(box1)
  box1.style.fontSize = "12px";
  box1.style.width = "10.5%";
  box1.style.height = topBoxHeight - 20 + "px";
  box1.style.overflow = "scroll";
  box1.style.left = x * 12.5 + "%";
  box1.style.top = y * topBoxHeight + "px";

  return box1
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
  document.body.appendChild(line);
  line.style.position = "fixed";
  // debugger;
  line.style.width = distance + "px";
  line.style.height = "2px";
  line.style.left = (xMid - (distance / 2)) + "px";
  line.style.top = yMid + "px";
  line.style.transform = "rotate(" + slopeD + "deg)";
  line.style.backgroundColor = "green";
  line.style.zIndex = "4";
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

function loadNextPage(lastBox) {
  var word
  var urlToLoad
  var selection = randomlySelectAWordsLocation(lastBox);
  var words = lastBox.textContent.split(" ")
  addSpan(lastBox, selection)
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
        loadNextPage(lastBox);
      } else {
        var paragraph = getParagraphFromJson(json)
        if (isParagraphBorked(paragraph)) {
          loadNextPage(lastBox);
        } else {
          var shortText = chopParagraph(paragraph)
          var box1 = createAndStyleBox(shortText)
          var from = lastBox.getBoundingClientRect()
          var to = box1.getBoundingClientRect()
          drawLine(from.left, from.top, to.left, to.top);
          // remember the last word, so we don't repeat it
          // its a global variable
          lastWord = word;
          setTimeout(function() {
            loadNextPage(box1)
          }, 5000)
        }
      }
    });
}

var essayBox = document.getElementById("essays");
loadNextPage(essayBox)
