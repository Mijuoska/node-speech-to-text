import SpeechToText from "./app.js";
import inquirer from "inquirer";

inquirer
    .prompt([{
        'type': 'list',
        'name': "Start Recording or Exit",
        'choices': ['R', 'E']
    }])
    .then((answers) => {
        const answer = answers["Start Recording or Exit"]
        if (answer === 'R') {
            new SpeechToText().convert()
        } else {
            process.exit()
        }


    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error("Prompt couldn't be rendered in the current environment")
        } else {
            console.error(error)
        }
    })