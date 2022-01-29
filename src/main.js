const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io("http://127.0.0.1:4000/");

// Join the chat room
socket.emit("joinRoom", { username, room });

// handle message event from server
socket.on("message", (message) => {
	// call the function to render the message from the server
	outputMessage(message);
	// Scroll to the bottom
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// Message submit
chatForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	// Get message text
	let msg = e.target.elements.msg.value;
	msg = msg.trim();
	if (!msg) {
		return false;
	}
	// Emit message to server
	socket.emit("chatMessage", msg);
	// Clear input
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

// // Output message to DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	const p = document.createElement("p");
	p.classList.add("meta");
	p.innerText = message.username;
	p.innerHTML += `<span> ${message.time}</span>`;
	div.appendChild(p);
	const para = document.createElement("p");
	para.classList.add("text");
	para.innerText = message.text;
	div.appendChild(para);
	document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
	${users
		.map((user) => {
			return `<li>${user.username}</li>`;
		})
		.join("")}
  `;
}

// //Prompt the user before leave chat room
document?.getElementById("leave-btn").addEventListener("click", () => {
	const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
	if (leaveRoom) {
		window.location = "./index.html";
	} else {
	}
});
