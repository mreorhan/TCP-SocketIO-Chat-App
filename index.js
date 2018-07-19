const http=require('http');
const socketio=require('socket.io');

const server = http.createServer((req,res)=>{
    res.end("test")
})
server.listen(3000)

const io = socketio.listen(server);

/*
io.sockets.on('connection',(socket)=>{
    console.log("kullanici bağlandi");
    
    socket.on('disconnect',()=>{
        console.log("kullanici ayrildi");
    })

}); //event emitter
*/

//custom namespace
/*
const customNamespace = io.of('/custom');

customNamespace.on('connection',(socket)=>{
    socket.on('isim yaz',()=>{
        //customnamespace yerine socket deseydik sadece işlemi yapan kişiye giderdi
        customNamespace.emit('sendAll',{name:'emre'})
    })
    console.log("custom ok");
})
*/

//create room

io.on('connection',(socket)=>{
    socket.on('joinRoom',(data)=>{
        socket.join(data.name,()=>{  
            io.to(data.name).emit('new join',{count:getOnlineCount(io,data)})
            socket.emit('log',{message:'You are join room'})
            console.log(Object.keys(socket.rooms))//o kullanıcının bağlı olan roomları gösterir
        })
        console.log(socket.id)
    });
    socket.on('leaveRoom',(data)=>{
        socket.leave(data.name,()=>{
            io.to(data.name).emit('leavedRoom',{count:getOnlineCount(io,data)})
            socket.emit('log',{message:'You leaved room'})
        })
    })
    socket.on('browser',(data)=>{
        console.log(data)
    })
})
const getOnlineCount=(io , data)=>{
    let count = io.sockets.adapter.rooms[data.name];
    return count ? count.length : 0;
}