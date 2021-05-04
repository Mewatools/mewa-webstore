/*jslint browser:true */
/*jslint white: true */

// IN-PROGRESS: Add syntax highlight
// Done: support indents

// IN-PROGRESS for JS code: improve naming of variables, they are just all over the place right now
// Who calls something LineNumbers-line?
// As you can see, those sorts of names are a BIG problem...
// Much of this was forked from https://github.com/MatheusAvellar/textarea-line-numbers


window.addEventListener("DOMContentLoaded", function () {
  'use strict';
  var textarea = document.getElementById('min-code-editor');
  // Let tab key indent code
  // Forked from https://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
  // Original author: https://stackoverflow.com/users/1456875/alexwells
  // Setup placeholder for textarea

  // textarea.value = editorCode.replace(/\\n/g, "\n");
  textarea.addEventListener(
    'keydown',
    function (e) {
      if (e.keyCode === 9) {
        // tab was pressed
        // get caret position/selection
        var start = this.selectionStart,
          end = this.selectionEnd,
          target = e.target,
          value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start) + '\t' + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
      }
    },
    false
  );

  var defaultCode = `
// Brief: Pixelates using an hexagonal pattern
// from: https://www.shadertoy.com/view/wsSyWR

shaderSource = "
    vec2 hexagon(vec2 uv)
    {
        uv *= vec2(0.577350278, 1.0); // hexagonal ratio
        float z = clamp(abs(mod(uv.x+floor(uv.y), 2.0)-1.0)*3.141592653-1.047197551, 0.0, 1.0);
        uv.y = floor(uv.y + z);
        uv.x = (floor(uv.x*0.5 + mod(uv.y, 2.0)*0.5) - mod(uv.y, 2.0)*0.5 + 0.5)*3.464101665; // convert back from hexagonal ratio
        return uv;
    }

    void mainImage(out vec4 fragColor, in vec2 texCoord)
    {
        vec4 tex = texture2D(iChannel0, hexagon(texCoord * pixelCount)/pixelCount);
        fragColor = vec4(tex.rgb, 1.0);
    }";


node = ShaderNode( shaderSource, "HexPixelate" );
node.setRenderArea("iChannel0");

uiControl = node.addFloatControl("pixelCount", 120);
uiControl.setName("Pixels");
uiControl.setStep(0.1);
uiControl.setRange(3, 1024);
  `;

  var defaultCode = defaultCode.replace(/(?:\r\n|\r|\n)/g, '\n');
  // Really simple regex-based syntax highlighting - isn't refined at the moment so it's deactivated
  // var defaultCode = defaultCode.replace(
  //   \/\/.*,
  //   '(<font color="#8a2be2">$1</font>$2'
  // );


  // Support autosaving via localStorage
  // Forked from https://codepen.io/Richienb with modifications

  // Check if storage browser feature is available
  if (Storage !== 'undefined') {
    // Check if the text stored is nothing
    if (localStorage.getItem('textContent') === '' || localStorage.getItem('textContent') ===  null) {
      // Set the contents of the text box to the default text
      textarea.value = defaultCode;
    } else {
      // Set the content that was already stored
      textarea.value = localStorage.getItem('textContent');
    }
  }

  // localStorage.setItem('textContent', textarea.value)

  // Store the text
  function storetext() {
    // Check if storage is supported
    if (Storage !== 'undefined') {
      // Set the contents of textstored to the contents of textarea
      localStorage.setItem('textContent', textarea.value);
    }
  }


  if (document.addEventListener !== 'undefined') {
    textarea.addEventListener(
      'input',
      function () {
        // event handling code for same browsers
        storetext();
      });
  } else {
    textarea.attachEvent('onpropertychange', function () {
      // IE-specific event handling code
      storetext();
    });
  }

  // Add line numbers
  // [Original]: https://github.com/MatheusAvellar/textarea-line-numbers

  const LineNumbers = {
    eventList: {},
    update_line_numbers: function (ta, el) {
      // Let's check if there are more or less lines than before
      const line_count = ta.value.split('\n').length
      const child_count = el.children.length
      let difference = line_count - child_count
      // If there is any positive difference, we need to add more line numbers
      if (difference > 0) {
        // Create a fragment to work with so we only have to update DOM once
        const frag = document.createDocumentFragment()
        // For each new line we need to add,
        while (difference > 0) {
          // Create a <span>, add LineNumbers class name, append to fragment and
          // update difference
          const line_number = document.createElement('span')
          line_number.className = 'LineNumbers-line'
          frag.appendChild(line_number)
          difference--
        }
        // Append fragment (with <span> children) to our container element
        el.appendChild(frag)
      }
      // If, however, there's negative difference, we need to remove line numbers
      while (difference < 0) {
        // Simple stuff, remove last child and update difference
        el.removeChild(el.lastChild)
        difference++
      }
    },
    append_line_numbers: function (id) {
      // Get reference to desired <textarea>
      const ta = document.getElementById(id)
      // If getting reference to element fails, warn and leave
      if (ta == null) {
        return console.warn("[LineNumbers.js] Couldn't find textarea of id '" + id + "'")
      }
      // If <textarea> already has LineNumbers active, warn and leave
      if (ta.className.indexOf('LineNumbers-active') != -1) {
        return console.warn("[LineNumbers.js] textarea of id '" + id + "' is already numbered")
      }
      // Otherwise, we're safe to add the class name and clear inline styles
      ta.classList.add('LineNumbers-active')
      ta.style = {}

      // Create line numbers container, insert it before <textarea>
      const el = document.createElement('div')
      el.className = 'LineNumbers-container'
      ta.parentNode.insertBefore(el, ta)
      // Call update to actually insert line numbers to the container
      LineNumbers.update_line_numbers(ta, el)
      // Initialize event listeners list for this element ID, so we can remove
      // them later if needed
      LineNumbers.eventList[id] = []

      // Constant list of input event names so we can iterate
      const __change_evts = ['propertychange', 'input', 'keydown', 'keyup']
      // Default handler for input events
      const __change_hdlr = (function (ta, el) {
        return function (e) {
          // If pressed key is Left Arrow (when cursor is on the first character),
          // or if it's Enter/Home, then we set horizontal scroll to 0
          // Check for .keyCode, .which, .code and .key, because the web is a mess
          // [Ref] stackoverflow.com/a/4471635/4824627
          if (
            (+ta.scrollLeft == 10 &&
              (e.keyCode == 37 || e.which == 37 || e.code == 'ArrowLeft' || e.key == 'ArrowLeft')) ||
            e.keyCode == 36 ||
            e.which == 36 ||
            e.code == 'Home' ||
            e.key == 'Home' ||
            e.keyCode == 13 ||
            e.which == 13 ||
            e.code == 'Enter' ||
            e.key == 'Enter' ||
            e.code == 'NumpadEnter'
          )
            ta.scrollLeft = 0
          // Whether we scrolled or not, let's check for any line count updates
          LineNumbers.update_line_numbers(ta, el)
        }
      })(ta, el)

      // Finally, iterate through those event names, and add listeners to
      // <textarea> and to events list
      /// IN-PROGRESS: Performance gurus: is this suboptimal? Should we only add a few
      /// listeners? I feel the update method is optimal enough for this to not
      /// impact too much things.
      for (let i = __change_evts.length - 1; i >= 0; i--) {
        ta.addEventListener(__change_evts[i], __change_hdlr)
        LineNumbers.eventList[id].push({
          evt: __change_evts[i],
          hdlr: __change_hdlr,
        })
      }

      // Constant list of scroll event names so we can iterate
      const __scroll_evts = ['change', 'mousewheel', 'scroll']
      // Default handler for scroll events (pretty self explanatory)
      const __scroll_hdlr = (function (ta, el) {
        return function () {
          el.scrollTop = ta.scrollTop
        }
      })(ta, el)
      // Just like before, iterate and add listeners to <textarea> and to list
      /// IN-PROGRESS: Also just like before: performance?
      for (let i = __scroll_evts.length - 1; i >= 0; i--) {
        ta.addEventListener(__scroll_evts[i], __scroll_hdlr)
        LineNumbers.eventList[id].push({
          evt: __scroll_evts[i],
          hdlr: __scroll_hdlr,
        })
      }
    }
  }

  // Initialize editor
  LineNumbers.append_line_numbers('min-code-editor')
})
