import { Padding } from '@mui/icons-material';
import { Card, CardHeader, CardContent, CardActions, Typography, Button, Box, ListItem, List, ListItemText } from '@mui/material';
import { useState } from 'react';   
import ModifyElection from './ModifyElection';


export default function DetailsCard({election, positions, setFeedback}) {

    const [open, setOpen] = useState(false)

    let totalVotes =  0

    for(let position in positions){
        positions[position].forEach(candidate => {
        totalVotes += candidate.vote_count
    })
}

let election_details = [];

for(let detail in election){
    if(detail === '_id' || detail === '__v') continue;
    if(detail === 'start_date' || detail === 'end_date'){
        election_details.push(
            <ListItem key={election[detail]}>
                <ListItemText 
                primary={detail === 'start_date' ? 'Start Date' : 'End Date'}
                secondary={new Date(election[detail]).toDateString()}
                />
            </ListItem>
        )
        continue;
    }
    election_details.push(
    <ListItem key={election[detail]}>
        <ListItemText 
        primary={detail}
        secondary={election[detail]}
        />
    </ListItem>)
}

let pastStartDate = Date.now() > new Date(election.start_date);
let pastEndDate = Date.now() > new Date(election.end_date);
const ended = <ListItem  key='status'><ListItemText primary={'Status'} secondary={<span style={{color:'green'}}><i>Ended</i></span>}/></ListItem>
const notYetBegan = <ListItem key='status'><ListItemText primary={'Status'} secondary={<span><i>Not yet start</i></span>}/></ListItem>
const ongoing =  <ListItem  key='status'><ListItemText primary={'Status'} secondary={<span style={{color:'red'}}><i>Ongoing</i></span>}/></ListItem>

election_details.push(pastStartDate ? (pastEndDate ? ended : ongoing) : notYetBegan)

    return (
            <Box className='candidate-card' sx={{position:'fixed'}}>
                <Card key={election._id} sx={{borderRadius:'24px'}} >
                    <CardHeader
                        title={election.name}
                    />
                    <CardContent>
                        <Typography variant='body1'>Details:</Typography>
                        <List dense={true}>
                            {election_details}
                        </List>
                    </CardContent>
                    <CardActions>

                    <Button variant='text' color='secondary' disabled={true}>Delete</Button>
                        
                        
                    <Button variant='text' color='primary'
                        onClick={() => setOpen(true)}
                    >
                        Modify
                    </Button>

                        <ModifyElection 
                            isOpen={open}
                            setIsOpen={setOpen}
                            election={election}
                            setFeedback={setFeedback}
                        />
                        </CardActions>
                </Card>
            </Box>
    )
}
