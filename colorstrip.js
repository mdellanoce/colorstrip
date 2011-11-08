(function($) {
  function ColorStrip(element) {
    this.element = element;
    this._create();
  };

  ColorStrip.prototype._create = function() {
    this.canvas = this.element.get(0);
    this.context = this.canvas.getContext('2d');
    this._init();
  };

  ColorStrip.prototype._init = function() {
    var width = this._width(),
      height = this._height(),
      x, y, i;
    pixels = this.context.createImageData(width, height);

    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        i = (x + y * width) * 4;
        rgb = this._rgb(x, y);
        pixels.data[i] = rgb[0];
        pixels.data[i+1] = rgb[1];
        pixels.data[i+2] = rgb[2];
        pixels.data[i+3] = 255;
      }
    }

    this.context.putImageData(pixels, 0, 0);

    this.element.bind('mousedown mousemove mouseup', $.proxy(this, '_change'));
  };

  ColorStrip.prototype._change = function(event) {
    if (event.type === 'mousedown') {
      this._mousedown = true;
    } else if (event.type === 'mouseup') {
      this._mousedown = false;
    }
    
    if (this._mousedown) {
      var x = event.pageX - this.element.offset().left,
        y = event.pageY - this.element.offset().top,
        rgb = this._rgbToHex(this._rgb(x, y));
      this.element.trigger('colorstripchange', rgb);
    }
  };

  ColorStrip.prototype._rgbToHex = function(rgb) {
    var key = '0123456789ABCDEF',
      base = 16,
      hex = '#',
      c;
    for (var i = 0, ii = rgb.length; i < ii; i++) {
      c = rgb[i];
      hex += key.charAt((c - c % base)/base) + key.charAt(c % base);
    }
    return hex;
  };

  ColorStrip.prototype._rgb = function(x, y) {
    var width = this._width(),
      height = this._height(),
      hsl = [x/width*300, 1, 1 - y/height],
      h = hsl[0],
      s = hsl[1],
      l = hsl[2],
      c = (1 - Math.abs(2*l - 1)) * s,
      hprime = h/60,
      x = c*(1 - Math.abs(hprime%2 - 1)),
      m = l - c/2;
    
    var rgb = hprime < 1 ? [c,x,0] :
      hprime < 2 ? [x,c,0] :
      hprime < 3 ? [0,c,x] :
      hprime < 4 ? [0,x,c] :
      hprime < 5 ? [x,0,c] :
      hprime < 6 ? [c,0,x] : [0,0,0];
    
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;
    
    rgb[0] *= 255;
    rgb[1] *= 255;
    rgb[2] *= 255;

    return rgb;
  };

  ColorStrip.prototype._width = function() {
    return this.element.width();
  };

  ColorStrip.prototype._height = function() {
    return this.element.height();
  };

  $.fn.extend({
    colorstrip: function() {
      var element = $(this),
        colorstrip = new ColorStrip(element);
      element.data('colorstrip', colorstrip);
      return this;
    }
  });
})(jQuery);
