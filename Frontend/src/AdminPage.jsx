import { Button } from "@mui/material"
import { useState } from "react"
import AddElection from "./Components/AddElection";
import "./AdminPage.css"; // Import the CSS file
import TitleBar from "./Components/TitleBar";

export default function AdminPage() {
    const [open, setOpen] = useState(false);

    const [elections, setElections] = useState([]);


    const handleClick = () => { setOpen(true) }

    const handleClose = () => { setOpen(false) }

    return (
        <div className="admin-page">
            <div className="side-section">
                <h2>Side Section</h2>
                <p>Content for the side section.</p>
            </div>
            <div className="main-section">
                <TitleBar election={{ id: 1, name: "Election 1" }} user={{ username: "admin" }} />
                <h1>Admin Page</h1>
                <p>Here is the admin page.</p>
                <Button variant="contained" onClick={handleClick}>Add Election</Button>
                <AddElection open={open} handleClose={handleClose} />
            </div>
            <div className="side-bar">
                <h2>Side Bar</h2>
                <p>Content for the side bar.</p>
            </div>
        </div>
    );
}