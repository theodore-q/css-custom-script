var codeEditor = document.getElementById("codeEditor")
var codeDisplay = document.getElementById("codeDisplay")
var submitButton = document.getElementById("submitCss")
var output = document.getElementById("output")
var unescapeButton = document.getElementById("unescapeButton")
var unescapeInput = document.getElementById("unEscaper")
var beautifyButton = document.getElementById("beautify")
var textInputButtons = document.getElementsByClassName('addText');

for (var i = 0; i < textInputButtons.length; i++) {
  textInputButtons[i].addEventListener('click', function() {
    console.log(this.innerHTML)
    insertAtCaret('codeEditor', this.innerHTML)
    updateOutput()
  })
}

unescapeButton.addEventListener('click', function() {
  function unescapeURL(url) {
    let fnUrl = url
    let urlNoDomain = fnUrl.replace('PL_AddCSS_NCM.js?css1=', '')
    let escapeBreakets = urlNoDomain.replace(/\[%/g, '%5B%25').
    replace(/%]/g, '%25%5D');
    let decondedURI = decodeURIComponent(escapeBreakets)
    return beatify(decondedURI)

  }

  codeEditor.value = unescapeURL(unescapeInput.value)
  updateOutput()
})

beautifyButton.addEventListener('click', function() {

  codeEditor.value = beatify(codeEditor.value)
  updateOutput()
});

codeEditor.addEventListener("input", function() {
  updateOutput()
}, false);

function updateOutput() {
  codeDisplay.innerHTML = codeEditor.value
  Prism.highlightElement(codeDisplay);
}

submitButton.addEventListener('click', function() {
  var replaceImporant = str => {
    return str.replace("!important", '!');
  }
  var replaceSpaces = str => {
    return str //.replace(/\s+/g, '');
  }
  var removeNewline = str => {
    return str.replace(/(\r\n|\n|\r)/gm, "");
  }

  let rawString = codeEditor.value

  let escapedCode = replaceImporant(encodeRFC5987ValueChars(replaceSpaces(removeNewline(rawString))))

  output.innerHTML = `PL_AddCSS_NCM.js?css1=${escapedCode}`
})

function beatify(beautyFullCss) {
  let removeBrakets = beautyFullCss.replace(/\[%/g, '[X_').replace(/%\]/g, '_X]')
  let niceCSS = beautyFullCss

  less.render(removeBrakets, function(e, output) {
    try {
      niceCSS = output.css
    } catch (e) {
      console.log('There has been an error'+ e)
    }

  });
  return niceCSS.replace(/\[X_/g, '[%').replace(/_X\]/g, '%]')
}

//found code:
function insertAtCaret(areaId, text) {
  var txtarea = document.getElementById(areaId);
  var scrollPos = txtarea.scrollTop;
  var caretPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0, caretPos);
  var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
  txtarea.value = front + text + back;
  caretPos = caretPos + text.length;
  txtarea.selectionStart = caretPos;
  txtarea.selectionEnd = caretPos;
  txtarea.focus();
  txtarea.scrollTop = scrollPos;
}

//found code:
function encodeRFC5987ValueChars(str) {
  return encodeURIComponent(str).
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
  replace(/['()]/g, escape). // i.e., %27 %28 %29
  replace(/\*/g, '%2A').
    // The following are not required for percent-encoding per RFC5987, 
    // so we can allow for a little better readability over the wire: |`^
  replace(/%(?:7C|60|5E)/g, unescape).
    //keep tokens
  replace(/%5B%25/g, unescape).
  replace(/%25%5D/g, unescape);
}
