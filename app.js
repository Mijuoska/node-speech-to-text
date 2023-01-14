import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import audioRecorder from './recorder.js';
import createRecognizer from './texttospeech.js'

dotenv.config()

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

audioRecorder.on('close', recognize);

function recognize() {
    const language = process.env.RECOGNITION_LANGUAGE;
    let recognizer = createRecognizer(fileName, language);
    recognizer.recognizeOnceAsync(
        result => {
             console.log(result)
             if (!result.privJson) {
                console.error(`There was an error connecting to the speech recognition service. Details: ${result.privErrorDetails}`)
             } else {
            const resultJson = JSON.parse(result.privJson)
            if (resultJson.DisplayText) {
                console.log(`You said: ${resultJson.DisplayText}`)
            } else {
                console.log('Sorry, what you said was not recognizable')
            }
            recognizer.close();
            recognizer = undefined;
        }
    }
        ,
        err => {
            console.trace("err - " + err);

            recognizer.close();
            recognizer = undefined;
        });
        
    // fs.unlink(fileName, function() {
    //     console.log(`${fileName} deleted`)
    // })
}
