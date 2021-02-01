# Guitar Jam Server/client

This is an app that uses WebRTC to create a zoom like full duplex video conferencing. Most existing video conferencing tools like zoom and skype do echo cancellation and half duplexing which causes problems when my guitar instructor wants to play with me. So I created this.

It supports multiple users inside a same room and allows you to set the main video among the different users.

Has a very bare bones UI.

## Running locally

This project uses peer to peer WebRTC server [peer](https://github.com/peers/peerjs), so you'll need to install it.

```bash

#installs dependencies
npm install

# installs peer globally on your machine
npm npm i -g peer

# runs peer server on port 3001
peerjs --port 3001

# starts server with nodemon on port 3000
npm run devStart

```

## Usage

Open chrome. Go to localhost:3000. It should default you to some room ex:- localhost:3000/12OP3-2BA3-4KL2-38KDS1

The UUID at the end is the room-id

Copy that url and go to that url on another client. You can now video chat.



## Deploying on the cloud

To deploy on cloud, just go deploy this node and install peerjs on a virtual machine. If you use nginx, make sure you set it up for websockets and http(s), as both node app and peerjs uses websockets. If you do not know how to setup nginx for websockets, skip it and use [CloudFlare](https://www.cloudflare.com/) to do the reverse proxy (load balancing).

You might need to change the url for peer accordingly.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)