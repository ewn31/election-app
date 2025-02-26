import { useState } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListSubheader, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle, ListItemText } from '@mui/material';

export default function Vote({positions, studentMatricule, isOpen, setIsOpen}) {

        const [formData, setFormData] = useState({})

        const handleClose = () => {
            setIsOpen(false)
            console.log(isOpen)
        }

        const handleChange = (e) => {
            setFormData({...formData, [e.target.name]: e.target.value})
        }

        const handleSubmit = () => {
            console.log('voting form', formData)
            let url = `http://localhost:3000/student/${studentMatricule}/vote`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }).then(response => {
                if(response.ok){
                    console.log('Vote casted successfully');
                }
            }).catch(error => {
                console.log('Error while casting vote: ', error);
            })

            handleClose();
        }

        const candidates = Object.keys(positions).map(position => {
            return (
                <FormControl component="fieldset" >
                    <List>
                    <FormLabel component="legend"><ListSubheader>{position}</ListSubheader></FormLabel>
                        <RadioGroup aria-label={position} name={position} onChange={handleChange}>
                            {
                                positions[position].map(candidate => {
                                    return (
                                        <ListItem>
                                            <FormControlLabel value={candidate.name} control={<Radio />} />
                                            <ListItemAvatar>
                                                <Avatar>{candidate.name[0]}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={candidate.name}
                                                secondary={candidate.matricule}

                                            />
                                        </ListItem>
                                    )
                                })
                            }
                        </RadioGroup>
                    </List>
                </FormControl>
            )
        })

        return (
            <Dialog open={isOpen} onClose={handleClose}
                sx={{'&.MuiPaper-root': {borderRadius: '36px'}}}
                >
                <DialogTitle sx={{ mt:2, }}>Vote</DialogTitle>  
                <DialogContent>
                    <form>
                        {
                            candidates
                        }
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>Vote</Button>
                </DialogActions>
            </Dialog>
            
        )
}