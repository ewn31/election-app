import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

export default function ModifyElection({setFeedback, isOpen, setIsOpen, election, setReloadElection }){
    const [formData, setFormData] = useState({
        name: election.name,
        type: election.type,
        scope: election.scope,
        start_date: election.start_date,
        end_date: election.end_date,
    });

    const handleClose = () => {
        setIsOpen(false)
        console.log(isOpen)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log(formData);
        let url = 'http://localhost:3000/admin/election/' + election._id ;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            if(response.ok){
                setFeedback({message:'Election modified successfully', severity:'success'});
                setReloadElection(true);
                console.log('Election modified successfully');
                handleClose();
            }
        }).catch(error => {
            setFeedback({message:'Error while modifying election', severity:'error'});
            console.log('Error while modifying election: ', error);
            //console.log('Error while adding candidate: ', error);
        })
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}
            sx={{'&.MuiPaper-root': {borderRadius: '36px'}}}
        >
            <DialogTitle sx={{ mt:2, }}>Modify Election</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant='standard'
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="type"
                    label="Type"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.type}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="scope"
                    label="Type"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.scope}
                    onChange={handleChange}
                />
                 <TextField
                    margin="dense"
                    name="start_date"
                    label="Start Date"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={formData.start_date}
                    onChange={handleChange}
                />

                <TextField
                    margin="dense"
                    name="end_date"
                    label="End Date"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={formData.end_date}
                    onChange={handleChange}
                />
                
            </DialogContent>
            <DialogActions sx={{mb:2, pr:3}}>
                <Button onClick={handleClose}  color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant='contained'>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};