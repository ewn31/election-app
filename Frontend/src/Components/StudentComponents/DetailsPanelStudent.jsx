import { Box, Button, Typography, IconButton,  } from '@mui/material'
import PersonAdd from '@mui/icons-material/PersonAdd';
import TitleBar from '../TitleBar'
import DetailsCard from '../DetailsCard'
import Vote from './Vote';
import { useState, useEffect } from 'react'

export default function DetailsPanel({elections, student, selectedElectionId}){

    console.log('In DetailsPanel: ', elections, selectedElectionId);

    const [election, setElection] = useState(null) 

   /* useEffect(() => {
        fetch(`http://localhost:3000/student/${student.matricule}/vote/${selectedElectionId}`).then(response =>{
            if(response.ok){
                return response.json()
            }
        }).then(json => {
            setPositions(json)
            console.log('Positions: ', json)
        }).catch(error => { console.log('Error while fetching positions', error) })
    }, [selectedElectionId])*/
    
    const [positions, setPositions] = useState({
        "President": [
            {
                "id": "67bd9697ce00822dc5300e82",
                "name": "Epoupa",
                "matricule": "sc10A000",
                "votes": 0
            },
            {
                "id": "67bd99b9ce00822dc5300e89",
                "name": "Alima",
                "matricule": "sm10A000",
                "votes": 0
            }
        ],
        "Accountant": [
            {
                "id": "67bda21c03572dcb53e75524",
                "name": "Jacob",
                "matricule": "ar10A000",
                "votes": 0
            }
        ]
    })

    const [open, setOpen] = useState(false);

    const handleAddCandidateClick = () => { 

        console.log('In DetailsPanel: ', elections, selectedElectionId);
        
        setOpen(true) }

    if(!elections) return (<>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <Typography
                variant='h3'
            >No elections</Typography>
        </Box>
    </>)
    if(!selectedElectionId) return (<>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <Box sx={{textAlign:'center'}}>
            <Typography component={'h4'} variant='h4' sx={{mb:2}}>Welcome</Typography>
            <Typography variant='body2' component={'p'}>
                Select an election to view details, <br /> add candidates and view results.
            </Typography>
            </Box>
        </Box>
        </>)
    /*if(!positions || Object.keys(positions).length === 0) return (<>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
            <Typography
                variant='h3'
            >No Candidates</Typography>
        </Box>
        </>
    ) */  
    return(
        <>
            <TitleBar election={elections.find(election=>election._id === selectedElectionId)} 
                    user={{ username: "admin" }} />
                <Box 
                    sx={{borderRadius:'36px', display: 'flex', flexWrap: 'wrap',minHeight:'80vh', width:'100%' }}
                >
                    <Box 
                component='div'
                sx={{display: 'flex', flexDirection:'row',  gap: '24px', flexWrap: 'wrap', justifyContent:'space-around', paddingTop:'24px', minHeight:'80vh', width:'70%',
                 }}>
                    <Box sx={{display:'flex', width:'100%', pr:6, justifyContent:'flex-end', maxHeight:'48px',}}>
                        <Button
                            variant="text"
                            color="primary"
                            sx={{float:'right', }}
                            size="large"
                            onClick={handleAddCandidateClick}
                        >
                            <PersonAdd />
                            Vote

                        </Button>
                        <Vote isOpen={open} setIsOpen={setOpen} studentMatricule={student.matricule} positions={positions}  />
                    </Box>
                </Box>
                <Box 
                component='div'
                sx={{display: 'flex', flexDirection:'row', gap: '24px', flexWrap: 'wrap', justifyContent:'space-around', paddingTop:'24px', minHeight:'80vh', width:'30%' }}>
                  <DetailsCard election={elections.find(election=>election._id === selectedElectionId)}
                  positions={positions} />
                </Box>
                </Box>
        </>
    )
}