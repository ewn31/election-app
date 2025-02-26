import { List, ListItem, ListItemText, Typography, ListItemButton, Box } from '@mui/material'
import { useState } from 'react';


export default function ElectionList({elections, selectedId, setSelectedId, fetchState}){
    const[isSelected, setIsSelected] = useState(0)

    if(!elections && fetchState !== 'failed'){

        return(
            <>
                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}
                >
                    <Box>
                        <Typography variant='h5' component={'h5'}>
                            No Elections
                        </Typography>
                        <Typography variant='body2' component={'p'}>
                            Click on the + button to add an election
                        </Typography>
                    </Box>
                </Box>
            </>
        )
    }

    if(fetchState === 'failed'){
        return(
            <>
                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}
                >
                    <Box>
                        <Typography variant='h5' component={'h5'}>
                            Network or Server Error!
                        </Typography>
                        <Typography variant='body2' component={'p'}>
                            Network may be temporarily down. Refresh Page
                        </Typography>
                    </Box>
                </Box>
            </>
        )
    }

    const handleListItemClick = (_id) =>{
        setSelectedId(_id)    
        console.log('Election id',selectedId);
        setIsSelected(_id)
        console.log('isSelected: ',isSelected);
        
    }
    const electionList = elections.map(election => {
        console.log(election._id)
        let primarydisplay = <p>
            {election.name}
            <Typography component={'span'} variant='caption' sx={{ float:'right' }} >
                {`${new Date(election.start_date).getDate()}/${ new Date(election.start_date).getMonth() + 1}/${ new Date(election.start_date).getFullYear()}` }
            </Typography>
        </p>
        return <>
            
            <ListItem key={election._id} className={isSelected === election._id ? 'selected ' : undefined}
                sx={{borderRadius:'24px'}}
            >
            <ListItemButton onClick={() => handleListItemClick(election._id)} >
                <ListItemText
                    primary={primarydisplay}
                    secondary={election.scope}
                />
                 </ListItemButton>
            </ListItem>
        </>
    })
    
    return(
        <List dense={true}>
            {electionList}
        </List>
    )
}