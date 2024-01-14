import React,{useEffect,useState} from "react";
import {useRouter}  from "next/router"
import Link from "next/link"


const TimeTableStudent=()=>{
  const router=useRouter();
  //To check whether the token exists in the local storage i fnot redirect to home page
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
  const {ID}=router.query;
  const [slots,setSlots]=useState([]);
  const [branch,setBranch]=useState("");
  const [degree,setDegree]=useState("");
  //Initial value of the degree and branch the student belongs to and the slots array to store all the slots
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (ID) {
        const response = await fetch(`/api/studentdetails?StudentID=${ID}`);
        const data = await response.json();
        setDegree(data.programType);
        setBranch(data.department);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [ID]);
//To get the student details
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (ID && branch && degree) {
        const response = await fetch(`/api/allcoursesfilterstudent?StudentID=${ID}`);
        const data = await response.json();
        const constructedData = data.map(course => {
             const createdSlots = course.CreatedSlots.filter(slot => {
               return slot.prerequisitesDegree === degree && slot.prerequisitesBranch === branch;
             });

             return {
               CourseCode: course.CourseCode,
               CreatedSlots: createdSlots,
             };
           });

           setSlots(constructedData);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [ID,branch,degree]);
//Getting only those courses and storing in the slots array whose enrolled students has the student ID and also get the slots only for the particular degree and branch
const[timetableData,setTimeTableData]=useState([]);
//Initial data of the time table
useEffect(() => {
  try {
    if (slots) {
      console.log(slots);
      const updatedTimetableData = {
        Mon: {},
        Tue: {},
        Wed: {},
        Thu: {},
        Fri: {},
      };

      slots.forEach(course => {
        course.CreatedSlots.forEach(slot=> {
          slot.LectureSlots.forEach(lecture=>{
            if (!updatedTimetableData[lecture.day]) {
              updatedTimetableData[lecture.day] = {};
            }
            updatedTimetableData[lecture.day][lecture.time] = course.CourseCode;
          })
          slot.PracticalSlots.forEach(practical=>{
            if (!updatedTimetableData[practical.day]) {
              updatedTimetableData[practical.day] = {};
            }
            updatedTimetableData[practical.day][practical.time] = course.CourseCode;
          })
      });
      });

      setTimeout(() => {
        setTimeTableData(updatedTimetableData);
      }, 100);
    }
  } catch (error) {
    console.log(error);
    console.log("Error in updating the time table");
  }
}, [slots]);

//Constructing the time table after the slots data is defined

  return (
    <div>
      <section className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-black">
          My Time Table
        </h1>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-black">
          {degree}-{branch}
        </h1>
        </div>
        <div class="flex flex-col mt-6">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" class="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        Day
                                    </th>
                                    <th scope="col" class="px-12 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        8-9 AM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        9-10 AM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        10-11 AM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        11-12 AM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        12-01 PM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        01-02 PM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        02-03 PM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        03-04 PM
                                    </th>
                                    <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200">
                                        04-05 PM
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                      {timetableData &&  Object.keys(timetableData).map(day => (
                                        <tr key={day} className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                          <td class="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200">{day}</td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                           style={{ color: timetableData[day]['8-9']  ? 'red' : 'green' }}>
                                           {timetableData[day]['8-9']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['9-10'] ? 'red' : 'green' }}>
                                            {timetableData[day]['9-10']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['10-11'] ? 'red' : 'green' }}>
                                            {timetableData[day]['10-11']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['11-12']? 'red' : 'green' }}>
                                            {timetableData[day]['11-12']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200">
                                              Lunch Break
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['1-2'] ? 'red' : 'green' }}>
                                            {timetableData[day]['1-2']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['2-3'] ? 'red' : 'green' }}>
                                            {timetableData[day]['2-3']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['3-4']  ? 'red' : 'green' }}>
                                            {timetableData[day]['3-4']}
                                          </td>
                                          <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200"
                                              style={{ color: timetableData[day]['4-5'] ? 'red' : 'green' }}>
                                            {timetableData[day]['4-5']}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Link href={`/student?studentID=${ID}`}>
        <div class="flex">
          <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">DashBoard</button>
        </div>
        </Link>
      </section>
    </div>)
}

export default TimeTableStudent;
