// x l->r 496 0-1023, y d->t 507 0-1023, (left shift/e), q, 800 to 5000
// buttons are 0 when pressed, 1 when unpressed

// const SerialPort = require('serialport');
const robot = require('robotjs');
const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

robot.setMouseDelay(10);

const bluetoothAddress = '20-16-05-25-41-99';
var arrowToggle = false;
var mouseToggle = false;

// try {
//   var port = new SerialPort('/dev/tty-usbserial1', function (err) {
//     if (err) {
//       return console.log('Error: ', err.message);
//     }
//     console.log('THE GATES HAVE BEEN OPENED');
//
//     port.on('data', function (data) {
//       console.log(data);
//       try {
//         var arr = JSON.parse(data);
//         parseInput(arr);
//       } catch (e) {
//         console.log(e);
//       }
//     });
//   });
// } catch (e) {
//   console.log(e);
// }


function parseInput(arr) {
  var x = Number(arr[0]);
  var y = Number(arr[1]);
  var arrowType = !Number(arr[2]);
  var ult = !Number(arr[3]);
  var dragging = Number(arr[4]);

  var shooting = false;
  if (dragging > 1000) {
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
  console.log(x, y);
  console.log(mouseToggle);
  robot.moveMouse(x, y);

  if (mouseToggle != click) {
    robot.mouseToggle();
    mouseToggle = click;
  }
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var rawSerialString = '';
btSerial.on('found', function(address, name) {
  if(address === bluetoothAddress) {
    process.stdout.write('Arduino found, connecting... ');
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('Done!');

            btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
                if (err) console.log(err);
            });

            btSerial.on('data', function(data) {
              rawSerialString += data.toString('utf-8');

              if (!rawSerialString.includes(']')) {
                return;
              }

              try {
                var arr = JSON.parse(rawSerialString);
                console.log(rawSerialString);
                parseInput(arr);
              } catch (e) {
                // console.log('DATA:', data.toString('utf-8'));
                // console.log("TRANSMISSION ERROR:", e)
                rawSerialString = '';
              }
            });
        }, function () {
            console.log('Connection Error Type 1');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('Connection Error Type 2');
    });
  }
});

btSerial.inquire();
