/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-syslog',{

	messages: [],

	defaults: {
		max: 20,
		title: "Notifications",
		format: false,
		error_color: "yellow",
		warning_color: "cyan",
		info_color: "green",
		types: {
			INFO: "dimmed",
			WARNING: "normal",
			ERROR: "bright"
		},
		icons: {
			INFO: "info",
			WARNING: "exclamation",
			ERROR: "exclamation-triangle"
		},
		customEvents: [],
		shortenMessage: false,
    alert: true
	},

	getTypeColor: function(type) {
		if (type === "ERROR") {
			return this.config.error_color;
		}
		if (type === "WARNING") {
			return this.config.warning_color;
		}
		if (type === "INFO") {
			return this.config.info_color;
		}
		return null;
	},

	findCustomEvent: function(message) {
		if (!Array.isArray(this.config.customEvents) || typeof message !== "string") {
			return null;
		}

		for (var i = 0; i < this.config.customEvents.length; i++) {
			var eventConfig = this.config.customEvents[i];
			if (!eventConfig || typeof eventConfig.keyword !== "string") {
				continue;
			}

			if (message.toLowerCase().includes(eventConfig.keyword.toLowerCase())) {
				return eventConfig;
			}
		}

		return null;
	},

	getStyles: function () {
		return ["font-awesome.css"];
	},

	getScripts: function() {
		return ["moment.js"];
	},

	start: function() {
		this.sendSocketNotification("CONNECT", {max: this.config.max, logFile: this.file('logs.json')});
		Log.info("Starting module: " + this.name);
		moment.locale(config.language);

		//Update DOM every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(() => {
			this.updateDom();
		}, 60000);
	 },

	socketNotificationReceived: function(notification, payload) {
		if(notification === "NEW_MESSAGE"){
      if (this.config.alert && !payload.silent) {
			  this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.type, message: payload.message});
      }
			this.messages.push(payload);
			while(this.messages.length > this.config.max){
				this.messages.shift();
			}
			this.updateDom(3000);
		}
	 },

	getDom: function() {

		var wrapper = document.createElement("div");
		if(this.config.title !== false){
			var title = document.createElement("header");
			title.textContent = this.config.title || this.name;
			wrapper.appendChild(title);
		}
		var logs = document.createElement("table");

		for (var i = this.messages.length - 1; i >= 0; i--) {
			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.classList.add("normal");
			var customEvent = this.findCustomEvent(this.messages[i].message);
			var typeColor = this.getTypeColor(this.messages[i].type);
			var eventColor = customEvent && customEvent.color ? customEvent.color : null;
			var textColor = eventColor || typeColor;

			var iconCell = document.createElement("td");
			var icon =  document.createElement("i");
			var iconName = null;
			if (customEvent && customEvent.symbol) {
				iconName = customEvent.symbol;
			} else if(this.config.icons.hasOwnProperty(this.messages[i].type)){
				iconName = this.config.icons[this.messages[i].type];
			}

			if (iconName) {
				icon.classList.add("fa", "fa-fw", "fa-" + iconName);
			}
			else {
				icon.classList.add("fa", "fa-fw", "fa-question");
			}
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				icon.classList.add(this.config.types[this.messages[i].type]);
			}

			iconCell.classList.add("small");
			if (textColor) {
				icon.style.color = textColor;
			}

			iconCell.appendChild(icon);
			callWrapper.appendChild(iconCell);

			var message = this.messages[i].message;
			if(this.config.shortenMessage && message.length > this.config.shortenMessage){
				message = message.slice(0, this.config.shortenMessage) + "&#8230;";
			}
			//Set caller of row
			var caller =  document.createElement("td");
			caller.textContent = " " + message;
			caller.classList.add("title", "small", "align-left");
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				caller.classList.add(this.config.types[this.messages[i].type]);
			}
			if (textColor) {
				caller.style.color = textColor;
			}
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
			time.textContent = this.config.format ? moment(this.messages[i].timestamp).format(this.config.format) : moment(this.messages[i].timestamp).fromNow();
			time.classList.add("time", "light", "xsmall");
			callWrapper.appendChild(time);

			//Add to logs
			logs.appendChild(callWrapper);
		}
		wrapper.appendChild(logs);
		return wrapper;
	}
});
