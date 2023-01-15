import inquirer from 'inquirer';

inquirer
    .prompt([
        {'type': 'list', 'name': "Start Recording or Exit", 'choices': ['R', 'E']}
    ])
    .then((answers) => {
        console.log(answers["Start Recording or Exit"])
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    })