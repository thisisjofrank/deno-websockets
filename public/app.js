// Initialize WebSocket connection
const myUsername = prompt("Please enter your name") || "Anonymous";
const socket = new WebSocket(`ws://localhost:8080/start_web_socket?username=${myUsername}`);

// Handle WebSocket messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case "update-users":
      updateUserList(data.usernames);
      break;

    case "send-message":
      addMessage(data.username, data.message);
      break;
  }
};

// Update user list in the DOM
function updateUserList(usernames) {
  const userList = document.getElementById("users");
  userList.innerHTML = ""; // Clear existing list

  for (const username of usernames) {
    const listItem = document.createElement("li");
    listItem.textContent = username;
    userList.appendChild(listItem);
  }
}

// Add a new message to the conversation
function addMessage(username, message) {
  const conversation = document.getElementById("conversation");
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = `<span>${username}</span> ${message}`;
  conversation.prepend(messageDiv);
}

// Set up event listener for sending messages
window.onload = () => {
  const inputElement = document.getElementById("data");
  const sendButton = document.getElementById("send");

  // Listen for Enter key press
  inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const message = inputElement.value;
      inputElement.value = "";
      socket.send(JSON.stringify({ event: "send-message", message }));
    }
  });

  // Listen for button click
  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    const message = inputElement.value;
    inputElement.value = "";
    socket.send(JSON.stringify({ event: "send-message", message }));
  });
};

