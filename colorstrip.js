(function($) {
  var colors = [
    '#FF0000',
    '#FFA500',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#2E0854',
    '#8D38C9',
    '#000000'
  ];
  
  function blend(from, to, alpha) {
    alpha = Math.min(1, Math.max(alpha, 0));
    return from*alpha + to*(1-alpha);
  };
  
  function alpha(range, x) {
    return 0.5*Math.sin((Math.PI/range)*(x+range/2))+0.5;
  };

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
    var gradient = this.context.createLinearGradient(0, 0, this.element.width(), 0);
    for (var i = 0, ii = colors.length; i < ii; i++) {
      gradient.addColorStop(i/ii, colors[i]);
    }
    this.context.rect(0, 0, this.element.width(), this.element.height());
    this.context.fillStyle = gradient;
    this.context.fill();

    this._saturate();
  };

  ColorStrip.prototype._saturate = function() {
    var width = this.element.width(),
      height = this.element.height();
    pixels = this.context.getImageData(0, 0, width, height);

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var i = (x + y * width) * 4;
        var r = pixels.data[i];
        var g = pixels.data[i+1];
        var b = pixels.data[i+2];
        var a = alpha(height, y);

        pixels.data[i] = blend(r, 255, a);
        pixels.data[i+1] = blend(g, 255, a);
        pixels.data[i+2] = blend(b, 255, a);
      }
    }

    this.context.putImageData(pixels, 0, 0);
  };

  $.fn.extend({
    colorstrip: function() {
      var element = $(this),
        colorStrip = new ColorStrip(element);
      element.data('colorstrip', colorstrip);
      return this;
    }
  });
})(jQuery);
