import { Padding } from '@mui/icons-material';
import { Card, CardHeader, CardContent, Typography, ListItemIcon, Button, Box, ListItem, List, ListItemText } from '@mui/material';
import { useState } from 'react';   
import PersonIcon from '@mui/icons-material/Person';



export default function CandidateCard({electionId, positions, setElectionId}) {
    console.log('In candidate card: ', electionId);

    if(!positions){

        return(
            <>
                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
                    <Box>
                        <Typography variant='h5' component={'h5'}>
                            No Candidates Yet
                        </Typography>
                        <Typography 
                            variant='body2' component={'p'}
                        >
                            Click on the add Candidate Button to add a Candidate
                        </Typography>
                    </Box>
                </Box>
            </>
        )
    }
    
    //setElectionId(electionId)
    const candidateList = []
    for(let position in positions){
        candidateList.push(
            <Box className='candidate-card'>
                <Card key={position} sx={{borderRadius:'24px'}} >
                    <CardHeader
                        title={position}
                    />
                    <CardContent>
                        <Typography variant='body1'>Candidates:</Typography>
                        <List>
                            {positions[position].map(candidate => {
                                return <ListItem key={candidate}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={<>
                                            {candidate.name}
                                            <Typography component={'span'} variant='caption' sx={{ float:'right' }} >
                                                {candidate.votes}
                                            </Typography>
                                        </>}
                                    />
                                </ListItem>
                            })}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    return candidateList
}
