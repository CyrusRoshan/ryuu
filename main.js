// x l->r 496 0-1023, y d->t 507 0-1023, (left shift/e), q, 800 to 5000
// buttons are 0 when pressed, 1 when unpressed

const SerialPort = require('serialport');
const robot = require('robotjs');

robot.setMouseDelay(10);

var arrowToggle = false;
var currentlyShooting = false;

SerialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});

try {
  var port = new SerialPort('COM3', function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
    console.log('THE GATES HAVE BEEN OPENED');

    var dataString = '';
    port.on('data', function (data) {
      data = data.toString('utf-8');
      dataString += data;

      if (!dataString.includes(']')) {
        return;
      }

      try {
        var arr = JSON.parse(dataString);
        console.log('WORKS', dataString);
        parseInput(arr);
      } catch (e) {
        console.log('DOESNT WORK', dataString);
        console.log(e);
      }
      dataString = '';
    });
  });
} catch (e) {
  console.log(e);
}

var previouslyShooting = false;
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

  // moveMouse(x, y, shooting);

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

  if (shooting) {
    robot.mouseToggle("down");

    setTimeout(function() {
      robot.mouseToggle("up");
    }, 1500);
  }
}

function moveMouse(x, y, click) {
  // x = mapRange(x, 0, 496*2, -2800, 2880);
  // y = mapRange(y, 0, 507*2, 1200, -1200);
  //
  //
  // var mouse = robot.getMousePos();
  // robot.dragMouse(mouse.x + x, mouse.y + y);
  //
  // console.log('----');
  // console.log(x, y);
  // console.log(mouse.x + x, mouse.y + y);

  // if (x > 550) {
  //   keyTap('numpad_6');
  // } else if (x < 450) {
  //   keyTap('numpad_4');
  // }
  //
  // if (y > 550) {
  //   keyTap('numpad_8');
  // } else if (y < 450) {
  //   keyTap('numpad_2');
  // }

}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
