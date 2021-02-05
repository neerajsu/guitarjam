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
npm i -g peer

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

Buy some domain from GoDaddy. (say: example.com) (Would cost you less than $1  if you buy some random name)

Transfer domain from Godaddy to cloudflare. (Free. Cloudflare is free for personal use)

Go to https://www.vultr.com/?ref=8791160 and create a new account.

In Vultr, you need to deploy two new cloud compute instance with ssh.

Setup two instances (Ubuntu). For personal use, you can spin up a server with 8GB ram and 4 cpus to host peerjs, and another server to host socket.io connections ( 1 CPU 2 GB RAM).

Depending on how many people you want to allow to connect at a time, you can increase, decrease the server size accordingly. Test it out.

### On larger instance (4 cpu 8 GB)

ssh into instance and install npm and peerjs, and start peerjs on port 80

```bash

cd ~

sudo apt install nodejs npm

npm install

npm i -g peer

nohup peerjs --port 80 &

```

### On smaller instance (1 cpu 2 GB)

ssh into instance and install node, npm and run guitarjam project on port 80

```bash
cd ~

sudo apt install nodejs npm

mkdir apps

cd apps

git clone https://github.com/neerajsu/guitarjam.git

cd guitarjam

npm install

export PEER_PORT=443

export PORT=80

# Replace 'example.com' with your domain name
export PEER_HOST=stream.example.com

nohup node server.js &

```

### Setup Cloudflare DNS

Ensure SSL/TLS type is "Flexible". Enable URL re-write to https. Basically the defaults, unless it has changed since writing this readme.

Add these two 'A' records in DNS settings.

#1


Name: example.com 

Content: <ip.address.of.smaller.machine>

#2

Name: stream.example.come

Content : <ip.address.of.bigger.machine>


If everything is setup correctly, if you go to www.example.com, you should have zoom like video conferencing enabled on browser. Copy that link and share with your friend to do video confereing on your own server.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)