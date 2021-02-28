// const io = io("https://midominio.com/");
const socket = io();

let chat = document.getElementById('chat');
let username = document.getElementById('username');
let output = document.getElementById('chatListado');
let mensaje = document.getElementById('chatMensaje');
let escribiendo = document.getElementById('chatEscribiendo');
let user = {
	id: '',
	nombre: ''
}

function enviar() {
	socket.emit('chat:mensaje', {
		nombre: user.nombre,
		mensaje: mensaje.value
	});
	mensaje.value = "";
}


document.getElementById('saveUsername').addEventListener('click', (e) => {
	e.preventDefault();
	user.nombre = username.value;
	username.setAttribute('disabled', true);
	e.target.style = 'display:none';
	chat.classList.remove("d-none");
});
document.getElementById('chatEnviar').addEventListener('click', enviar);

mensaje.addEventListener("keydown", event => {
	// if (event.isComposing || event.key == "Enter" || event.keyCode === 13) {
	if (event.key == "Enter" || event.keyCode === 13) {
		enviar();
	}else{
		if (mensaje.value != "") {
			socket.emit('chat:escribiendo', {
				nombre: user.nombre
			});
		}else{
			escribiendo.innerHTML = "";
		}
	}
})


socket.on('chat:usuario', (datos) => {
	console.log(datos);
	// user.nombre = username.value;
	user.id = datos.id;
});

socket.on('chat:escribiendo', (datos) => {
	escribiendo.innerHTML = datos.mensaje;
});

socket.on('chat:mensaje', (datos) => {
	escribiendo.innerHTML = "";
	if (datos.id != user.id) {
		output.innerHTML += `
			<div class="col-sm-12 mb-1">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">${datos.nombre}</h5>
						<p class="card-text">${datos.mensaje}</p>
					</div>
				</div>
			</div>
		`;
	}else{
		output.innerHTML += `
			<div class="col-sm-12 mb-1">
				<div class="card text-end">
					<div class="card-body">
						<h5 class="card-title">${datos.nombre}</h5>
						<p class="card-text">${datos.mensaje}</p>
					</div>
				</div>
			</div>
		`;
	}

	output.scrollTop = output.scrollHeight;
});
