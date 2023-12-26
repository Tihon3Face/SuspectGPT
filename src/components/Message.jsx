import React, { useEffect, useRef, useState } from 'react';
import "./Message.css"
import agree from '../images/agree.png'
import disagree from '../images/disagree.png'
import clickedagree from '../images/clickedagree.png'
import clickeddisagree from '../images/clickeddisagree.png'

function Message({message,numOfMessage,id,userData,hide,changeIsHidden,role,ownRole,roleOfChat,changeRoleOfChat,deleteMessage,likes,dislikes,loader}) {
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
                    userData.id === '6568bd8168b3f8667fea2a83'  || userData.id === '656a2c690a0435ad1cb50659'
                    ?
                        id !== '000'
                        ?
                            <button className="delete" onClick={() => deleteMessage(message.from,message.id)}>Удалить</button>
                        :
                        null
                    :
                    null
                :
                null
            }
            {   
                loader && id !== '000'
                ?
                <div className='box-of-loader'>
                    <div className='blocked section-1 block-it' style={likes ? {backgroundColor: 'aqua'} : {backgroundColor: 'white'}}>
                        <pre className='reputation__value block-it'>{message.likes}</pre>
                        <img src={likes ? clickedagree : agree} alt="Согласие" title="Согласие" className='reputation__img block-it'/>
                    </div>
                    <div className='blocked section-2 block-it' style={dislikes ? {backgroundColor: 'aqua'} : {backgroundColor: 'white'}}>
                        <pre className='reputation__value block-it'>{message.dislikes}</pre>
                        <img src={dislikes ? clickeddisagree : disagree} alt="Не согласие" title="Не cогласие" className='reputation__img block-it'/>
                    </div>
                </div>
                :
                <div className='reputation' style={id === '000' ? {display:'none'} : null}>
                    <div className='devide-sections section-1' style={likes ? {backgroundColor: 'aqua'} : {backgroundColor: 'white'}}>
                        <pre className='reputation__value'>{message.likes}</pre>
                        <img src={likes ? clickedagree : agree} alt="Согласие" title="Согласие" className='reputation__img'/>
                    </div>
                    <div className='devide-sections section-2' style={dislikes ? {backgroundColor: 'aqua'} : {backgroundColor: 'white'}}>
                        <pre className='reputation__value'>{message.dislikes}</pre>
                        <img src={dislikes ? clickeddisagree : disagree} alt="Не согласие" title="Не cогласие" className='reputation__img'/>
                    </div>
                </div>
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