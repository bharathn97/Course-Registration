import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateFaculty = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffID, setStaffID] = useState('');
  const isEmailValid = (email) => {
      // Regular expression for a simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  const handleCreateFaculty = async () => {
    // Perform validation if needed
    if (!isEmailValid(email)) {
     toast.error('Invalid email format!', {
       position: 'top-center',
       autoClose: 1500,
       hideProgressBar: true,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       progress: undefined,
       theme: 'dark',
     });
     return;
   }
    // Example validation: Check if required fields are filled
    if (!name || !department || !email || !password || !staffID) {
      toast.error('Please fill in all the required details.', {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    // Example: Call your backend API to create a new faculty
    try {
      const res = await fetch('/api/signup_faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          department,
          email,
          password,
          staffID,
        }),
      });
//Send the required details to create a new faculty
      const response = await res.json();

      if (response.success) {
        toast.success(`Faculty With Staff ID ${staffID} created successfully!`, {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setEmail('');
        setName('');
        setPassword('');
        setStaffID('');
        setDepartment('');
        // Optionally, you can redirect or perform other actions after successful creation
      } else {
        toast.error('Failed to create faculty. Please try again.', {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error('Create faculty error:', error);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        limit={5}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colors"
      />

      <div className="border p-8 rounded-md shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Create a New Faculty</h1>

        <label className="block mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">Department:</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 mb-4"
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="CS">CS</option>
          <option value="AI">AI</option>
          <option value="META">META</option>
          <option value="EEE">EEE</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>

        <label className="block mb-1">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">Staff ID:</label>
        <input
          type="text"
          value={staffID}
          onChange={(e) => setStaffID(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <button
          onClick={handleCreateFaculty}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
        >
          Create Faculty
        </button>
      </div>
    </main>
  );
}

export default CreateFaculty;
