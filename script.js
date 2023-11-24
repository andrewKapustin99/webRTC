let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let startButton = document.getElementById('startButton');
let callButton = document.getElementById('callButton');
let hangupButton = document.getElementById('hangupButton');

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

let localStream;
let pc1;
let pc2;
const servers = {
    iceServers: [
        {
            urls: 'turn:89.221.60.156:3478',
            username: 'andrew',
            credential: 'kapustin'
        }
    ]
};

async function start() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
}

async function call() {
    pc1 = new RTCPeerConnection(servers);
    pc2 = new RTCPeerConnection(servers);

    pc1.onicecandidate = e => pc2.addIceCandidate(e.candidate);
    pc2.onicecandidate = e => pc1.addIceCandidate(e.candidate);

    pc2.ontrack = e => remoteVideo.srcObject = e.streams[0];

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    await pc2.setRemoteDescription(offer);

    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);
    await pc1.setRemoteDescription(answer);
}

function hangup() {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}
