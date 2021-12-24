

export default class Network {

    constructor() {
        this.ws = null;
        this.s = false;
        this.event = new Event("message");
        this.lastMessage = '';
    }

    connect() {
        this.ws = new WebSocket("ws://localhost:3000");
        this.ws.addEventListener("open", () => {
            this.s = true;
            console.log('We are connected!');          
        });
    }

    status() {
        return this.s;
    }

    watch() {
        this.ws.addEventListener("message",  ({data}) => {
            console.log(JSON.parse(data));
            this.lastMessage = JSON.parse(data);
            document.dispatchEvent(this.event);
        });
    }

    getMsg() {
        if (this.lastMessage != '') {
            return this.lastMessage;
        }
    }

    send(msg){
        this.ws.send(msg);
    }

}


