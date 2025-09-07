import { host } from "./config/network.js"

const ws = new WebSocket(`ws://${host.ip}:${host.port}`);
console.log("Worker ready");

// html elements
sendButton; messageField; recipientField; usersList;

// data
let username;
const users = {};

// functions
function send(data) {
    ws.send(data);
}
window.send = send;

function addUser(name) {

    // lockout
    if (users[name]?.connected) {
        // ignore if the user is connected
        return;
    } else if (users[name]) {
        // if the user is not connected
        document.querySelector(`[data-user="${name}"]`).classList.remove("removed");
        return;
    }
    users[name] = {connected: true};

    const li = document.createElement("li");
    li.innerText = name;
    li.dataset.user = name;
    usersList.appendChild(li);

}

function removeUser(name) {
    const element = document.querySelector(`[data-user="${name}"]`);
    element?.classList?.add("removed");
    users[name].connected = false;
}

ws.onopen = () => {
    console.log("Connected to queen");
    username = prompt("name");
    if (!username) ws.close();
    send(JSON.stringify({
        type: "join",
        passphrase: "pls can i join the hive",
        name: username,
    }));

    send(JSON.stringify({
        type: "get users",
        name: username,
    }));
};

ws.onmessage = (event) => {
    console.log("Queen:", event.data)

    const message = JSON.parse(event.data.toString());

    switch (message.type) {

        case "send":
            alert(`${message.sender} says: "${message.text}"`);
            break;
        
        case "add user":
            addUser(message.content.name);
            break;
        
        case "remove user":
            removeUser(message.content.name);
            break;

        case "get users":
            console.log(message);
            console.log(message.content);
            console.log(message.content.users);
            message.content.users.forEach((name) => {
                addUser(name);
            });
            break;
        
        case "success":
            break;
        
        case "error":
            alert(`error: ${message.content.text}`);
            break;
        
        case "other":
            alert(`Queen says: ${message.content.text}`);
            break;

        default:
            alert("unrecognised message from queen");
            break;
    }
};

ws.onclose = () => {
    console.log("Disconnected from queen");
};

sendButton.addEventListener("click", function() {
    const message = {
        type: "send",
        text: messageField.value,
        recipient: recipientField.value,
        name: username,
    };
    send(JSON.stringify(message));
})