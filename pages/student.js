import React from "react";
import {useState,useEffect} from "react";
import { useRouter } from 'next/router';
import Link from "next/link"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
const Student=({logout})=>{
    const router = useRouter();
    //To get the token when user logs in as student from local storage and if the token exists then allow further render else push back to homepage
    useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/');
        }
      } catch (error) {
        router.push("/");
      }
    };

    checkToken();
  }, []);
  //Get the student Id from the route url as query
  const { studentID} = router.query;
  //Initial Data for available courses
  const [initialData1, setInitialData1]=useState([]);
  //Initial Data for enrolled courses
  const [initialData, setInitialData]=useState([]);
  //Variable to get whatever data the user types in the search input box
  const [searchQuery, setSearchQuery] = useState('');
  //To store the data that is actually relevant to the data in the search query
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [filteredData1, setFilteredData1] = useState(initialData1);
  //To store all the courses that the student has enrolled to
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  //To store all the data relevant to that particular student
  const [studentData, setStudentData] = useState(null);
  //To store the student degree
  const [studentDegree, setStudentDegree] = useState(null);
  //To store the student branch
  const [studentBranch, setStudentBranch] = useState(null);
  //To handle when user clicks on the view course grades button to redirect to another page to show grades
  const handleCourseClick = (CourseCode) => {
    const slug = `${CourseCode}`;
    router.push(`/showgrades/${slug}?StudentID=${studentID}`);
  };

  //Use effect to fetch the student details by sending a fetch request to /api/studentdetails with the help of fetch api
      useEffect(() => {
      const fetchCourses = async () => {
        try {
          if (studentID) {
            const response = await fetch(`/api/studentdetails?StudentID=${studentID}`);
            const data = await response.json();
            setStudentData(data);//setting the student data with the data recieved
            setStudentDegree(data.programType);//setting the student program from the data recieved
            setStudentBranch(data.department);//setting the student department from the data recieved
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };

      fetchCourses();
    }, [studentID]);//Wait until student ID value changes or is defined
      const [notifications,setNotifications]=useState([]);//To store all the courses that the student is enrolled in which would be required to check the Course drop deadline
      useEffect(() => {
        const fetchCourses = async () => {
          try {
            if(studentID)
            {
            const response = await fetch( `/api/allcoursesfilterstudent?StudentID=${studentID}`);//Fetch all those courses in whose enrolled students the student ID is there
            const data = await response.json();
            setInitialData(data);
            setFilteredData(data);
            setNotifications(data);
          }
          } catch (error) {
            console.error("Error fetching the instructor courses:", error);
          }
        };

        fetchCourses();
      }, [studentID]);

const [notifications1,setNotifications1]=useState([]);//To store all the courses that the student is enrolled in which would be required to check course registration deadline
      useEffect(() => {
        const fetchCourses = async () => {
          try {
            if(studentDegree &&  studentBranch &&  studentID)
            {
            const response = await fetch( `/api/allcoursesfilter?degree=${studentDegree}&branch=${studentBranch}&StudentID=${studentID}`);//Fetch only those courses that match the student branch studnet degrre and the one in which student has not yet been enrolled or assigned
            const data = await response.json();
            setInitialData1(data);
            setNotifications1(data);
            setFilteredData1(data);
          }
          } catch (error) {
            console.error("Error fetching the instructor courses:", error);
          }
        };

        fetchCourses();
      }, [studentDegree, studentBranch,studentID]);

//Function to handle search functionality for enrolled courses table
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = initialData.filter(
      (course) =>
        course.CourseCode.toLowerCase().includes(query) ||
        course.CourseTitle.toLowerCase().includes(query)
    );

    setSearchQuery(query);
    setFilteredData(filtered);
  };
//Function to handle search functionality for available courses table
  const handleSearch1 = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = initialData1.filter(
      (course) =>
        course.CourseCode.toLowerCase().includes(query) ||
        course.CourseTitle.toLowerCase().includes(query)
    );

    setSearchQuery1(query);
    setFilteredData1(filtered);
  };
