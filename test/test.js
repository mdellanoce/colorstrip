module('colorstrip', {
  setup: function() {
    $('<canvas />').attr({
      width: 600,
      height: 100
    }).appendTo('#qunit-fixture');
  }
});

test('change color', function() {
  var canvas, i=0, colors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF7F'
  ];
  
  function point(x,y) {
    return {
      pageX: canvas.offset().left + x,
      pageY: canvas.offset().top + y
    };
  };
  
  expect(4);
  canvas = $('canvas').colorstrip(function(hex) {
    equal(hex, colors[i++], 'should change color');
  });
  
  canvas.trigger($.Event('mousedown', point(0, 100)));
  canvas.trigger($.Event('mousedown', point(0, 0)));
  canvas.trigger($.Event('mousedown', point(0, 50)));
  canvas.trigger($.Event('mousedown', point(300, 50)));
});
