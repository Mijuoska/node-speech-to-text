import fs from 'fs'
import dotenv from 'dotenv'
import sdk from 'microsoft-cognitiveservices-speech-sdk'

dotenv.config();


const subscriptionKey = process.env.COGNITIVE_SERVICES_KEY;
const serviceRegion = "norwayeast"; 



function createAudioConfig(filename) {
    const pushStream = sdk.AudioInputStream.createPushStream();

    fs.createReadStream(filename).on('data', arrayBuffer => {
        pushStream.write(arrayBuffer.slice());
    }).on('end', () => {
        pushStream.close();
    });

    return sdk.AudioConfig.fromStreamInput(pushStream);
}

function createRecognizer(audiofilename, audioLanguage) {
    const audioConfig = createAudioConfig(audiofilename);
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = audioLanguage;

    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
}

export default createRecognizer

