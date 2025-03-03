import { useState, useEffect } from "react"
import "./AdminPage.css"; // Import the CSS file
import ElectionBox from "./Components/ElectionBox";
import SideBar from "./Components/SideBar";
import DetailsPanel from "./Components/DetailsPanel";
import FeedBack from "./Components/FeedBack";


export default function AdminPage() {
   
    const [elections, setElections] = useState(null);

    const [fetchState, setFetchState] = useState('not-yet')
    
    const[selectedElectionId, setSelectedElectionId] = useState(0);

    const [user , setUser] = useState('admin');

    const [reloadElection, setReloadElection] = useState(false);

    const [feedback, setFeedback] = useState({message: 'succefully loading', severity: 'success'})   ;


    useEffect(() => {

    fetch('http://localhost:3000/admin/elections').then(response =>{
        setFetchState('fetching')
        if(response.ok){
            return response.json()
        }
    }).then(json => {setElections(json)
        setFetchState('fetched')
        console.log('Elections fetched: ', json)
        console.log('Elections: ', elections)
        console.log('Fetch State: ', fetchState);
        console.log('Selected Election Id: ', selectedElectionId);
        console.log('Typeof start_date: ', typeof(json[0].start_date))
        console.log('start_date: ', new Date(json[0].start_date).toDateString());
        console.log('feedback: ', feedback)
        
          
    }).catch(error => {
        console.log('Error while fetching elections: ', error)
        setElections(null)
        setFetchState('failed')
    })}
    ,[reloadElection])

    return (
        <div className="admin-page">
            <div className="side-bar">
                <SideBar />
            </div>
            <div className="side-section">
                <ElectionBox elections={elections} 
                setSelectedId={setSelectedElectionId}
                selectedId={selectedElectionId}
                fetchState={fetchState}
                user={user}
                setFeedback={setFeedback}
                reloadElection={reloadElection}
                setReloadElection={setReloadElection}
                />
            </div>
            <div className="main-section">
                <DetailsPanel elections={elections} selectedElectionId={selectedElectionId}
                  setFeedback={setFeedback}
                  feedback={feedback}
                  setReloadElection={setReloadElection}
                />
                <FeedBack feedback={feedback} />
            </div>
        </div>
    );
}