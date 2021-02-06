const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const mainVideo = document.getElementById('main-video');
let myPeer = null;
const myVideo = document.createElement('video');
myVideo.muted = true;
let peers = {};
navigator.mediaDevices.getUserMedia({
    video: {
        height: 1080,
        width: 1920,
        aspectRatio: 1.7777777778
    },
    audio: {
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false
    }
}).then(stream => {
    myPeer = new Peer(undefined, {
        host: PEER_HOST,
        port: PEER_PORT,
    })
    addVideoStream(myVideo, stream);
    myPeer.on('open', id => {
        socket.emit('join-room', ROOM_ID, id)
    });
    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {
        console.log("new user connected", userId);
        connectToNewUser(userId, stream);
    })
}).catch(error => {
    console.log("Error: ", error);
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    call.on('close', () => {
        let parentElement = video.parentElement;
        video.remove();
        if (parentElement.getAttribute('id') != "main-video") {
            parentElement.remove();
        }
    })

    peers[userId] = call;
}

function addVideoStream(video, stream) {

    //adding stream to video
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    addVideoToGrid(video);

}

function addVideoToGrid(video) {

    //putting video inside a div with id 
    let videoId = new Date().getTime();
    const videoDiv = document.createElement("div");
    videoDiv.setAttribute("id", videoId);
    videoDiv.append(video);


    //adding button to set as main video
    const buttonElm = document.createElement("button");
    const txt = document.createTextNode("Set Main");
    buttonElm.addEventListener("click", event => {
        addVideoToMain(video);
    });
    buttonElm.append(txt);
    videoDiv.append(buttonElm);

    //adding videoDiv to grid
    videoGrid.append(videoDiv);
}

function addVideoToMain(video) {

    //remove existing video in main and put back in grid, if it exists
    if (mainVideo.childElementCount > 0) {
        addVideoToGrid(mainVideo.childNodes[0]);
    }

    //remove video from grid and add to main
    let parentElement = video.parentElement;
    if (parentElement.getAttribute('id') != "main-video") {
        parentElement.remove();
    }
    mainVideo.append(video);
}

/**
 * This function is just a hack to cleanup the button grid with empty videos and set main button
 * Might have to debug the cause instead of doing this.
 */
function cleanUpGrid() {
    let divIdsToRemove = [];
    Array.from(videoGrid.childNodes).forEach((childNode) => {
        if (childNode.childElementCount < 2) {
            divIdsToRemove.push(childNode.getAttribute("id"));
        }
    });

    divIdsToRemove.forEach((id) => {
        var divToRemove = document.getElementById(id);
        if (divToRemove) {
            divToRemove.remove();
        }
    });


}

//calling cleanup every 1 second
let cleanupLoop = setInterval(cleanUpGrid, 1000);
