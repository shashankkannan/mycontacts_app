import React from "react";
import { useNavigate } from "react-router-dom";
import contactsData from '../data/sample_data.json'; 

const Home = ()=>{

        const navigate = useNavigate();
        
        const handleViewJson = () => {
          navigate('/view-json', { state: { contactsData } }); // Passing data
        };

        return (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome 2Cretiv</h1>
            <p>By Shashank Kannan</p>
            <button onClick={handleViewJson} style={{ margin: '10px', padding: '10px 20px' }}>
              View Contacts JSON
            </button>
            <p>You can add, delete, edit, search, and download contacts here. By default, 15 sample contacts are provided to demonstrate the functionality.</p>
          </div>
        );
      };
      
      export default Home;

