import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import "./index.sass"
import {IRC_message, IRC_gateway_connection} from "./irc.js"

var message_log = [];
var user_list = [];

var shouldRerender = true;
var registered = false;
var gateway_connection = new IRC_gateway_connection();
var nickname, address, port, channel;

class TopBar extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="topbar">
                <h1>REACTive IRC</h1>
                <h2> - irc client written in React</h2>
            </div>
        )
    }
}
class SecondBar extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div id="secondbar">
                <div id="segment1">
                    <h3>Chat</h3>
                </div>
                <div id="segment2">
                    <h3>MyChat</h3>
                </div>
                <div id="segment3">
                    <h3>Users</h3>
                </div>
                <hr/>
            </div>
        )
    }
}
/*class ChatList extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="channellist">
                <p>
                    <span className="chatlist-entry">#channel1</span><br/>
                    <span className="chatlist-entry">#channel2</span><br/>
                    <span className="chatlist-entry">#channel3</span><br/>
                    <span className="chatlist-entry">#channel4</span><br/>
                    <span className="chatlist-entry">#channel5</span>
                </p>
            </div>
        )
    }
}*/
class ChatLog extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            message_log.map(function(msg){
                return (<div className="line"><span className="username">{msg.author}</span>: <span className="message">{msg.text}</span><span className="time">{msg.time}</span><br/></div>)
            })
        )
    }
}
class MessageField extends React.Component {
    constructor(props){
        super(props)
    }
    state = {
        msg: ""
    };
    
    onChange = (e) => {
        this.setState({
            msg: e.target.value
        });
    };
    
    onSubmitEvent = (e) => {
        e.preventDefault();
        const { msg } = this.state;
        this.msg = "";
        if(msg == ""){
            return;
        }
        // send message
        gateway_connection.sendMessage(msg)
        shouldRerender = true;
    };
    render(){
        return (
            <div id="messagefield">
                <form onSubmit={this.onSubmitEvent}>
                    <input type="text" id="msg" placeholder="Enter message" onChange={this.onChange}/>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        )
    }
}
class ChatWindow extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="chatwindow">
                <div id="chatlog">
                    <ChatLog/>
                </div>
                <MessageField/>
            </div>
        )
    }
}
class UserList extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            user_list.map(function(username){
                return(<span className='userlist-entry'>{username}</span>)
            })
        )
    }
}

class RegistrationForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nickname: "",
            address: "irc.freenode.net",
            port: "6667",
            channel: "#anonchat",
            cookies: "No"
        }
        if(document.cookie != ""){
            var cookie_state = JSON.parse(document.cookie);
            this.state.nickname = cookie_state.nickname;
            this.state.address = cookie_state.address;
            this.state.port = cookie_state.port;
            this.state.channel = cookie_state.channel;
            this.state.cookies = cookie_state.cookies;
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onChange(event){
        this.setState({[event.target.name] : event.target.value});
        console.log({[event.target.name] : event.target.value})
        
    }
    onSubmit(event){
        event.preventDefault();
        if(this.state.nickname == "" || this.state.address == "" || this.state.port == "" || this.state.channel == "" || this.state.cookies == ""){
            // No
        } else {
            nickname = this.state.nickname;
            address = this.state.address;
            port = this.state.port;
            channel = this.state.channel;
            registered = true;
            if(this.state.cookies == "Yes"){
                document.cookie = JSON.stringify(this.state);
            } else if(this.state.cookies == "No"){
                document.cookie = "";
            }
            gateway_connection.ircServerConnect(nickname, address, parseInt(port), channel);
        }
    }
    render(){
        return(
            <div id="registration">
                Welcome to ReactiveIRC - web based IRC client, which is capable of performing non-websocket based connection, therefore supporting each and every IRC server out there.
                <br/>
                <form onSubmit={this.onSubmit}>
                    <label>
                        Nickname:
                    </label>
                    <input type="text" name="nickname" value={this.state.nickname || ""} onChange={this.onChange}/><br/>
                    <label>
                        Server address:
                    </label>
                    <input type="text" name="address" value={this.state.address || "irc.freenode.net"} onChange={this.onChange}/><br/>
                    <label>
                        Server Port:
                    </label>
                    <input type="number" name="port" value={this.state.port || "6667"} onChange={this.onChange}/><br/>
                    <label>
                        Channel with #:
                    </label>
                    
                    <input type="text" name="channel" value={this.state.channel || "#anonchat"} onChange={this.onChange}/><br/>
                    <div onChange={this.onChange}>
                        <label id="spacing">
                            &nbsp;
                        </label>
                        <input type="radio" name="cookies" value="Yes"/> I want setting to be saved, and I DO ACCEPT cookies.<br/>
                        <label id="spacing">
                            &nbsp;
                        </label>
                        <input type="radio" name="cookies" value="No"/> I DO NOT ACCEPT cookies, and settings won't be saved.<br/>
                    </div>
                    <label>
                        &nbsp;
                    </label>
                    <input type="submit" value="Connect"/>
                </form>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        if(registered){
            return(
                <div>
                    <TopBar/>
                    <div id="wrapper">
                        <ChatWindow/>
                        <div id="userlist">
                            <UserList/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return(
                <div>
                    <TopBar/>
                    <div id="wrapper">
                        <RegistrationForm/>
                    </div>
                </div>
            )
        }
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
onbeforeunload = event => {
    gateway_connection.end()
};
setInterval(function(){
    if(shouldRerender){
        if(registered){
            message_log = []
            var newMsg = JSON.parse(gateway_connection.fetchNewMessages().data);
            for(var  i = 0; i < newMsg.length; i++){
                message_log.push(new IRC_message(newMsg[i][0], newMsg[i][1], newMsg[i][2]));
            }
            user_list = JSON.parse(gateway_connection.fetchUserList().data);
        }
        root.render(<App/>)
    }}, 1000)
root.render(<App/>)