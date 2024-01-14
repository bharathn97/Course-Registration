import React,{useEffect} from "react";
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link"
const CourseCart = () => {
  const router = useRouter();
  //To check if the token exists or not if not redirect to homepgae
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
  const { enrolledCourses } = router.query;
  const { studentID }=router.query;
  let parsedEnrolledCourses = [];
  //Try to get the enrolled courses trhough the query parameter first convert to javascript object
  try {
    if (enrolledCourses) {
      parsedEnrolledCourses = JSON.parse(enrolledCourses);
    }
  } catch (error) {
    console.error("Error parsing enrolledCourses:", error);
  }
  //Get the unique courses only like it could have been that the same course could be clicked twice so to handle that
  const uniqueEnrolledCourses = Array.from(new Set(parsedEnrolledCourses.map(course => course.CourseCode)))
   .map(CourseCode => parsedEnrolledCourses.find(course => course.CourseCode === CourseCode));

//To remove the course from course cart if not required
  const handleRemove = (course) => {
    const indexToRemove = parsedEnrolledCourses.findIndex((c) => c.CourseCode === course.CourseCode);

    if (indexToRemove !== -1) {
      const updatedCourses = [
        ...parsedEnrolledCourses.slice(0, indexToRemove),
        ...parsedEnrolledCourses.slice(indexToRemove + 1),
      ];
      //Need to update the query since that particular course no longer exists
      const updatedQuery = updatedCourses.length > 0 ? JSON.stringify(updatedCourses) : undefined;
      router.push(`/coursecart?enrolledCourses=${encodeURIComponent(updatedQuery)}`);
    }
  };
  //Go back to the previous page basically undo any changes like rmeoving a particualr course
  const handleCancel = () => {
    // Go back to the previous page
    router.back();
  };
  //To finally submit the courses u want to enrool which would be stored as assignedStudnet the studnetID of the studnet who submitted
  const handleSubmit = async () => {
  try {
    if (!studentID) {
      console.error("Missing studentID");
      return;
    }

    const courseCodes = uniqueEnrolledCourses.map(course => course.CourseCode);

    // Check if courseCodes is empty
    if (courseCodes.length === 0) {
      console.error("No courses to submit");
      return;
    }

    // Display a confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to submit the selected courses?");

    if (isConfirmed) {
      // If confirmed, make the API request
      await fetch(`/api/enrollstudentcourse?studentID=${studentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCodes }),
      });
      toast.success('You have submitted the courses you want to enroll!', {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      router.push('/coursecart');
      //To remove all the queries as once finally submitted
    } else {
      // If not confirmed, do nothing or show a message
      console.log("Submission canceled by the student");
    }
  } catch (error) {
    console.error("Error submitting courses:", error);
  }
};


  return (
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
      <div className="min-w-full" style={{ height: '600px' }}>
        <section className="container px-6 w-full">
          <div className="mt-6 md:flex md:items-center md:justify-between">
           <  div className = "inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700" >
    <  button className = "px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300" >  Courses Applied <  /button> < /  div >

    <
    div className = "relative flex items-center mt-4 md:mt-0" >
    <
    span className = "absolute" >
    <
    svg xmlns = "http://www.w3.org/2000/svg"
    fill = "none"
    viewBox = "0 0 24 24"
    strokeWidth = "1.5"
    stroke = "currentColor"
    className = "w-5 h-5 mx-3 text-gray-400 dark:text-gray-600" >
    <  path strokeLinecap = "round"  strokeLinejoin = "round"  d = "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" / >
    <  /svg> < /  span >
    <input type = "text"  placeholder = "Search"  className = "block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" / >
    <
    /div>
          </div>

          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <
    th scope = "col"
    className = "py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >
    <
    button className = "flex items-center gap-x-3 focus:outline-none" >
    <
    span > Course Code < /span>
 < /
    button > </th>

    <
    th scope = "col"
    className = "px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >
    Course Title <
    /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >
    Description <
    /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" > Instructor < /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" > Course Type < /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" > Course Registration Deadline < /th>


    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >Credits < /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >Instructor < /th>

    <
    th scope = "col"
    className = "px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400" >Remove< /th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {uniqueEnrolledCourses.map((course, index) => (
                        <tr key={index}>
                          <
    td className = "px-4 py-4 text-sm font-medium whitespace-nowrap" >
    <
    div >
    <
    h2 className = "font-medium text-gray-800 dark:text-white " > {course.CourseCode}< /h2> < /
    div > <
    /td> <
    td className = "px-12 py-4 text-sm font-medium whitespace-nowrap" >
    <
    div className = "inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800" >
    {course.CourseTitle} <
    /div> < /
    td > <
    td className = "px-4 py-4 text-sm whitespace-nowrap" >
    <
    div >
    <
    h4 className = "text-gray-700 dark:text-gray-200" > {course.description} < /h4>  < /
    div > <
    /td> <
    td className = "px-10 py-4 text-sm whitespace-nowrap" >
    <  div className = "flex items-center" >
    <p className = "flex items-center justify-center w-6 h-6 -mx-1 text-white" > {course.instructor} < /p> < /
    div > <
    /td>
    <td className = "px-10 py-4 text-sm whitespace-nowrap" >
    <  div className = "flex items-center" >
    <p className = "flex items-center justify-center w-6 h-6 -mx-1 text-white" > {course.CourseType} < /p> < /
    div > <
    /td>
    <td className = "px-10 py-4 text-sm whitespace-nowrap" >
    <  div className = "flex items-center" >
    <p className = "flex items-center justify-center w-6 h-6 -mx-1 text-white" > {new Date(course.CourseRegDeadline).toLocaleDateString()} < /p> < /
    div > <
    /td>
    <
   td className = "px-8 py-4 text-sm whitespace-nowrap" >
   <  div className = "flex items-center" >
   <p className = "flex items-center justify-center w-6 h-6 -mx-1 text-white " > {course.credits} < /p> < /
   div > <
   /td>
   <
  td className = "px-5 py-4 text-sm whitespace-nowrap" >
  <  div className = "flex items-center" >
  <p className = "flex items-center justify-center w-6 h-6 -mx-1 text-white" > {course.instructor} < /p> < /
  div > <
  /td>
  <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
      <div>
      <button onClick={() => handleRemove(course)} class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
Remove
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
          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" onClick={handleCancel} class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancel</button>
            <button type="submit" onClick={handleSubmit} class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SAVE AND SUBMIT TO ADMIN</button>
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
};

export default CourseCart;
