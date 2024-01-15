import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateStudent = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentID, setStudentID] = useState('');
  const [TotalCredits, setTotalCredits] = useState(0);
  const [CGPA, setCGPA] = useState(0);
  const [sem, setSem] = useState(1);
  const [programType, setProgramType] = useState('');
const isEmailValid = (email) => {
      // Regular expression for a simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  const handleCreateStudent = async () => {
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
    if (!name || !department || !email || !password || !studentID || !TotalCredits || !CGPA || !programType || !sem) {
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

    // Example: Call your backend API to create a new student
    try {
      const res = await fetch('/api/signup_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          department,
          email,
          password,
          studentID,
          TotalCredits,
          CGPA,
          programType,
          sem
        }),
      });
//Send required details to /api/signup_student to create a new studnet
      const response = await res.json();

      if (response.success) {
        toast.success(`Student with Student ID ${studentID} created successfully!`, {
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
        setProgramType('');
        setStudentID('');
        setDepartment('');
        setSem('');
        setCGPA('');
        setTotalCredits('');
        // Optionally, you can redirect or perform other actions after successful creation
      } else {
        toast.error('Failed to create student. Please try again.', {
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
      console.error('Create student error:', error);
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
        <h1 className="text-2xl font-bold mb-4">Create a New Student</h1>

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

        <label className="block mb-1">Student ID:</label>
        <input
          type="text"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">Total Credits:</label>
        <input
          type="text"
          value={TotalCredits}
          onChange={(e) => setTotalCredits(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">CGPA:</label>
        <input
          type="text"
          value={CGPA}
          onChange={(e) => setCGPA(e.target.value)}
          className="w-full p-2 mb-4"
        />
        <label className="block mb-1">Sem:</label>
        <input
          type="text"
          value={sem}
          onChange={(e) => setSem(e.target.value)}
          className="w-full p-2 mb-4"
        />

        <label className="block mb-1">Program Type:</label>
        <select
          value={programType}
          onChange={(e) => setProgramType(e.target.value)}
          className="w-full p-2 mb-4"
        >
          <option value="">Select Program Type</option>
          <option value="Btech">Btech</option>
          <option value="Mtech">Mtech</option>
          <option value="Phd">Phd</option>
        </select>

        <button
          onClick={handleCreateStudent}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
        >
          Create Student
        </button>
      </div>
    </main>
  );
}

export default CreateStudent;
