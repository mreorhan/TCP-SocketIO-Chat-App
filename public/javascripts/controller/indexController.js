app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    
    $scope.messages=[
    ]
    $scope.init=()=>{
        const username=prompt('Please enter username:');

        if(username)
            initSocket(username);
        else
            return false; 
    }
    scrollTop =()=>{
        setTimeout(()=>{
            const element = document.getElementById('chat-area');
            element.scrollTop=element.scrollHeight;
            })
    }
    showBubble=(id,message)=>{
        $('#'+id).find('.message').show().html(message);
        setTimeout(() => {
        $('#'+id).find('.message').hide();
        }, 2000);
    }
    
    async function initSocket(username) {
        const connectionOptions={
            reconnectionAttempts:3,
            reconnectionDelay:600
        };
        try{
        const socket = await indexFactory.connectSocket('http://localhost:3000',connectionOptions);
        console.log('baglantı gerçekleşti',socket);
        socket.emit('newUser',{username});

        socket.on('initPlayers',(players)=>{
            $scope.players=players;
            $scope.$apply();
            console.log("playerler",players)
        })

        socket.on('newUser',(user)=>{
            const message={
                type:{
                    code:0,//server or user message
                    message:1//- login logout
                },
                username:user.username,
            }
            $scope.messages.push(message);
            $scope.players[user.id]=user;
            $scope.$apply();
            scrollTop();
        })

        socket.on('disUser',(user)=>{
            const message={
                type:{
                    code:0,//server or user message
                    message:0//- login logout
                },
                username:user.username,
            }
            $scope.messages.push(message);
            delete $scope.players[user.id];
            $scope.$apply();
            scrollTop();
        })

        socket.on('animateFrontEnd',(data)=>{
            $('#'+data.socketId).animate({'left':data.x-30,'top':data.y-30})
        })
        socket.on('newMessageFrontEnd',message=>{
            $scope.messages.push(message);
            $scope.$apply();
            showBubble(message.socketId,message.text)
            console.log("sel",message)
            scrollTop();
        })
        let animate=false;
        $scope.onClickPlayer = ($event)=>{
            if(!animate){
                animate=true;
                let x=$event.offsetX-30;
                let y=$event.offsetY-30;
                socket.emit('animate',{x,y})
                $('#'+socket.id).animate({'left':x,'top':y},()=>{
                animate=false
                })
            }
        }
        $scope.newMessage=()=>{
            let userMessage = $scope.message;
            console.log(userMessage)
            const message={
                type:{
                    code:1,//server or user message
                },
                username:username,
                text:userMessage
            }
            $scope.messages.push(message);
            $scope.message="";

            socket.emit('newMessage',message)
            showBubble(socket.id,message.text)
            scrollTop();
        }
    }catch(err){
        console.log(err)
    }
}
}]);