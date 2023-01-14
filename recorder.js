
import AudioRecorder from 'node-AudioRecorder'

const DEBUG_MODE = process.env.DEBUG_MODE == 'true'
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

    silence: 1, // Duration of silence in seconds before it stops recording.
    thresholdStart: 0.5, // Silence threshold to start recording.
    thresholdStop: 0.5, // Silence threshold to stop recording.
    keepSilence: false, // Keep the silence in the recording.
}
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = DEBUG_MODE ? console : null;

const audioRecorder = new AudioRecorder(options, logger)

export default audioRecorder





