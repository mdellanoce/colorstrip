(function($) {
  function supressSelectCursor() {
    return false;
  };

  function ColorStrip(element, options) {
    this.element = element;
    this.options = options;
    this._create();
  };

  ColorStrip.prototype._create = function() {
    var self = this;
    if (self.element.is('canvas')) {
      self.canvas = self.element.get(0);
    } else {
      self.canvas = $('<canvas />').attr({
        width: self._width(),
        height: self._height()
      }).appendTo(self.element).get(0);
    }
    self.context = self.canvas.getContext('2d');
    self._init();
  };

  ColorStrip.prototype._init = function() {
    var self = this,
      width = self._width(),
      height = self._height(),
      x, y, i,
      pixels = self.context.createImageData(width, height);
    
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        i = (x + y * width) * 4;
        rgb = self._rgb(x, y, width, height);
        pixels.data[i] = rgb[0];
        pixels.data[i+1] = rgb[1];
        pixels.data[i+2] = rgb[2];
        pixels.data[i+3] = 255;
      }
    }
    
    self.context.putImageData(pixels, 0, 0);

    self.element.bind({
      'mousedown mousemove mouseup': $.proxy(self, '_change'),
      'colorstripchange': $.proxy(self, '_preview')
    });
    
    if (self.canvas.addEventListener) {
      self.canvas.addEventListener('touchstart', $.proxy(self, '_touchevent'), false);
      self.canvas.addEventListener('touchmove', $.proxy(self, '_touchevent'), false);
      self.canvas.addEventListener('touchend', $.proxy(self, '_touchevent'), false);
      self.canvas.addEventListener('touchcancel', $.proxy(self, '_touchevent'), false);
    }

    self.canvas.onselectstart = supressSelectCursor;
  };
  
  ColorStrip.prototype._preview = function(event, hex) {
  }

  ColorStrip.prototype._change = function(event) {
    var self = this, x, y, rgb;
    if (event.type === 'mousedown') {
      self._mousedown = true;
    } else if (event.type === 'mouseup') {
      self._mousedown = false;
    }
    
    if (self._mousedown) {
      x = event.pageX - self.element.offset().left;
      y = event.pageY - self.element.offset().top;
      rgb = self._rgbToHex(self._rgb(x, y));
      self.element.trigger('colorstripchange', rgb);

      if (self.options.change) {
        self.options.change.call(self.element, rgb);
      }
    }
  };

  ColorStrip.prototype._touchevent = function(event) {
    var touches = event.changedTouches,
      first = touches[0],
      eventMap = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup'
      },
      type = eventMap[event.type];

    if (!type) {
      return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
      first.screenX, first.screenY,
      first.clientX, first.clientY, false,
      false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);

    event.preventDefault();
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

  ColorStrip.prototype._rgb = function(x, y, width, height) {
    var width = width || this._width(),
      height = height || this._height(),
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
    colorstrip: function(options) {
      var element = $(this),
        opt = $.isFunction(options) ? { change: options } : options,
        colorstrip = new ColorStrip(element, opt);

      element.data('colorstrip', colorstrip);

      return this;
    }
  });
})(jQuery);
