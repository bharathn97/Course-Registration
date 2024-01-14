import React from "react";
import {useState,useEffect} from "react";
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link"
const DropCourse=({user})=>{
  const router=useRouter();
  //Check if the token exists in the local storage if not redirect to homepage
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
  const { studentID }=router.query;
  const { email }=router.query;
  const [enrolledCourses,setEnrolledCourses]=useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [initialData,setInitialData]=useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/allenrolledcourses?StudentID=${studentID}`);
        const data = await response.json();
        setInitialData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching the instructor courses:", error);
      }
    };

    fetchCourses();
  }, [studentID]);



 const [selectedSchedule, setSelectedSchedule] = useState(null)
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
  // Your component file

  const handleEditClick = async (CourseCode, CourseTitle,CourseDropDeadline) => {
    // Show a confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to drop the course: ${CourseCode} - ${CourseTitle}?`);

    if (!confirmed) {
      // If the user cancels the action, do nothing
      return;
    }
    const currentDateTime = new Date();
    const deadline = new Date(CourseDropDeadline);
    console.log(currentDateTime.getTime());
    console.log(deadline.getTime())
   if(currentDateTime.getTime()>deadline.getTime())
   {
     toast.error(`Cannot drop the course ${CourseCode} Drop Deadline already passed!`, {
             position: 'top-center',
             autoClose: 1500,
             hideProgressBar: true,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: 'light',
           });
           return;
   }
    try {
      // Make API call to remove the course from the enrolled courses
      const response = await fetch(`/api/dropcourse?StudentID=${studentID}&CourseCode=${CourseCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
          const updatedData = initialData.filter(
            (course) => course.CourseCode !== CourseCode
          );

          setFilteredData(updatedData);

          // Display an alert to the student
          alert(`Dropped course: ${CourseCode} - ${CourseTitle}`);

          // Now, make a call to the student data modification API
          const studentDataResponse = await fetch(`/api/dropcoursestudent?StudentID=${studentID}&CourseCode=${CourseCode}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
            console.log("The email of the recpeient is"+email);
            const emailData = {
            to: email, // replace with the recipient's email
            subject: `Course Dropped ${CourseCode}`,
            text: `You have successfully dropped the course: ${CourseCode} - ${CourseTitle}`,
            };

           try {
                 const emailResponse = await fetch('/api/send-email', {
                 method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
               body: JSON.stringify(emailData),
             });

               if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
                if (!emailResult.success) {
               console.error('Failed to send email:', emailResult.message);
              }
            } else {
            console.error('Failed to send email:', emailResponse.statusText);
            }
           } catch (error) {
               console.error('Error sending email:', error.message);
            }
    } catch (error) {
      // Handle network or other errors
      console.error('Error dropping course:', error.message);
    }
  };

console.log("Hey how "+initialData);

  return(
    <div>
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
    <div className="min-w-full">
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
                                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Instructor
                                    </th>
                                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        Course Drop Deadline
                                    </th>
                                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Credits</th>
                                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Drop Option</th>

                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData && filteredData.map((course) => (
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
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center space-x-3">
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoPracticals}</p>
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.NoLectures}</p>
                            </div>
                            </td>
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center">
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">{course.instructor}</p>
                            </div>
                            </td>
                            <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center">
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">{new Date(course.CourseDropDeadline).toLocaleDateString()}</p>
                            </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                            <div className="flex items-center">
                                <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">{course.credits}</p>
                            </div>
                            </td>

                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div>
                                <button class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80" onClick={() => handleEditClick(course.CourseCode, course.CourseTitle,course.CourseDropDeadline)}>
    Drop
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
            <Link href={`/student?studentID=${studentID}`}>
            <div class="flex">
              <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">DashBoard</button>
            </div>
            </Link>
          </div>
        </section>

    </div>
    </div>
  );
}
export default DropCourse;
