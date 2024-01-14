import React,{useEffect,useState} from "react";
import {useRouter}  from "next/router"
import Link from "next/link"

const TimeTableFaculty=()=>{
  const router=useRouter();
  //To check if the token is there in local storage if yes allow else redirect to homepage
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
  //To store all the courses slots that are assigned to the particular faculty identified by the staff ID
  const [branch,setBranch]=useState("");
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (ID) {
        const response = await fetch(`/api/facultydetails?FacultyID=${ID}`);
        const data = await response.json();
        setBranch(data.department);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [ID]);
//To get all the faculty details
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (ID && branch) {
        const response = await fetch(`/api/allcoursesfaculty?instructor=${ID}`);
        const data = await response.json();
        const constructedData = data.map(course => {
             return {
               CourseCode: course.CourseCode,
               CreatedSlots: course.CreatedSlots,
             };
           });
           setSlots(constructedData);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [ID,branch]);
//Creating an 2d object where each element in the Course Code along with the assigned slots in slots arrays
const [timetableData, setTimeTableData] = useState({
  Mon: {},
  Tue: {},
  Wed: {},
  Thu: {},
  Fri: {},
});
//Initial time table
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
//A 2d object with each element defined by the day and time slot
slots.forEach((course) => {
  course.CreatedSlots.forEach((slot) => {
    slot.LectureSlots.forEach((lecture) => {
      if (!updatedTimetableData[lecture.day]) {
        updatedTimetableData[lecture.day] = {};
      }
      if (!updatedTimetableData[lecture.day][lecture.time]) {
        updatedTimetableData[lecture.day][lecture.time] = [];  //Coverting each element in the 2d objecr to another array to store multiple course codes even if the slots are coinciding
      }
      updatedTimetableData[lecture.day][lecture.time].push({
        code: course.CourseCode,                                                //Constructing the Time table
        conflict: updatedTimetableData[lecture.day][lecture.time].length > 0,
      });
    });
    slot.PracticalSlots.forEach((practical) => {
      if (!updatedTimetableData[practical.day]) {
        updatedTimetableData[practical.day] = {};
      }
      if (!updatedTimetableData[practical.day][practical.time]) {
        updatedTimetableData[practical.day][practical.time] = [];
      }
      updatedTimetableData[practical.day][practical.time].push({
        code: course.CourseCode,
        conflict: updatedTimetableData[practical.day][practical.time].length > 0,
      });
    });
  });
});
//To disaply the course codes in particular slot even if they are coinciding
      setTimeout(() => {
        setTimeTableData(updatedTimetableData);
      }, 100);
    }
  } catch (error) {
    console.log(error);
    console.log("Error in updating the time table");
  }
}, [slots]);
//Wait until the slots array with differnet courses are defined and then construct the time table


  return (
    <div>
      <section className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-black">
          My Time Table
        </h1>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-black">
          {branch}
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
                            {Object.keys(timetableData).map((day) => (
  <tr key={day} className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">
    <td class="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200">{day}</td>
    {['8-9', '9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4', '4-5'].map((timeSlot) => (
      <td key={timeSlot} className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap border border-gray-200">
        {timetableData[day][timeSlot]?.map((course, index) => (
          <div key={index} style={{ color: course.conflict ? 'red' : 'green' }}>
            {course.code}
          </div>
        ))}
      </td>
    ))}
  </tr>
))}

                                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Link href={`/faculty?staffID=${ID}`}>
        <div class="flex">
          <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">DashBoard</button>
        </div>
        </Link>
      </section>
    </div>)
}

export default TimeTableFaculty;
