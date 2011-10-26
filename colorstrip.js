(function($) {
  var colors = [
    '#FF0000',
    '#FFA500',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#2E0854',
    '#8D38C9'
  ];

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
