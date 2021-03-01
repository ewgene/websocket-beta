<template>
	<div id="app">
		<div class="custom-page">
			<div class="container medium">
			<div class="chat-box">
				<div class="chat-box__header">
					<div class="header__container responsive container">
					<input v-if="!isLogged"
						v-model="userName" 
						v-on:keydown.enter="setName(userName)" class="input-style"
						placeholder="Представьтесь">
						<strong v-else>
							{{userName}}
						</strong><br /><br />
					</div>
				</div>
				<h1 class="main-title">Добро пожаловать в онлаин-чат службы поддержки</h1>
				<br />
				<div class="chat-box__messages">
					<div class="chat-box__separator">
						{{dateToday}}
					</div>
					<div v-for="value in messages" 
						:key="value.index" 
						class="chat-box__message">
						<div class="name">{{ value.name }}</div>
						<div class="message">{{ value.text }}</div>
						<div class="time">{{ value.time }}</div>
						<div class="clear"></div>
					<br /><br />
					</div>
				</div>
				<div class="chat-box__form main-form">
					<textarea v-model="message" class="input-style" rows="7"></textarea>
					<div class="row">
						<button 
							v-on:click=sendMessage 
							class="radius-button standart rounded">
							Отправить
						</button>
					</div>
				</div>
			</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

export default {

	name: 'App',

	data: function() {
		return {
			connection: null,
			message: null,
			messages: [],
			userName: null,
			isLogged: false,
			dummy: null,
			dateToday: null,
			timeNow: null,
		}
	},

	methods: {
		moment: function () {
			return moment.locale();
		},

		sendMessage: function(dummy) {
			let time = new Date()
			dummy = {
				"name": this.userName,
				"text": this.message,
				"time": moment(time).format('HH:mm')
			}
			console.log(JSON.stringify(dummy))
			this.connection.send(JSON.stringify(dummy))
			this.message = null;
		},

		setName: function(userName) {
			console.log(userName);
			this.userName = userName;
			this.isLogged =  true;
		},

		scrollToEnd: function() {
			var container = this.$el.querySelector('.chat-box__messages');
			container.scrollTop = container.scrollHeight;
		}
	},

	created: function() {
		console.log("Starting connection to WebSocket Server")
		this.connection = new WebSocket("ws://localhost:8000/")
		moment.locale('ru')

		const self = this
		const date = new Date()
		this.dateToday = moment(date).format('DD MMMM')
		console.log(this.dateToday)

		this.connection.onmessage = function(event) {
			if (!self.message) {
				self.messages.push(JSON.parse(event.data))
			} else {
				self.timeNow = new Date().getTime()
				console.log(JSON.stringify(self.dummy))
				this.$emit('sendMessage', JSON.stringify(self.dummy));
			}
		}

		this.connection.onopen = function(event) {
			console.log(event)
			console.log("Successfully connected to the echo websocket server...")
		}
	},

	updated: function() {
		var target = this.$el.querySelector('.chat-box__messages')
		if(this.messages.length) {
			var count = this.messages.length - 1
			if (this.messages[count].name==this.userName) {
				target.lastChild.classList.add('own')
			}
		}
		this.scrollToEnd()
	}
}
</script>

<style>
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	margin-top: 60px;
}

.chat-box__message::after {
	width: 100%;
	display: block;
	clear: both;
}

</style>