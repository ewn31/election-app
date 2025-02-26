import { List, ListItem, ListItemIcon, ListItemButton, Divider, Box} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useTheme } from '@mui/material/styles';

export default function SideBar(){
    const theme = useTheme();

    console.log(theme.palette);

    return (
        <Box>
            <List sx={{m:2, '&.MuiList-root':{margin:'0px'},
                '&.MuiButtonBase-root-MuiListItemButton-root':{
                    paddingLeft:'0px', 
                    paddingRight:'0px'
                },'&.MuiListItem-root':{padding:'0px'},
                '&.MuiList-root':{width:'48px', margin:'0px'}}}>
            <ListItem alignItems='flex-start' sx={{p:0}}>
                <ListItemButton>
                    <ListItemIcon>
                        <MenuOpenIcon />
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem alignItems='center' sx={{p:0}}>
                <ListItemButton>
                    <ListItemIcon>
                        <SchoolIcon />
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <ListItem alignItems='center' sx={{p:0}}>
                <ListItemButton>
                    <ListItemIcon>
                        <HowToVoteIcon style={{ color: theme.palette.primary.light }} />
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
        </List>
        </Box>   
    )
}