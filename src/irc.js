class IRC_message {
    constructor(author, text, time){
        this.author = author;
        this.text = text;
        this.time = time
    }
}

class IRC_gateway_connection {
    constructor(){
        this.irc_server_ip = "";
        this.message_buffer = [];
        this.request = new XMLHttpRequest();
        this.gatewayAddress = "https://pythonb.xyz:3001/ircgateway";
    }
    ircServerConnect(ip, port, channel, name){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"connect",
            "data":[ip, port, name, channel]
        }));
        return JSON.parse(this.request.response);
    }
    fetchChannels(){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"fetch",
            "data":["channels"]
        }));
        return JSON.parse(this.request.response);
    }
    channelConnect(channel){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"connect",
            "data":[channel]
        }));
        return JSON.parse(this.request.response);
    }
    fetchUserList(){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"fetch",
            "data":["users"]
        }));
        return JSON.parse(this.request.response);
    }
    fetchNewMessages(){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"fetch",
            "data":["messages"]
        }));
        return JSON.parse(this.request.response);
    }
    sendMessage(message){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"send",
            "data":[this.nickname, message]
        }));
        return JSON.parse(this.request.response);
    }
    end(){
        this.request.open("POST", this.gatewayAddress, false);
        this.request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        this.request.send(JSON.stringify({
            "command":"end",
            "data":[]
        }));
        return JSON.parse(this.request.response);
    }
}

export {IRC_message, IRC_gateway_connection}