import  { Alert } from '@mui/material'

export default function FeedBack({message, severity}){
    return(
        <Alert severity={severity}>{message}</Alert>
    )
}