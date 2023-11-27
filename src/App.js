import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import down from "./images/down.png"
import Message from './components/Message';
import send from './images/send.png';
    
function App() {
    const isHidden = useSelector(state => state.isHidden);
    const dispatch = useDispatch();
    const changeIsHidden = () => {
        dispatch({type:'IS_HIDDEN', payload:true})
    }
    const [messages,setMessages] = useState(!isHidden.isHidden ? [{role: 'Царь',roleOfChat: 'SuspectGPT',value:"Добро пожаловать в общий чат", id: '000'}] : [])
    const [value,setValue] = useState('');
    const [userMessages,setUserMessages] = useState([])

    function focus (e) {
        const input = document.getElementsByTagName('input')[0];
        const hr = document.getElementsByTagName('hr')[0];

        if(e.target === input){
            hr.style.animation = "focus 0.3s 1 ease forwards"
        }

        const newHr = getComputedStyle(hr)

        if(e.target !== input && /\s+focus/.test(newHr.animation)){
            hr.style.animation = "off-focus 0.3s 1 ease forwards"
        }
    }

    function scrollDownSmooth () {
        const overflow = document.getElementsByClassName('overflow')[0];
        overflow.scrollBy({
            top: overflow.clientHeight + 500*(messages.length + 1),
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        const overflow = document.getElementsByClassName('overflow')[0];
        const down = document.getElementsByClassName('down')[0];
        function downAnimation () {
            const scrollTop = overflow.scrollTop;
            const scrollHeight = overflow.scrollHeight;
            const clientHeight = overflow.clientHeight;
            if(scrollHeight - scrollTop - clientHeight > 100){
                down.style.animation = 'down 0.2s 1 ease forwards';
            }
            if(scrollHeight - scrollTop - clientHeight <= 100){
                down.style.animation = 'down-back 0.2s 1 ease forwards';
            }
        }
        overflow.addEventListener('scroll', downAnimation)
        return () => {
            overflow.removeEventListener('scroll', downAnimation)
        }
    },[])

    
    function scrollDown() {
        const overflow = document.getElementsByClassName('overflow')[0];
        const scrollTop = overflow.scrollTop;
        const scrollHeight = overflow.scrollHeight;
        const clientHeight = overflow.clientHeight;
        if(scrollTop + clientHeight + 180 > scrollHeight){
            setTimeout(() => scrollDownSmooth(),40)
        }
    }
    useEffect(() => {
        scrollDown()
    },[messages])
    function hide () {
        setMessages(prev => prev.filter((item) => item.id !== '000'))
    }
    useEffect(() => {
        window.addEventListener('click', focus)
        return () => {
            window.removeEventListener('click', focus)
        }
    },[])

    function changeRoleOfChat () {
        let promptt = prompt() 
        let newRoleOfChat = (promptt  !== null) ? promptt : user.user.roleOfChat
        if(newRoleOfChat.length >= 23){
            newRoleOfChat = newRoleOfChat.substr(0,23)
        }
        roleOfUser({role: user.user.role, roleOfChat: newRoleOfChat, id: user.user.id})  
    } 

    const sendMessage = async (role) => {
        if(role === 'Царь'){
            await axios.post('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/post-message', {
                role: role,
                from: user.user.id,
                roleOfChat: user.user.roleOfChat,
                value:value,
                id: Date.now(),
                likes: 0,
                dislikes: 0,
            })
        }else{
            await axios.post('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/post-message', {
                role: role,
                from: user.user.id,
                value:value,
                id: Date.now(),
                likes: 0,
                dislikes: 0,
            })
        }
    }



    const postUpdateArray = async () => {
        try {
            const {data} = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/post-update-array')
        } catch (e) {
            console.log('ну бялть', e)
        }
    }
    const getUpdateArray = async () => {
        try {
            const {data} = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/get-update-array')
            setMessages(!isHidden.isHidden ? [...data,{role: 'Царь',roleOfChat: 'SuspectGPT',value:"Добро пожаловать в общий чат(перезагрузите страницу, если не скрылось)", id: '000'}] : data)
            
            await getUpdateArray()
        } catch (e) {
            setTimeout(() => {
                getUpdateArray()
            },500)
        }
    }
    useEffect(() => {
        subscribe()
        getUpdateArray()
    },[])



    const subscribe = async () => {
        try {
            const {data} = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/get-message')
            setMessages((prev) => [...new Set([...prev,data])])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            },500)
        }
    }
    useEffect(() => {
        subscribe()
        setMessages((prev) => [...new Set([...prev])])
    },[])
    const getMessages = async () => {
        try {
            const response = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/get-messages')
            let arr = new Set([...response.data])
            setMessages((prev) => [...new Set([...arr,...prev])])
        } catch (e) {
            console.log('ммм',e)
        }
    }
    useEffect(() => {
        getMessages()
        setMessages((prev) => [...new Set([...prev])])
    },[])
    useEffect(() => {
        setTimeout(() => scrollDownSmooth(),40)
    },[messages.length > 1])

    async function deleteMessage (userId,id) {
        const some = messages.find((item) => item.from === userId && item.id === id);
        try{
            const response = await axios.delete(`https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/delete-message/${some.id}/${some.from}`)
            await postUpdateArray()
            console.log('Устранён',response.data)
        }catch (e){
            console.log('Ну как так')
        }
    }

    const user = useSelector(state => state.user);
    const roleOfUser = (user) => {
        dispatch({type:'ADD_USER_DATA', payload: user})
    }
    async function roleDefault () {
        const newUser = {
            role: 'Узбек',
            secret: "BekBebek2003"
        };
        try {
            const response = await axios.post('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/post-user', newUser);
            console.log('Пользователь успешно создан:', response.data);
            roleOfUser({role: response.data.role, id: response.data._id})
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
        }
    }
    useEffect(() => {
        if(!user.user){
            roleDefault()
        }
    },[])
    async function patchToAdmin () {
        try {
            const response = await axios.patch(`https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/patch-user/${user.user.id}`, { role: 'Царь', secret: "BekBebek2003"});
            console.log('Роль пользователя успешно обновлена:', response.data);
            roleOfUser({role: response.data.role, roleOfChat: 'ChatGPT', id: response.data.id})  
        } catch (error) {
            console.error('Ошибка при обновлении роли пользователя:', error);
        }
    }
    useEffect(() => {
        if(!(undefined === userMessages.find(item => item === 'suzpek321'))){
            patchToAdmin()
        }
    },[userMessages])
    const role = user.user ? user.user.role : undefined

    useEffect(() => {
      setTimeout(() => scrollDownSmooth(),40)
    },[userMessages.length])


    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    },[userMessages.length])



    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    useEffect(() => {
        if(isMobile){
            const scrollbar = document.documentElement.style
            scrollbar.scrollbarWidth = 'none';
            scrollbar.msOverflowStyle = 'none';
            scrollbar.webkitOverflowScrolling = 'none';
            scrollbar.overflow = 'hidden';
        }
    },[])

    const [like,setLike] = useState([]);
    const [dislike,setDislike] = useState([]);
    function changeReputation (e) {
        let index;
        for (let i = 0; i < document.getElementsByClassName('message').length; i++) {
            if (document.getElementsByClassName('message')[i] === e.target.closest('.message')) {
              index = i;
              break;
            }
          }
        const message = document.getElementsByClassName('message')[index]
        const section1 = document.getElementsByClassName('devide-sections')[index*2]
        const section2 = document.getElementsByClassName('devide-sections')[index*2 + 1]
        if(e.target.closest('.message') === message && e.target.closest('.devide-sections') === section1){
            if(dislike.findIndex(item => item.mes === messages[index]) !== -1 && dislike[dislike.findIndex(item => item.mes === messages[index])].rep === true){
                setDislike(prev => {
                    return prev.map(item => {
                        if(item === prev[dislike.findIndex(item1 => item1.mes === messages[index])]){
                            return {rep: false, mes: messages[index]}
                        }
                        return item;
                    })
                })
                section2.style.backgroundColor = 'white'
            }
            setLike(prev => {
                if(prev.find(item => item.mes === messages[index]) !== undefined){
                    section1.style.backgroundColor = 'white'
                    return prev.map((item,id) => {
                        if(id === prev.findIndex(item1 => item1.mes === messages[index])){
                            if(!prev[prev.findIndex(item1 => item1.mes === messages[index])].rep){
                                section1.style.backgroundColor = 'aqua'
                            }else{
                                section1.style.backgroundColor = 'white'
                            }
                            return {rep: !prev[prev.findIndex(item1 => item1.mes === messages[index])].rep, mes: messages[index]}
                        }
                        return item
                    })
                }
                section1.style.backgroundColor = 'aqua'
                return [...prev,{rep: true,mes: messages[index]}]
            })
        }
        if(e.target.closest('.message') === message && e.target.closest('.devide-sections') === section2){
            if(like.findIndex(item => item.mes === messages[index]) !== -1 && like[like.findIndex(item => item.mes === messages[index])].rep === true){
                setLike(prev => {
                    return prev.map(item => {
                        if(item === prev[like.findIndex(item1 => item1.mes === messages[index])]){
                            return {rep: false, mes: messages[index]}
                        }
                        return item;
                    })
                })
                section1.style.backgroundColor = 'white'
            }
            setDislike(prev => {
                if(prev.find(item => item.mes === messages[index]) !== undefined){
                    section2.style.backgroundColor = 'white'
                    return prev.map((item,id) => {
                        if(id === prev.findIndex(item1 => item1.mes === messages[index])){
                            if(!prev[prev.findIndex(item1 => item1.mes === messages[index])].rep){
                                section2.style.backgroundColor = 'aqua'
                            }else{
                                section2.style.backgroundColor = 'white'
                            }
                            return {rep: !prev[prev.findIndex(item1 => item1.mes === messages[index])].rep, mes: messages[index]}
                        }
                        return item;
                    })
                }
                section2.style.backgroundColor = 'aqua'
                return [...prev,{rep: true,mes: messages[index]}]
            })
        }
    }
    useEffect(() => {
        const chat = document.getElementsByClassName('chat')[0]
        chat.addEventListener('click', changeReputation)
        return () => {
            chat.removeEventListener('click', changeReputation)
        }
    },[messages.length,like,dislike])


    useEffect(() => {
        setMessages((prev) => [...new Set([...prev])]);
    },[messages.length])

    
    return (
        <div className="App">
            <div className="chat">
                <div className="top">
                    <h1>SuspectGPT</h1>
                </div>
                <div className="down" onClick={() => scrollDownSmooth()}><img src={down} alt="" className="down__png"/></div>
                <div className="overflow">
                    <div className="messages">
                        {
                            [...new Set(messages)].map((item,id) =>
                                <Message
                                    message={item}
                                    key={id}
                                    numOfMessage={id}
                                    id={item.id}
                                    userData={user.user}
                                    hide={hide}
                                    changeIsHidden={changeIsHidden}
                                    role={item.role}
                                    ownRole={role}
                                    roleOfChat={item.roleOfChat ? item.roleOfChat : undefined}
                                    changeRoleOfChat={changeRoleOfChat}
                                    deleteMessage={deleteMessage}
                                    changeReputation={changeReputation}
                                    like={like}
                                    dislike={dislike}
                                />
                            )
                        }
                    </div>
                </div>
                <div className="bottom">
                    <form action="#">
                        <input maxLength="100" type="text" value={value} onChange={(e) => {
                            e.preventDefault()
                            setValue(e.target.value);
                            focus(e)
                        }} placeholder="Введите сообщение"/>
                        <button disabled={isDisabled} className="enter" onClick={(e) => {
                            e.preventDefault()
                            if(value.split(" ").join("") === ""){
                                return;
                            }
                            setUserMessages(prev => [...prev,value])
                            sendMessage(role)
                            setValue("");
                        }}><img src={send} alt=""/></button>
                    </form>
                    <hr className='hr-is-entered'/> 
                </div>
            </div>
        </div>
    );
}

export default App;