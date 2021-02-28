// const io = io("https://midominio.com/");
const socket = io();

let chat = document.getElementById('chat');
let username = document.getElementById('username');
let output = document.getElementById('chatListado');
let mensaje = document.getElementById('chatMensaje');
let escribiendo = document.getElementById('chatEscribiendo');
let conectados = document.getElementById('chatConectados');
let user = {
	id: '',
	nombre: ''
}

function enviar(event) {
	event.preventDefault()
	if (mensaje.value != "") {
		socket.emit('chat:mensaje', {
			nombre: user.nombre,
			mensaje: mensaje.value
		});
		mensaje.value = "";
	}
}


document.getElementById('saveUsername').addEventListener('click', (e) => {
	e.preventDefault();
	user.nombre = username.value;
	username.setAttribute('disabled', true);
	e.target.style = 'display:none';
	chat.classList.remove("d-none");

	document.getElementById('listadoConectados').classList.remove("d-none");
	socket.emit('chat:ingreso', user);
});
document.getElementById('chatEnviar').addEventListener('click', enviar);

mensaje.addEventListener("keydown", event => {
	// if (event.isComposing || event.key == "Enter" || event.keyCode === 13) {
	if (event.key == "Enter" || event.keyCode === 13) {
		enviar(event);
	}else{
		socket.emit('chat:escribiendo', {
			nombre: user.nombre,
			mensaje: mensaje.value
		});
	}
})


socket.on('chat:ingreso', (datos) => {
	console.log(datos);

	/* conectados.innerHTML = "";
	datos.forEach(element => {
		conectados.innerHTML += `
			<li class="media">
				<div class="media-body">
					<div class="mt-0 mb-1 font-weight-bold">${element.nombre}</div>
					<div class="text-success text-small font-600-bold"><i class="fas fa-circle"></i> Online</div>
				</div>
			</li>
		`;
	}); */
});

socket.once('chat:usuario', (datos) => {
	console.log(datos);
	// user.nombre = username.value;
	user.id = datos.id;
});

socket.on('chat:escribiendo', (datos) => {
	// escribiendo.innerHTML = datos.mensaje;
	if (datos.mensaje != "") {
		escribiendo.classList.remove("d-none");
		escribiendo.innerHTML = `
			<div class="chat-item chat-left chat-typing" style="">
				<img src="https://demo.getstisla.com/assets/img/avatar/avatar-4.png">
				<div class="chat-details">
					<div class="chat-text"></div>
				</div>
			</div>
		`;
	}else{
		escribiendo.classList.add("d-none");
		escribiendo.innerHTML = "";
	}
});

socket.on('chat:mensaje', (datos) => {
	escribiendo.innerHTML = "";
	escribiendo.classList.add("d-none");
	let date = new Date();
	if (datos.id === user.id) {
		output.innerHTML += `
			<div class="chat-item chat-right">
				<img src="https://demo.getstisla.com/assets/img/avatar/avatar-1.png">
				<div class="chat-details">
					<div class="chat-text">
						<p class="m-0"><b>${datos.nombre}: </b></p>
						${datos.mensaje}
					</div>
					<div class="chat-time">${ date.toLocaleTimeString() }</div>
				</div>
			</div>
		`;
	}else{
		output.innerHTML += `
			<div class="chat-item chat-left">
				<img src="https://demo.getstisla.com/assets/img/avatar/avatar-4.png">
				<div class="chat-details">
					<div class="chat-text">
						<p class="m-0"><b>${datos.nombre}: </b></p>
						${datos.mensaje}
					</div>
					<div class="chat-time">${ date.toLocaleTimeString() }</div>
				</div>
			</div>
		`;
	}

	output.scrollTop = output.scrollHeight;
});
