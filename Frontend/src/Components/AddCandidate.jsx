import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

export default function AddElection({isOpen, setIsOpen, selectedId, setFeedBack }){
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        matricule: '',
        election_id: selectedId,
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
        let url = 'http://localhost:3000/admin/election/' + selectedId + '/candidate';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            if(response.ok){
                setFeedBack({message:'Candidate added successfully', severity:'success'});
                console.log('Candidate added successfully');
                handleClose();
            }
        }).catch(error => {
            setFeedBack({message:'Error while adding candidate', severity:'error'});
            console.log('Error while adding candidate: ', error);
        })
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}
            sx={{'&.MuiPaper-root': {borderRadius: '36px'}}}
        >
            <DialogTitle sx={{ mt:2, }}>Add Candidate</DialogTitle>
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
                    name="matricule"
                    label="Matricule"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.matricule}
                    onChange={handleChange}
                />
                 <TextField
                    margin="dense"
                    name="position"
                    label="Position"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.position}
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

