import React, { useState } from 'react';
import { Button, TextField, Typography,Modal } from '@material-ui/core';
import FileBase from 'react-file-base64';



const EditProfileModal = ({ isOpen, onClose,user }) => {
    const [fullName, setFullName] = useState(user?.result?.name);
   
    
    
    const extractFirstName = () => {
      const parts = fullName.split(" ");
      return parts[0];
    };
    const extractLastName = () => {
      const parts = fullName.split(" ");
      return parts.length > 1 ? parts[parts.length - 1] : "";
    };
    const [toggle, setToggle] = useState(false);
    const [firstName, setFirstName] = useState(extractFirstName());
    const [lastName, setLastName] = useState(extractLastName());
   const [newPassword, setNewPassword] = useState('');
   const [selectedFile,setSelectedFile] = useState('');
   const [repeatNewPassword, setRepeatNewPassword] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleSaveChanges = async () => {
    // Prepare the data to send
    const updatedData = {
      name: `${firstName} ${lastName}`,
      selectedFile,
       password : newPassword,
      
      
    };
    console.log(updatedData);

    // Send the data to the server
    try {
      const response = await fetch('http://localhost:5000/user/editedUser/'+user?.result?._id , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      // Handle the response as needed
      if (response.ok) {
        console.log(response);
      } else {
        console.log('something went wrong');
      }
    } catch (error) {
     console.log(error.message);
    }
  };
  return (
    <Modal
    open={isOpen}
    onClose={handleClose}
    className="custom-modal" 
  >
    <div className="modal-content"> 
      <Typography variant="h6">Edit Profile</Typography>

      <TextField label="First Name" fullWidth margin="normal" value={firstName}  onChange={(e) => setFirstName(e.target.value)} />
      <TextField label="Last Name" fullWidth margin="normal" value={lastName}   onChange={(e) => setLastName(e.target.value)} />
      <FileBase
            type="file"
            multiple={false}
            onDone={({base64})=> setSelectedFile(base64)}
 
      />     
     <div style={{margin:'20px 0'}}>
     <Button style={{display:'block'}} onClick={()=> setToggle(!toggle)}>More changes:</Button>
      <div style={{ display: toggle === false ? 'none' : 'block' }}>
      <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
      <TextField label="Repeat new Password" type="password" fullWidth margin="normal" />

      </div>
     </div>
      <Button variant="contained" color="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  </Modal>
  );
};

export default EditProfileModal;