//Function to handle when the student chooses a particular course to enroll here it first checks whether the student has credits greater than the required number of credits and
//then it will check whether the student has higher cgpa then required cgpa and also checks whether the current date is lesser than the course registration deadline
  const handleEnroll = (course) => {
    if(studentData.TotalCredits>=course.RequiredCredits)
    {
    if(studentData.CGPA>=course.RequiredCGPA)
    {
    const currentDateTime = new Date();
    const deadline = new Date(course.CourseRegDeadline);
   if(currentDateTime>deadline)
   {
     toast.error(`Cannot enroll to the course ${course.CourseCode} Registration Deadline already passed!`, {
             position: 'top-center',
             autoClose: 1500,
             hideProgressBar: true,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: 'light',
           });
   }
   else
   {
     toast.success(`${course.CourseCode} Course Has Been Added To Course Cart!`, {
             position: 'top-center',
             autoClose: 1500,
             hideProgressBar: true,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: 'light',
           });
   setEnrolledCourses([...enrolledCourses, course]);
   //If true then store that particular course in enrolled courses which would be sent as query to /coursecart as query
   }
 }
 else
 {
   toast.error(`Cannot enroll to the course ${course.CourseCode},Minimum CGPA requirement not met!`, {
           position: 'top-center',
           autoClose: 1500,
           hideProgressBar: true,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: 'light',
         });
 }
}
else
{
  toast.error(`Cannot enroll to the course ${course.CourseCode},Minimum Total credits requirement not met!`, {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
}
  };


  return(
    <>
    <div className="flex">
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
    <div className="w-70 h-full-fixed">
      <aside className="flex flex-col w-64 h-full px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">

        <div className="flex flex-col justify-between flex-1 mt-6 w-full">
        <nav>
  <Link href={`/student?studentID=${studentID}`} className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span className="mx-4 font-medium">Dashboard</span>
  </Link>

  <button
  onClick={() => {
    router.push({
      pathname: '/myAccount',
      query: { studentID: studentID },
    });
  }}
  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  <span className="mx-4 font-medium">My Account</span>
</button>
  <Link href={{ pathname: "/coursecart", query: { enrolledCourses: JSON.stringify(enrolledCourses),studentID } }} className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span className="mx-4 font-medium">View Course Cart</span>
  </Link>

  <button
  onClick={() => {
    router.push({
      pathname: '/dropcourse',
      query: { studentID: studentID ,email:studentData.email },
    });
  }}
  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
  <span className="mx-4 font-medium">Drop Course</span>
</button>
<button
onClick={() => {
  router.push({
    pathname: '/timetable_student',
    query: { ID: studentID },
  });
}}
className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
>
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
<span className="mx-4 font-medium">Time Table</span>
</button>

  <hr className="my-6 border-gray-200 dark:border-gray-600" />

  <button onClick={logout} className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <span className="mx-4 font-medium">Logout</span>
  </button>
</nav>
<div className="mt-1">
  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Course Drop Deadlines</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Course Code
          </th>
          <th scope="col" className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Deadline
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
        {notifications
          .filter(notification => new Date(notification.CourseDropDeadline) > new Date())
          .map((notification, index) => {
            const currentDateTime = new Date();
            const deadline = new Date(notification.CourseDropDeadline);
            const timeDifference = deadline - currentDateTime;
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-100 dark:text-gray-900">{notification.CourseCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-900">
                    {`${days} days ${hours} hours ${minutes} minutes`}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
</div>
<div className="mt-1">
  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Course Enrollment Deadlines</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Course Code
          </th>
          <th scope="col" className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Deadline
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
        {notifications1
          .filter(notification => new Date(notification.CourseRegDeadline) > new Date())
          .map((notification, index) => {
            const currentDateTime = new Date();
            const deadline = new Date(notification.CourseRegDeadline);
            const timeDifference = deadline - currentDateTime;
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-100 dark:text-gray-900">{notification.CourseCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-900">
                    {`${days} days ${hours} hours ${minutes} minutes`}
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
</div>
        </div>
      </aside>
    </div>
    <div className="w-4/5">
    <div class="bg-white ">
      <div class="container px-6 py-6 mx-auto">
          <div class="grid grid-cols-1 gap-2 mt-3 xl:mt-4 xl:gap-2 md:grid-cols-2 lg:grid-cols-5">
              <div class="w-3/4 p-4 space-y-4 text-center border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900" >
                  <p class="font-medium text-3xl text-gray-500 uppercase dark:text-gray-300">{studentData &&  studentData.sem}th</p>
              </div>
              <div class="w-3/4 p-4 space-y-4 text-center border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900" >
                  <p class="font-medium text-3xl text-gray-500 uppercase dark:text-gray-300">{studentData &&  studentData.TotalCredits} Credits</p>
              </div>
              <div class="w-3/4 p-4 space-y-4 text-center border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900" >
                  <p class="font-medium text-3xl text-gray-500 uppercase dark:text-gray-300">{studentData &&  studentData.CGPA} CGPA</p>
              </div>
              <div class="w-3/4 p-4 space-y-4 text-center bg-blue-600 rounded-lg dark:bg-gray-900">
                  <p class="font-medium text-3xl text-gray-200 uppercase">{studentData &&  studentData.department}</p>
              </div>

              <div class="w-3/4 p-4 space-y-4 text-center border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900">
                  <p class="font-medium text-3xl text-gray-500 uppercase dark:text-gray-300">{studentData &&  studentData.programType}</p>

              </div>
          </div>
      </div>
  </div>
  <section className="container px-6 w-70" style={{height:"400px"}}>
        <div className="mt-6 md:flex md:items-center md:justify-between">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                Enrolled Courses
                </button>
            </div>

            <div className="relative flex items-center mt-4 md:mt-0">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </span>

                <input type="text"value={searchQuery} onChange={handleSearch} placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
            </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button className="flex items-center gap-x-3 focus:outline-none">
                          <span>Course Code</span>
                          <svg
                            className="h-3"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                            <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                            <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                          </svg>
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Course Title
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                      Description
                                  </th>
                                  <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                      No. of Lectures and Practicals
                                  </th>
                                  <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Credits</th>
                                  <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Instructor</th>
                                  <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Course Drop deadline</th>
                                  <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Course Type</th>
                                  <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">View course grades</th>
                                    <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Course Feedback</th>
                                      <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Course Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData.map((course) => (//Go through the enrolled courses for the particualr studnet and create a table
                      <tr key={course.CourseCode}>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">{course.CourseCode}</h2>
                              </div>
                          </td>
                          <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                  {course.CourseTitle}
                              </div>
                          </td>
                          <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                              <div>
                                  <h4 className="text-gray-700 dark:text-gray-200">{course.description}</h4>
                              </div>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div className="flex items-center space-x-2">
                              <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoLectures}</p>
                              <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoLectures}</p>
                          </div>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div className="flex items-center">
                              <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.credits}</p>
                          </div>
                          </td>

                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">{course.instructor}</h2>
                              </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">{new Date(course.CourseDropDeadline).toLocaleDateString()}</h2>
                              </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">{course.CourseType}</h2>
                              </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                              <div>
                              <button class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80" onClick={() => handleCourseClick(course.CourseCode)}>
  View course grades
  </button>
                              </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                              {course.courseFeedback.some(feedback => feedback.studentID === studentID) ? (//If course feedack is laready filled show already filled
                                <span className="text-gray-500 px-8">Already Filled</span>//else if the course feedback is not yet set by the admin make the button diabled else allow student to set the course feedack
                              ) : (
                                <Link href={`/coursefeedback?CourseCode=${course.CourseCode}&StudentID=${studentID}`}>
                                  <button
                                    className={`px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 ${
                                      course.setCourseFeedBackForm === 'false' ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                                    }`}
                                    disabled={course.setCourseFeedBackForm === 'false'}
                                  >
                                    Course Feedback
                                  </button>
                                </Link>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
    <div>
      {course.courseFeedback.some((feedback) => feedback.studentID === studentID) ? (//Only if the course feedback is filled show the grades
        (() => {//The course grade is predefined like 80-90 gives you AB grade
          const studentGrades = course.courseGrade.filter((grade) => grade.studentID === studentID);
          if (studentGrades.length > 0) {   //Check whether there is course grades with studnetID as indetifier
            const totalMarks = studentGrades
              .flatMap((grade) => grade.grade.map((exam) => parseFloat(((parseFloat(exam.marksObtained) / parseFloat(exam.maxMarks)) * parseFloat(exam.weightage)))))
              .reduce((accumulator, currentMarks) => accumulator + currentMarks, 0);

            let grade;
            if (totalMarks >= 90) {
              grade = <span className="text-gray-100 px-8">AA</span>;
            } else if (totalMarks >= 80) {
              grade = <span className="text-gray-100 px-8">AB</span>;
            } else if (totalMarks >= 70) {
              grade = <span className="text-gray-100 px-8">BB</span>;
            } else if (totalMarks >= 60) {                               //Check the total Marks obtained by the student and then calucalte the grade
              grade = <span className="text-gray-100 px-8">BC</span>;
            } else if (totalMarks >= 50) {
              grade = <span className="text-gray-100 px-8">CC</span>;
            } else if (totalMarks >= 40) {
              grade = <span className="text-gray-100 px-8">CD</span>;
            } else if (totalMarks >= 30) {
              grade = <span className="text-gray-100 px-8">DD</span>;
            } else {
              grade = <span className="text-gray-100 px-8">FF</span>;
            }
            return grade;
          } else {
            return <span className="text-gray-100 px-8">Not yet Graded</span>;
          }
        })()
      ) : (
        <span className="text-gray-100 px-8">Not yet Graded</span>
      )}
    </div>
  </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

<div className="w-full">
<section className="container px-6 w-70 " style={{height:"400px"}}>
      <div className="mt-6 md:flex md:items-center md:justify-between">
          <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
              <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
              Available Courses
              </button>
          </div>

          <div className="relative flex items-center mt-4 md:mt-0">
              <span className="absolute">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
              </span>

              <input type="text"value={searchQuery1} onChange={handleSearch1} placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
          </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <button className="flex items-center gap-x-3 focus:outline-none">
                        <span>Course Code</span>
                        <svg
                          className="h-3"
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                          <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                          <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                        </svg>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Course Title
                    </th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Description
                                </th>
                                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    No. of Lectures Per week
                                </th>
                                <th scope="col" className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    No. of Practicals per week
                                </th>
                                <th scope="col" className="px-15 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Course Registration Deadline
                                </th>
                                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Minimum Credits Required
                                </th>
                                <th scope="col" className="px-7 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Minimum CGPA Required
                                </th>
                                <th scope="col" className="px-7 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Credits</th>
                                <th scope="col" className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Instructor</th>
                                <th scope="col" className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Course Type</th>
                                <th scope="col" className="px-10 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Enrollment</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData1.map((course) => (//Go through the availabe courses for the particualr studnet and create a table
                    <tr key={course.CourseCode}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">{course.CourseCode}</h2>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                {course.CourseTitle}
                            </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div>
                                <h4 className="text-gray-700 dark:text-gray-200">{course.description}</h4>
                            </div>
                        </td>
                        <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoLectures}</p>
                        </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoPracticals}</p>
                        </div>
                        </td>
                        <td className="px-20 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">{new Date(course.CourseRegDeadline).toLocaleDateString()}</p>
                        </div>
                        </td>
                        <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">{course.RequiredCredits}</p>
                        </div>
                        </td>
                        <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">{course.RequiredCGPA}</p>
                        </div>
                        </td>
                        <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                        <div className="flex items-center">
                            <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.credits}</p>
                        </div>
                        </td>

                        <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">{course.instructor}</h2>
                            </div>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                            <div>
                                <h2 className="font-medium text-gray-800 dark:text-white ">{course.CourseType}</h2>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
      <div>
        <button
          onClick={() => handleEnroll(course)}
          className="px-6 py-2 font-medium tracking-wide text-white capitalize bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 rounded-lg">
          Enroll
        </button>
      </div>
    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

</div>
    </div>
    </div>


</>
  );
}
export default Student;
