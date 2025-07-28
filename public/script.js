const socket = io();
let username = '';

function setUsername() {
    const input = document.getElementById('username');
    const name = input.value.trim();

    if (name === '') {
        alert('Please enter a valid name!');
        return;
    }

    username = name;
    socket.emit('set username', username);

    document.getElementById('username-container').style.display = 'none';
    document.getElementById('chat-area').style.display = 'block';
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (message === '') return;

    if (!username) {
        alert('Please enter your name first!');
        return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    socket.emit('chat message', { user: username, text: message, time: timestamp });

    input.value = '';
}

socket.on('chat message', (data) => {
    const messages = document.getElementById('messages');
    const msgElement = document.createElement('div');

    msgElement.classList.add('message');
    msgElement.classList.add(data.user === username ? 'sender' : 'receiver');

    msgElement.innerHTML = `<strong>${data.user}:</strong> ${data.text} <span class="timestamp">${data.time}</span>`;

    messages.appendChild(msgElement);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('error message', (errorMsg) => {
    alert(errorMsg);
});

function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}
