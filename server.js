const express = require('express');
const app = express();
const Port = 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');

app.set('view engine' , 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    // console.log(uuidv4());
    res.redirect(`/${uuidv4()}`)
})

app.get('/:roomID', (req,res)=>{
    res.render('room',{roomID:req.params.roomID})
})

io.on('connection' , (socket)=>{
    socket.on('join-room' , (roomID,userID)=>{
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID)


        socket.on('disconnect' , ()=>{
            socket.to(roomID).broadcast.emit('user-disconnected' , userID)
        })
    })
})



server.listen(Port , ()=>{
    console.log(`server is run in Port ${Port}`);
})
