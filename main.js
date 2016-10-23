// x l->r 496 0-1023, y d->t 507 0-1023, (left shift/e), q, 800 to 5000
// buttons are 0 when pressed, 1 when unpressed
const robot = require('robotjs');
robot.setMouseDelay(10);

var arrowToggle = false;
var mouseToggle = false;

function parseInput(arr) {
  var x = Number(arr[0]);
  var y = Number(arr[1]);
  var arrowType = !Number(arr[2]);
  var ult = !Number(arr[3]);
  var dragging = Number(arr[4]);

  var shooting = false;
  if (dragging > 800) {
    shooting = true;
  }

  moveMouse(x, y, shooting);

  if (arrowType) {
    if (arrowToggle) {
      robot.keyTap('shift');
    } else {
      robot.keyTap('e');
    }
    arrowToggle = !arrowToggle
  }

  if (ult) {
    robot.keyTap('q');
  }
}

function moveMouse(x, y, click) {
  x = mapRange(x, 0, 496*2, 0, 2880);
  y = mapRange(y, 0, 507*2, 1800, 0);
  robot.dragMouse(x, y);

  if (mouseToggle != click) {
    robot.mouseToggle();
    mouseToggle = click;
  }
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
