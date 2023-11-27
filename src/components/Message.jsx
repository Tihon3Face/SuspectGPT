import React, { useEffect, useState } from 'react';
import "./Message.css"
import agree from '../images/agree.png'
import disagree from '../images/disagree.png'
import clickedagree from '../images/clickedagree.png'
import clickeddisagree from '../images/clickeddisagree.png'

function Message({message,numOfMessage,id,userData,hide,changeIsHidden,role,ownRole,roleOfChat,changeRoleOfChat,deleteMessage,like,dislike}) {
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
        const repOfLike = like.length === 0 || like.findIndex(item => item.mes === message) === -1 ? undefined : like[like.findIndex(item => item.mes === message)].rep
        const repOfDislike = dislike.length === 0 || dislike.findIndex(item => item.mes === message) === -1 ? undefined : dislike[dislike.findIndex(item => item.mes === message)].rep

    return (
        <div className="message">
            {
                role === 'Царь'
                ?
                    ownRole === 'Царь'&& message.from === userData.id
                    ?
                    <button className='role button-pointer' onClick={() => changeRoleOfChat()}><pre>{roleOfChat}</pre></button>
                    :
                    <pre className='role'>{roleOfChat}</pre>
                :
                null
            }
            <pre className="message__style">{filterOfMessage}</pre>
            {
                userData
                ?
                    userData.id === '655f65c9823dfa84cf4ae815'
                    ?
                    message.from !== '655f65c9823dfa84cf4ae815' ? <button className="delete" onClick={() => deleteMessage(message.from,message.id)}>Удалить</button> : null
                    :
                    null
                :
                null
            }
            {
                id !== '000'
                ?
                <div className='reputation'>
                    <div className='devide-sections section-1'>
                        <pre className='reputation__value'>{message.likes}</pre>
                        <img src={repOfLike ? clickedagree : agree} alt="Согласие" title="Согласие" className='reputation__img'/>
                    </div>
                    <div className='devide-sections section-2'>
                        <pre className='reputation__value'>{message.dislikes}</pre>
                        <img src={repOfDislike ? clickeddisagree : disagree} alt="Не согласие" title="Не cогласие" className='reputation__img'/>
                    </div>
                </div>
                :
                null
            }
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