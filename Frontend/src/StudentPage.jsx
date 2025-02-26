import { useState, useEffect } from "react"
import "./AdminPage.css"; // Import the CSS file
import ElectionBox from "./Components/ElectionBox";
import SideBar from "./Components/SideBar";
import DetailsPanelStudent from "./Components/StudentComponents/DetailsPanelStudent";


export default function AdminPage() {
   
    const [elections, setElections] = useState(null);

    const [student, setStudent] = useState({matricule: 'sc10A000', name: 'Epoupa'})

    const [fetchState, setFetchState] = useState('not-yet')
    
    const[selectedElectionId, setSelectedElectionId] = useState(0);

    const [user , setUser] = useState('student');

    useEffect(() => {

    fetch('http://localhost:3000/student/sc10A000/elections').then(response =>{
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
        
        
          
    }).catch(error => {
        console.log('Error while fetching elections: ', error)
        setElections(null)
        setFetchState('failed')
    })
    }
    ,[])

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
                />
            </div>
            <div className="main-section">
                <DetailsPanelStudent elections={elections} selectedElectionId={selectedElectionId} student={student} />
            </div>
        </div>
    );
}