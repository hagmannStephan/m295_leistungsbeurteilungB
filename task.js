// Git repo: https://github.com/hagmannStephan/m295_leistungsbeurteilungB.git

const express = require('express');     // Setup the app
const app = express();

const session = require('express-session');     // Declare session
const { request } = require('http');

app.use(express.json());        // Enabels parsing of incoming json
app.use(session({               // Set up a session management
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

// Port, where the application is running
const port = 3000;

// List of the tasks
let tasks = [
    {
        "id": 1,
        "title": "finish work",
        "description": "finish the current practical exam",
        "done": false,
        "dueDate": "2023-12-20T15:30:00.871Z",
        "createdDate": new Date
    },
    {
        "id": 2,
        "title": "play guitar",
        "description": "learn a new song to play on the guitar",
        "done": false,
        "dueDate": "2023-12-24T18:00:00.871Z",
        "createdDate": new Date
    }
]

// Create the credentials to access the applicationS
const credentials = {"password": "m295"}

let token = ""      // Set an empty token (will be added to the cookie)
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');     // Used to create a random hexadeximal String for the "token" (source: https://stackoverflow.com/questions/58325771/how-to-generate-random-hex-string-in-javascript)

// Check user credentials and if valid, add email to cookie for identificaiton
app.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (password === credentials.password && email) {   // Check if the credentials are valid
            token = genRanHex(12);              // Generate random token
            request.session.token = token;      // Add email to the cookie
            return response.status(200).json({"success": token});
    }

    return response.status(401).send();
})

// Verify if the user is logged in by having a valid token in his cookie
app.get('/verify', (request, response) => {
    if (request.session.token === token) {
        return response.status(200).json({"state": "valid"});
    }
    if (!request.session.token) {
        return response.status(401).json({"status": "no cookie found"});
    }
    return response.status(401).json({"state": `not valid: ${request.session.token}`});
})

// Logout a user if he is currently logged in
app.delete('/logout', (request, response) => {
    request.session.token = "the cookie has expired";
    return response.status(204).send();
})

function verify (cookie, response) {
    if (!cookie) {      // Check if there is no cookie
        return response.status(403).json({"status": "no cookie found"});
    } else if (cookie === "the cookie has expired") {       // Check if the cookie is expired
        return response.status(403).json({"state": `not valid: ${cookie}`});
    }
}

// Query every task
app.get('/tasks', (request, response) => {
    let verification = verify(request.session.token, response);
    if (verification){         // Call a function to verify the cookie
        return verification;   // If something got returned, return that
    }

    return response.status(200).json(tasks);
})

// Create a new task and return that task (if successful)
app.post('/tasks', (request, response) => {
    let verification = verify(request.session.token, response);
    if (verification){
        return verification; 
    }

    const id = tasks[tasks.length - 1].id + 1;
    const title = request.body.title;
    const description = request.body.description;
    let done = request.body.done;
    let dueDate = request.body.dueDate;
    const createdDate = new Date;

    if (!done) {        // Set done to false by standard
        done = false;
    }

    if (!dueDate) {     // If no dueDate is provided, there will be no due date
        dueDate = "";
    }

    if (!title || !description) {   // Check if required values are set
        return response.status(422).send();
    }

    const task = {          // Create the new task object
        "id": id,
        "title": title,
        "description": description,
        "done": done,
        "dueDate": dueDate,
        "createdDate": createdDate
    }

    tasks.push(task);       // Add object to tasks

    return response.status(201).json(task);
})

// Query for a specific task by id
app.get('/tasks/:id', (request, response) => {
    let verification = verify(request.session.token, response);
    if (verification){
        return verification; 
    }
    
    const id = parseInt(request.params.id); // Get the provided id
    let task = tasks.findIndex((task) => task.id === id);
    task = tasks[task];                      // Get the corresponding object

    if(!task) {                             // Check if a task got found
        return response.status(404).send();
    }

    return response.status(200).json(task);
})

app.put('/tasks/:id', (request, response) => {
    let verification = verify(request.session.token, response);
    if (verification){
        return verification; 
    }
    
    const id = parseInt(request.params.id); // Get the provided id
    let task = tasks.findIndex((task) => task.id === id);
    task = tasks[task];                      // Get the corresponding object

    if(!task) {                             // Check if a task got found
        return response.status(404).send();
    }

    let title = request.body.title;       // Get the provided values
    let description = request.body.description;
    let done = request.body.done;
    let dueDate = request.body.dueDate;

    if (!title) {                       // If not provided, do not update the field
        title = task.title;
    }

    if (!description) {
        description = task.description;
    }

    if(!done) {
        done = task.done;
    }

    if(!dueDate) {
        dueDate = task.dueDate;
    }

    let updated_task = {            // Create the updated task-object
        "id": task.id,
        "title": title,
        "description": description,
        "done": done,
        "dueDate": dueDate,
        "createdDate": task.createdDate
    }

    task = updated_task;        // Modify the existing task to the updated task

    return response.status(200).json(updated_task);
})

app.delete('/tasks/:id', (request, response) => {
    let verification = verify(request.session.token, response);
    if (verification){
        return verification; 
    }
    
    const id = parseInt(request.params.id); // Get the provided id
    let taskIndex = tasks.findIndex((task) => task.id === id);
    let task = tasks[taskIndex];                      // Get the corresponding object

    if(!task) {                             // Check if a task got found
        return response.status(404).send();
    }

    tasks.splice(taskIndex, 1);             // Remove the entry from the list

    return response.status(200).json(task);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
