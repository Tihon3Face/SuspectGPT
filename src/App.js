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
    const [messages,setMessages] = useState(!isHidden.isHidden ? [{role: 'Царь',roleOfChat: 'SuspectGPT',value:"Сила в справедливости", id: '000'}] : [])
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



    const subscribe = async () => {
        try {
            const {data} = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/get-message')
            setMessages((prev) => [...prev,data])
            await subscribe()
        } catch (e) {
            setTimeout(() => {
                subscribe()
            },500)
        }
    }
    useEffect(() => {
        subscribe()
    },[])
    const getMessages = async () => {
        try {
            const response = await axios.get('https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/get-messages')
            let arr = new Set([...response.data])
            setMessages((prev) => [...arr,...prev])
        } catch (e) {
            console.log('ммм')
        }
    }
    useEffect(() => {
        getMessages()
        setTimeout(() => scrollDownSmooth(),40)
    },[])

    async function deleteMessage (userId,id) {
        const some = messages.find((item) => item.from === userId && item.id === id);
        console.log(messages)
        try{
            const response = await axios.delete(`https://guarded-fortress-70456-e9c44c34c91b.herokuapp.com/delete-message/${some.id}`)
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
    },[userMessages,messages])


    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    },[userMessages.length])

    useEffect(() => {
        // Your code here
    }, [scrollDown, subscribe, scrollDownSmooth, roleDefault, user.user, patchToAdmin])

    const isMobileDevice = /Mobi/i.test(navigator.userAgent);

    useEffect(() => {
        function mobBug () {
            const chat = document.getElementsByClassName('chat')[0];
            if (isMobileDevice) {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                chat.style.width = `${windowWidth}px`;
                chat.style.height = `${windowHeight}px`;
            }
        }
        window.addEventListener('resize', mobBug)
        return () => {
            window.removeEventListener('resize', mobBug)
        }
    })

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
                            messages.map((item,id) =>
                                <Message
                                    message={item}
                                    key={id}
                                    id={item.id}
                                    userData={user.user}
                                    hide={hide}
                                    changeIsHidden={changeIsHidden}
                                    role={item.role}
                                    ownRole={role}
                                    roleOfChat={item.roleOfChat ? item.roleOfChat : undefined}
                                    changeRoleOfChat={changeRoleOfChat}
                                    deleteMessage={deleteMessage}
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
                    <hr/> 
                </div>
            </div>
        </div>
    );
}

export default App;
