import { useState,useEffect } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
require('dotenv').config();

export default function Home({user,setUser}) {
  const [userType, setUserType] = useState('');//User Type Variable which is either faculty admin or student
  const [isSignUp, setIsSignUp] = useState(false);//To check whether the user wants to sign in or signup if signup show relevant fields and if sign in show relevant details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [staffID, setStaffID] = useState('');
  const [programType, setProgramType] = useState('');
  const [studentID, setStudentID] = useState('');
  const [sem, setSem] = useState(1);
  const [TotalCredits,setTotalCredits]=useState(0);
  const [CGPA,setCGPA]=useState(0);
  //All the fields of admin faculty and studnet handled using useState variables
  const router = useRouter();
  //UseRouter to handle router functions
  const isEmailValid = (email) => {
      // Regular expression for a simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  //handleLogin function handle the login functionality of student admin and faculty and also checks the type of userType
  const handleLogin = async (e) => {
    e.preventDefault();
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

    let data = { email, password };
    try {
      let res;
      if (userType === 'student') {
        res = await fetch('/api/login_student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else if (userType === 'faculty') {
        res = await fetch('/api/login_faculty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else if (userType === 'admin') {
        res = await fetch('/api/login_admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      let response = await res.json();
      setEmail('');
      setPassword('');
      if (response.success) {
        console.log(`Logging in as ${userType} with email: ${email} and password: ${password}`);
        localStorage.setItem('token', response.token);
        toast.success(`You are successfully logged in as ${userType}!`, {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        if (userType) {
       await setTimeout(() => {
         if (userType === "admin") {
           router.push({
             pathname: '/admin',
             query: { email: response.email },
           });
         } else if (userType === "student") {
           router.push({
             pathname: '/student',
             query: { studentID: response.studentID },
           });
         } else if (userType === "faculty") {
           router.push({
             pathname: '/faculty',
             query: { staffID: response.staffID },
           });
         }
       }, 2000);
     }
      } else {
        toast.error('Invalid credentials!', {
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
      console.error('Login error:', error);
    }
  };

//HandleSignup function to handle the signup functionality of the 3 users
  const handleSignUp = async (e) => {
    e.preventDefault();
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

    if(userType==="faculty")
    {
      if (!email || !password || !name || !department || !staffID) {
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
    }
    else if(userType==="student")
    {
      if (!email || !password || !name || !department || !programType || !studentID || !sem || !CGPA || !TotalCredits) {
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
    }
    else if(userType=="admin")
    {
    if(!email || !name || !password){
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
}

    let data = { email, password, name, department, staffID, programType, studentID,sem,TotalCredits,CGPA};

    try {
      let res;

      if (userType === 'faculty') {
        res = await fetch('/api/signup_faculty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else if (userType === 'student') {
        res = await fetch('/api/signup_student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      else if (userType === 'admin') {
        res = await fetch('/api/signup_admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      let response = await res.json();
      setEmail('');
      setName('');
      setPassword('');
      setStaffID('');
      setProgramType('');
      setStudentID('');
      setDepartment('');
      setSem('');
      setSem('');
      setCGPA('');
      setTotalCredits('');

      if (response.success) {
          localStorage.setItem('token', response.token);//Put Token to local storage which is required to be usd later for user authentication
          localStorage.setItem('email', response.email);
        toast.success(`Your Account has been created as a ${userType}!`, {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        // Redirect to homepage so that user needs to login after signup
        if (userType === 'admin')
        {
          router.push("/");
        } else if (userType === 'faculty') {
            router.push("/");
        } else if (userType === 'student') {
          router.push("/");
        }
      } else {
        //If there is error in signing up
        toast.error('Signup failed. Please try again.', {
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
      console.error('Signup error:', error);
    }
  };


  //To set the user Type
  const handleUserTypeSelect = (selectedUserType) => {
    setUserType(selectedUserType);
  };

  const handleGoBack = () => {
    // Reset userType and switch back to login mode
    setUserType('');
    setIsSignUp(false);
    setEmail('');
  setPassword('');
  setName('');
  setDepartment('');
  setStaffID('');
  setProgramType('');
  setStudentID('');
  setSem(1);
  setTotalCredits(0);
  setCGPA(0);
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
      {userType ? (
        <div className="border p-8 rounded-md shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h1>
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
          {isSignUp && (
            <>
              {userType === 'admin' && (
                <>
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                </>
              )}
              {userType === 'faculty' && (
                <>
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
                  <label className="block mb-1">Staff ID:</label>
                  <input
                    type="text"
                    value={staffID}
                    onChange={(e) => setStaffID(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                </>
              )}
              {userType === 'student' && (
                <>
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
                  <label className="block mb-2">Sem</label>
                  <input
                    type="text"
                    value={sem}
                    onChange={(e) => setSem(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                  <label className="block mb-1">Student ID:</label>
                  <input
                    type="text"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                  <label className="block mb-1">Total Credits</label>
                  <input
                    type="text"
                    value={TotalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                  <label className="block mb-1">CGPA</label>
                  <input
                    type="text"
                    value={CGPA}
                    onChange={(e) => setCGPA(e.target.value)}
                    className="w-full p-2 mb-4"
                  />
                </>
              )}
            </>
          )}

          {isSignUp ? (
            <button
              onClick={handleSignUp}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-700"

            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-indigo-600 text-white p-2 rounded cursor-pointer hover:bg-indigo-700"
            >
              Sign in
            </button>
          )}
          <button
            onClick={handleGoBack}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Go back to user selection
          </button>
        </div>
      ) : (
        <div className="border p-8 rounded-md shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Select User Type</h1>
          <div className="flex justify-between">
          <button
            onClick={() => handleUserTypeSelect('admin')}
            className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-700"
          >
            Admin
          </button>
            <button
              onClick={() => handleUserTypeSelect('faculty')}
              className="bg-yellow-500 text-white p-2 rounded cursor-pointer hover:bg-yellow-700"
            >
              Faculty
            </button>
            <button
              onClick={() => handleUserTypeSelect('student')}
              className="bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-700"
            >
              Student
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </p>
        </div>
      )}
    </main>
  );
}
