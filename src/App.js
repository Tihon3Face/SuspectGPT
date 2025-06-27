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
    const [messages,setMessages] = useState(!isHidden.isHidden ? [{role: 'Царь',roleOfChat: 'SuspectGPT',value:"Добро пожаловать в чат, введите 'promo321' чтобы получить ник и возможность менять его", id: '000'}] : [])
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
            top: overflow.clientHeight + 1500*(messages.length + 1),
            behavior: 'smooth',
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
            await axios.post('https://suspectgpt-backend.onrender.com/post-message', {
                role: role,
                from: user.user.id,
                value:value,
                id: Date.now(),
                roleOfChat: user.user.roleOfChat,
                likes: 0,
                dislikes: 0,
            })
        }else{
            await axios.post('https://suspectgpt-backend.onrender.com/post-message', {
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
            const {data} = await axios.post('https://suspectgpt-backend.onrender.com/post-update-array')
        } catch (e) {
            console.log('ну бялть', e)
        }
    }
    const getUpdateArray = async () => {
        try {
            const {data} = await axios.get('https://suspectgpt-backend.onrender.com/get-update-array')
            setMessages(!isHidden.isHidden ? [...data,{role: 'Царь',roleOfChat: 'SuspectGPT',value:"Добро пожаловать в чат, введите 'promo321' чтобы получить ник и возможность менять его (перезагрузите страницу, если не скрыли)", id: '000'}] : data)
            
            await getUpdateArray()
        } catch (e) {
            setTimeout(() => {
                getUpdateArray()
            },500)
        }
    }
    useEffect(() => {
        getUpdateArray()
    },[])



    const subscribe = async () => {
        try {
            const {data} = await axios.get('https://suspectgpt-backend.onrender.com/get-message')
            setMessages((prev) => [...new Set([...prev,data])])
            console.log('есьб сооб')
            await subscribe()
        } catch (e) {
            console.log('нет соб', e)
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
            const response = await axios.get('https://suspectgpt-backend.onrender.com/get-messages')
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
            const response = await axios.delete(`https://suspectgpt-backend.onrender.com/delete-message/${some.id}/${some.from}`)
            await postUpdateArray()
            console.log('Устранён',response.data)
        }catch (e){
            console.log('Ну как так')
        }
    }

    const user = useSelector(state => state.user);
    const roleOfUser = (user) => {
        dispatch({type:'ADD_USER_DATA', payload: user})
    };
    async function roleDefault () {
        const newUser = {
            role: 'Узбек',
            secret: "BekBebek2003"
        };
        try {
            const response = await axios.post('https://suspectgpt-backend.onrender.com/post-user', newUser);
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
            const response = await axios.patch(`https://suspectgpt-backend.onrender.com/patch-user/${user.user.id}`, { role: 'Царь', secret: "BekBebek2003"});
            console.log('Роль пользователя успешно обновлена:', response.data);
            roleOfUser({role: response.data.role, roleOfChat: 'ChatGPT', id: response.data.id})  
        } catch (error) {
            console.error('Ошибка при обновлении роли пользователя:', error);
        }
    }
    useEffect(() => {
        if(!(undefined === userMessages.find(item => item === 'promo321'))){
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

    const likes = useSelector(state => state.likes);
    const dislikes = useSelector(state => state.dislikes);
    const clear = () => {
        dispatch({type:'LIKES_MANAGER', payload: []})
        dispatch({type:'DISLIKES_MANAGER', payload: []})
    }
    
    const [loader,setLoader] = useState(false) 
    const addLike = async (prev,prev1,messages,index,section1) => {
        setLoader(true)
        if(prev.find(item => {
            const valuesObj1 = Object.values(item.mes).slice(0, 4);
            const valuesObj2 = Object.values(messages[index]).slice(0, 4);
            return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
        })){
            let newa = prev
            await dispatch({type:'LIKES_MANAGER', payload: prev.map((item,id) => {
                if(id === prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))){
                    let reput = !prev[prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep
                    return {
                        rep: reput,
                        mes: reput ? {...messages[index],dislikes: messages[index].likes + 1} : {...messages[index],likes: messages[index].likes - 1}
                    }
                }
                return item
            })})
            await commitRep(newa.map((item,id) => {
                if(id === newa.findIndex(item1 => {
                    const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                    const valuesObj2 = Object.values(messages[index]).slice(0, 4);
                    return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                })){
                    return {rep: !newa[newa.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep, mes: messages[index]}
                }
                return item
            }),messages[index],'likes')
        }else{
            await dispatch({type:'LIKES_MANAGER', payload:[...prev,{rep: true,mes: messages[index]}]})
            await commitRep([...prev,{rep: true,mes: messages[index]}],messages[index],'likes')
        }
    }
    const changeChooseOfLike = async (prev,prev1,messages,index,section1) => {
        setLoader(true)
        let newa = prev
        await dispatch({type:'LIKES_MANAGER', payload: prev.map(item => {
            if(item === prev[prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))]){
                return {rep: false, mes: {...messages[index],likes: messages[index].likes - 1}}
            }
            return item;
        })})
        await commitRep(newa.map(item => {
            if(item === newa[newa.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))]){
                return {rep: false, mes: messages[index]}
            }
            return item;
        }),messages[index],'changelikes')
    }

    const addDislike = async (prev,prev1,messages,index,section2) => {
        setLoader(true)
        if(prev.find(item => {
            const valuesObj1 = Object.values(item.mes).slice(0, 4);
            const valuesObj2 = Object.values(messages[index]).slice(0, 4);
            return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
        })){
            let newa = prev
            await dispatch({type:'DISLIKES_MANAGER', payload: prev.map((item,id) => {
                if(id === prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))){
                    let reput = !prev[prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep
                    return {
                        rep: reput,
                        mes: reput ? {...messages[index],dislikes: messages[index].likes + 1} : {...messages[index],likes: messages[index].likes - 1}
                    }
                }
                return item
            })})
            await commitRep(newa.map((item,id) => {
                if(id === newa.findIndex(item1 => {
                    const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                    const valuesObj2 = Object.values(messages[index]).slice(0, 4);
                    return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                })){
                    return {rep: !newa[newa.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep, mes: messages[index]}
                }
                return item
            }),messages[index],'dislikes')
        }else{
            await dispatch({type:'DISLIKES_MANAGER', payload:[...prev,{rep: true,mes: messages[index]}]})
            await commitRep([...prev,{rep: true,mes: messages[index]}],messages[index],'dislikes')
        }
    }
    const changeChooseOfDislike = async (prev,prev1,messages,index,section2) => {
        setLoader(true)
        let newa = prev
        await dispatch({type:'DISLIKES_MANAGER', payload: prev.map(item => {
            if(item === prev[prev.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))]){
                return {rep: false, mes: {...messages[index],dislikes: messages[index].dislikes - 1}}
            }
            return item;
        })})
        await commitRep(newa.map(item => {
            if(item === newa[newa.findIndex(item1 => JSON.stringify(Object.values(item1.mes).slice(0,4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))]){
                return {rep: false, mes: messages[index]}
            }
            return item;
        }),messages[index],'changedislikes')
    }


    const commitRep = async (repu,mes,def) => {
        const some = repu.find(item => JSON.stringify(item.mes) === JSON.stringify(mes));
        try{
            const response = await axios.patch(`https://suspectgpt-backend.onrender.com/commit-rep/${some.rep}/${JSON.stringify(some.mes)}/${def}`)
            await postUpdateArray()
            setTimeout(() => setLoader(false),3000)
        }catch (e){
            console.log(e)
        }
    }


    async function changeReputation (e) {
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
            setLoader(true)
            if(dislikes.findIndex(item => JSON.stringify(Object.values(item.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4))) !== -1 && dislikes[dislikes.findIndex(item => JSON.stringify(Object.values(item.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep === true){
                await changeChooseOfDislike(dislikes,likes,messages,index,section2)
            }
            await addLike(likes,dislikes,messages,index,section1)
            setTimeout(() => setLoader(false),3000)
        }else if(e.target.closest('.message') === message && e.target.closest('.devide-sections') === section2){
            setLoader(true)
            if(likes.findIndex(item => JSON.stringify(Object.values(item.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4))) !== -1 && likes[likes.findIndex(item => JSON.stringify(Object.values(item.mes).slice(0, 4)) === JSON.stringify(Object.values(messages[index]).slice(0, 4)))].rep === true){
                await changeChooseOfLike(likes,dislikes,messages,index,section1)
            }
            await addDislike(dislikes,likes,messages,index,section2)
            setTimeout(() => setLoader(false),3000)
        }
    }
    useEffect(() => {
        const chat = document.getElementsByClassName('chat')[0]
        chat.addEventListener('click', changeReputation)
        return () => {
            chat.removeEventListener('click', changeReputation)
        }
    },[messages,likes,dislikes])


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
                                    likes={likes.length === 0 || likes.findIndex(item1 => {
                                        const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                                        const valuesObj2 = Object.values(item).slice(0, 4);
                                        return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                                    }) === -1 ? undefined : likes[likes.findIndex(item1 => {
                                        const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                                        const valuesObj2 = Object.values(item).slice(0, 4);
                                        return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                                    })].rep}
                                    dislikes={dislikes.length === 0 || dislikes.findIndex(item1 => {
                                        const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                                        const valuesObj2 = Object.values(item).slice(0, 4);
                                        return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                                    }) === -1 ? undefined : dislikes[dislikes.findIndex(item1 => {
                                        const valuesObj1 = Object.values(item1.mes).slice(0, 4);
                                        const valuesObj2 = Object.values(item).slice(0, 4);
                                        return JSON.stringify(valuesObj1) === JSON.stringify(valuesObj2)
                                    })].rep}
                                    loader={loader}
                                />
                            )
                        }
                    </div>
                </div>
                <div className="bottom">
                    <form action="#">
                        <input 
                            maxLength={
                                user.user !== null
                                ?
                                user.user.id === '685eb4ffc35fb40b6a0a988a'|| user.user.id === '685eb583c35fb40b6a0a9894' ? '1000' : '100'
                                :
                                '100'
                            } type="text" value={value} onChange={(e) => {
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