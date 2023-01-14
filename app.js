import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import audioRecorder from './recorder.js';
import createRecognizer from './speech-recognition.js'

dotenv.config()



class Main {
    constructor(audioRecorder, createRecognizer) {
    this.DIRECTORY = process.env.RECORDINGS_DIRECTORY
    this.LANGUAGE = process.env.RECOGNITION_LANGUAGE
    this.recorder = audioRecorder;
    this.createRecognizer = createRecognizer;
    console.log(this.createRecognizer)
    this.filename = '';

    // Log information on the following events.
    this.recorder.on('error', function () {
        console.warn('Recording error.');
    });

    this.recorder.on('close', this.recognize.bind(this));

}
    createDirectory() {
        if (!fs.existsSync(this.DIRECTORY)) {
            fs.mkdirSync(this.DIRECTORY);
        }
    }
    createFile() {
        // Create file path with random name.
        const fileName = path.join(
            this.DIRECTORY,
            Math.random()
            .toString(36)
            .replace(/[^0-9a-zA-Z]+/g, '')
            .concat('.wav')
        );

         this.fileName = fileName;
    }

    recordToFile() {
        // Create write stream.
        const fileStream = fs.createWriteStream(this.fileName, {
            encoding: 'binary'
        });

        // Start and write to the file.
        this.recorder.start().stream().pipe(fileStream);
        console.log('Now recording...')
        // Keep process alive.
        process.stdin.resume();
        console.warn('Press ctrl+c to exit.');
    }

    recognize() {
        let recognizer = this.createRecognizer(this.fileName, this.LANGUAGE);
        recognizer.recognizeOnceAsync(
            result => {
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
                    fs.unlinkSync(this.fileName)

                }
            },
            err => {
                console.trace("err - " + err);

                recognizer.close();
                recognizer = undefined;
                fs.unlinkSync(this.fileName)


            }

        );

    }


}

const app = new Main(audioRecorder, createRecognizer)

app.createDirectory();
app.createFile();
app.recordToFile();








