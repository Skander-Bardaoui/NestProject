const socket = io('http://localhost:3001');

socket.on('receive_message', (msg) => {
  const messagesDiv = document.getElementById('messages');

  const div = document.createElement('div');
  div.innerText = `${msg.content} (${new Date(msg.date).toLocaleTimeString()})`;

  messagesDiv.appendChild(div);
});

document.getElementById('send').addEventListener('click', () => {
  const content = document.getElementById('content').value;

  if (!content) return;

  socket.emit('send_message', { content });

  document.getElementById('content').value = '';
});
