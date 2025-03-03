import  { Alert } from '@mui/material'
import { useEffect, useState } from 'react';

export default function FeedBack({feedback}){
    console.log(feedback.message, feedback.severity);

    const [translate, setTranslate] = useState(null)

    useEffect(()=>{
        setTranslate('0 0')
        setTimeout(() => {
            setTranslate('0 -900px')
        }, 10000);
    }, [feedback])
    
    return(
        <Alert sx={{translate:translate, width:'150px', position:'relative',bottom:'20%', left:'calc(50% - 100px)'}} severity={feedback.severity}>{feedback.message}</Alert>
    )
}