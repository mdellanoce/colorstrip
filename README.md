This is a [jQuery ](http://jquery.com/) plugin intended to be an imprecise color picker.
Colorstrip currently requires a browser that supports the canvas element.

# Using it

Put a div (or canvas element) somewhere on your page. It can be any width and height, colorstrip
will automatically scale itself to fit the element's width and height.

```html
<div id="color"></div>
```

Include jQuery and the colorstrip plugin on your page. Create the colorstrip in a script block.

```javascript
$('#color').colorstrip(function(hex) {
  //Handle the color change event somehow...
});
```
