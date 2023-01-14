import fs from 'fs';
import path from 'path';
import AudioRecorder from 'node-AudioRecorder'
import { createRecognizer } from '.text-to-speech'


// Options is an optional parameter for the constructor call.
// If an option is not given the default value, as seen below, will be used.
const options = {
program: `sox`, // Which program to use, either `arecord`, `rec`, or `sox`.
  //  device: null, // Recording device to use, e.g. `hw:1,0`
    bits: 16, // Sample size. (only for `rec` and `sox`)
    channels: 1, // Channel count.
    encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
    rate: 16000, // Sample rate.
    type: `wav`, // Format type.

    // Following options only available when using `rec` or `sox`.
    silence: 1, // Duration of silence in seconds before it stops recording.
    thresholdStart: 0.5, // Silence threshold to start recording.
    thresholdStop: 0.5, // Silence threshold to stop recording.
    keepSilence: false, // Keep the silence in the recording.
}
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = console

let audioRecorder = new AudioRecorder(options, logger)

const DIRECTORY = process.env.RECORDINGS_DIRECTORY

// Create path to write recordings to.
if (!fs.existsSync(DIRECTORY)) {
  fs.mkdirSync(DIRECTORY);
}



// Create file path with random name.
const fileName = path.join(
  DIRECTORY,
  Math.random()
  .toString(36)
  .replace(/[^0-9a-zA-Z]+/g, '')
  .concat('.wav')
);

// Create write stream.
const fileStream = fs.createWriteStream(fileName, {
  encoding: 'binary'
});

// Start and write to the file.
audioRecorder.start().stream().pipe(fileStream);


// Keep process alive.
// process.stdin.resume();
console.warn('Press ctrl+c to exit.');


// Log information on the following events.
audioRecorder.on('error', function () {
  console.warn('Recording error.');
});

audioRecorder.on('close', recordingCallback);


function recordingCallback() {
  const language = "en-US";
  let recognizer = createRecognizer(fileName, language);
  recognizer.recognizeOnceAsync(
    result => {
    //  console.log(result)
      const resultJson = JSON.parse(result.privJson)
      if (resultJson.DisplayText) {
      console.log(`You said: ${resultJson.DisplayText}`)
        } else {
          console.log('Sorry, what you said was not recognizable')
        }
      recognizer.close();
      recognizer = undefined;
    },
    err => {
      console.trace("err - " + err);

      recognizer.close();
      recognizer = undefined;
    });
    fs.unlink(fileName)
}







