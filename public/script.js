const socket = io('/')
const myPeer = new Peer(undefined,{
    host:'/',
    port:'3500'
})
// video streaming
const peerUsers = {}
const videoStDisplay = document.getElementById('video-grid')
const me  =document.createElement('video')
// if just there is a video,it was muted 
me.muted = true
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    addVideoStream(me,stream)

    myPeer.on('call',(call)=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream' , (uservideoStream)=>{
            addVideoStream(video,uservideoStream)
        })
    })

    socket.on('user-connected',(userID)=>{
        connectedToNewUser(userID,stream)
    })
})

socket.on('user-disconnected' , (userID)=>{
    if(peerUsers[userID]) peerUsers[userID].close()
})

// end

myPeer.on('open', (id)=>{
    socket.emit('join-room',ROOM_ID,id)
})

/**
 * @param {*} userID 
 * @param {*} stream 
 */
function connectedToNewUser (userID,stream){
    const Call = myPeer.call(userID,stream)
    const video = document.createElement('video')
    Call.on('stream' , (userVideoStram)=>{
        addVideoStream(video,userVideoStram)
    })
    Call.on('close', ()=>{
        video.remove()
    })
    peerUsers[userID] = Call
}

/**
 * @param {*} video 
 * @param {*} stream 
 */
function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoStDisplay.append(video)
}