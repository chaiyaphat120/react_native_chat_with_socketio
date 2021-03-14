import React, { Component, useEffect, useRef, useState } from 'react'
import { Text, View, TextInput ,Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import io from 'socket.io-client'
import axios from 'axios'
const socket = io('http://192.168.1.11:3000')
// const socket = io('https://chat-react2012.herokuapp.com')
const App = () => {
    const [chatMessage, setChatMessage] = useState('')
    const [name, setName] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const scroll = useRef(null)

    useEffect(() => {
        const promise = (async () => {
            let response = await axios.get('http://192.168.1.11:3000')
            console.log(response.data)
        })();

        socket.on('chat message', ({message , name}) => {  //รันครั้งเดี่ยวทำงานตลอด เป็นตัว subscribe ข้อมูลจาก server
            setChatMessages((e) => [...e, {message, name}])
        })
        return (() => {
            promise.then(() => cleanup());
        });

        
    },[])

    const submitChatMessage = () => {
        socket.emit('chat message', {message:chatMessage , name})
        setChatMessage('')
    }

    const chatMessagesComponent = chatMessages.map((e,i) => (
        <View key={i} style={{width:"100%" ,padding:5 }}>
            {(e.name !==name ) ?
                <TouchableOpacity style={{width:"40%",justifyContent:'center',flexDirection:'column' , backgroundColor: '#D1D5DB',alignItems:'flex-start',borderRadius:10,padding:5}}>
                    <Text  style={{fontSize:20,color:"rgba(0,0,0,1)"}}>
                    {e.message}
                    </Text>
                    <Text style={{fontSize:10,color:"rgba(0,0,0,0.4)"}}> send by {e.name}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{width:"40%",justifyContent:'center',flexDirection:'column' , backgroundColor: '#5FA7FA',alignItems:'flex-start',borderRadius:10,padding:5,alignSelf:'flex-end'}}>
                    <Text  style={{fontSize:20,color:"#FFF"}}>
                    {e.message}
                    </Text>
                    <Text style={{fontSize:10,color:"rgba(0,0,0,0.4)"}}> send by {e.name}</Text>
                </TouchableOpacity>
            }
        </View>
        
    ))

    return (
        <View style={{flex:1,backgroundColor:"#F9FAFB",padding:5}}>
            <ScrollView ref={scroll} onContentSizeChange={()=>scroll.current.scrollToEnd({animated: true})}>
            {chatMessagesComponent}
            </ScrollView>
            <View style={{width:"100%",backgroundColor:'white',height:80}}>
            <TextInput
                style={{ height: 40, borderWidth: 1 ,position:'absolute',bottom:40 ,width:"30%" }}
                autoCorrect={false}
                value={name}
                placeholder="name"
                onSubmitEditing={submitChatMessage}
                onChangeText={(e) => {
                    setName( e )
                }}
            />
            <TextInput
                style={{ height: 40, borderWidth: 1 ,position:'absolute',bottom:0 ,width:"100%" }}
                autoCorrect={false}
                value={chatMessage}
                placeholder="message"
                onSubmitEditing={submitChatMessage}
                onChangeText={(e) => {
                    setChatMessage( e )
                }}
            />
            </View>
        </View>
    )
}

export default App
