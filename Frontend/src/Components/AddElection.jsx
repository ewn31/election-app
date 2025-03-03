import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

export default function AddElection({isOpen, setIsOpen, setFeedback, setReloadElection }){
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        scope: '',
        start_date: '',
        end_date: ''
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
        const url = 'http://localhost:3000/admin/election';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            if(response.ok){
                setFeedback({message:'Election added successfully', severity:'success'});
                console.log('Election added successfully');
                setReloadElection(true);
                handleClose();
            }
        }).catch(error => {
            setFeedback({message:'Error while adding election', severity:'error'});
            console.log('Error while adding election: ', error);
        })
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}
            sx={{'&.MuiPaper-root': {borderRadius: '36px'}}}
        >
            <DialogTitle sx={{ mt:2, }} color='primary'>Add Election</DialogTitle>
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
                    label="Scope"
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
                    InputLabelProps={{
                        shrink: true,
                    }}
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
                    InputLabelProps={{
                        shrink: true,
                    }}
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

