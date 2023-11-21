import React, { useEffect, useState } from 'react';
import "./Message.css"

function Message({message,id,userData,hide,changeIsHidden,role,ownRole,roleOfChat,changeRoleOfChat,deleteMessage}) {
    const [lengthOfLine,setLengthOfLine] = useState()
    useEffect(() => {
        function adaptive () {
                if (window.innerWidth <= 340){
                    setLengthOfLine(19)
                }else{
                    setLengthOfLine(23)
                }
        }
        adaptive()
        window.addEventListener('resize',adaptive)
        return () => {
            window.removeEventListener('resize',adaptive)
        }
    },[])
    let filterOfMessage
    if(message.value !== undefined){
        if(id !== '000'){
            filterOfMessage = message.value.toLowerCase();
        }else{
            filterOfMessage = message.value
        }
        if(filterOfMessage.length > lengthOfLine){
            let resultArray = [];
            for (let i = 0; i < filterOfMessage.length; i += lengthOfLine) {
                resultArray.push(filterOfMessage.substr(i, lengthOfLine));
            }
            filterOfMessage = resultArray.join('\n');
        }
    return (
        <div className="message">
            {
                role === 'Царь'
                ?
                ownRole === 'Царь' ? <button className='role button-pointer' onClick={() => changeRoleOfChat()}><pre>{roleOfChat}</pre></button> : <pre className='role'>{roleOfChat}</pre>
                :
                null
            }
            <pre className="message__style">{filterOfMessage}</pre>
            {/* {
                userData.id === '655599e0eba04f2fcd87c186'
                ?
                message.from !== '655599e0eba04f2fcd87c186' ? <button className="delete" onClick={() => deleteMessage(message.from,message.id)}>Удалить</button> : null
                :
                null
            } */}
            {
                id === '000'
                ?
                <button className="hide" onClick={() => {
                    hide();
                    changeIsHidden()
                }}>Скрыть</button>
                :
                null
            }
        </div>
    );
    }
}

export default Message;