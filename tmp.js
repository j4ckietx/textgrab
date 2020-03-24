

function nextBox(lastSpanColor) {

  line0.style.color = lastSpanColor // line form last span to current box
  box1.color = lastSpanColor
  box1SpanColor = isDark(lastSpanColor) ? getLightColor() : getDarkColor()

  nextBox(box1SpanColor)
}

var firstSpanColor = getDarkColor()
// ... do span stuff
nextBox(firstSpanColor)
