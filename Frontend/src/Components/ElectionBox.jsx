import { useState, useEffect } from "react";
import { Box, InputBase, IconButton, Typography, TextField, InputAdornment, Fab} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddElection from "./AddElection";
import ElectionList from "./ElectionList";
import { basicFilter } from '../lib/filter'


export default function ElectionBox({ user, elections, selectedId, setSelectedId, fetchState, setFeedback }){

    const [electionsToDisplay, setElectionsToDisplay] = useState(elections);

    const [search, setSearch] = useState('');



    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => { setIsOpen(true) }

    function handleChange(e){
        const { value } = e.target;
        //setSearch(value);
        console.log(basicFilter(elections, search, 'name'));
    }

    function SearchBar(){
        return (
            <Box>
      <TextField
        name="search"
        component={'div'}
        variant="outlined"
        fullWidth={true}
        size="Small"
        sx={{ backgroundColor:'#fef7ff', margin:'10px 0px', borderRadius:'36px', 
            '& .MuiOutlinedInput-root': {
                borderRadius: '36px',
                '& fieldset': {
                  border: 'none',
                },
            }
        }}
        onChange={handleChange}
        placeholder="Search"
        slotProps={{
            input: {
              inputProps:{
                style:{ padding: '16px', borderRadius:'36px', border:'none', outline:'none' }
              },
              startAdornment: (
                <InputAdornment position="end">
                  <IconButton type="button" sx={{ p: '10px', float:'right' }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
      />
      
    </Box>
        )
    }

    function TitleBar(){

        return(
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 0px' }}>
                <Typography variant='h5'>
                    Elections
                </Typography>
                { user === 'admin' &&
                <IconButton onClick={handleClick}
                    sx={{ margin:'0px' }}>
                        <Fab color="primary" aria-label="add">
                            <AddIcon />
                        </Fab>
                    <AddElection
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    setFeedback={setFeedback}
                     />
                </IconButton>}
            </Box>
        )
    }

    return (
        <div>
            <TitleBar />
            <SearchBar />
            <ElectionList elections={elections} 
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            fetchState={fetchState}
            />
        </div>
    )

} 
