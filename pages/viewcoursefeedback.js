import React from "react";
import {useState,useEffect} from "react";
import { useRouter } from 'next/router';
const ViewCourseFeedBack=()=>{
  const [initialData,setInitialData]=useState([]);
  const [courseData,setCourseData]=useState([]);
  const router = useRouter();
  //To check if the token exists if not redirect to home page
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
//Get all the course feed back forms of all the courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/allcoursesfeedbackforms");
        const data = await response.json();
        setCourseData(data);
        setInitialData(data.courseFeedback);
      } catch (error) {
        console.error("Error fetching the instructor courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return(
    <div>
    <section className="container px-6 w-70" style={{ height: '400px' }}>
    <div className="mt-6 md:flex md:items-center md:justify-between">
    <div className="relative flex items-center mt-4 md:mt-0">
        <span className="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </span>

        <input type="text" placeholder="Search" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
    </div>
    </div>
      <div className="flex flex-col mt-6">
        {courseData.map((course) => (//Go through each course and create a table for each course
          <div key={course.CourseCode} className="mt-6">
          <h1 className="text-lg font-bold text-black">{course.CourseCode}</h1>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-black">
            {course.CourseTitle} - {course.credits} Credits - {course.instructor}
            </h2>
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                <th
                  scope="col"
                  className="px-1 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                   Student ID
                </th>
                  <th
                    scope="col"
                    className="px-1 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                     instructorAvailability
                  </th>
                  <th scope="col" className="px-1 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  realWorldExamples
                              </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                              relevantCourseContent
                                          </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  engagingActivities
                              </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  fairAssessmentMethods
                              </th>
                              <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                  overallSatisfaction
                              </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                  {course.courseFeedback.map((student) => (//Go through teh course feedback array of each course where each object consists of 2 fields one studnet ID and the other is teh feedback
                    <tr key={student.studentID}>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                        <div>
                          <h2 className="font-medium text-gray-800 dark:text-white">
                            {student.studentID}
                          </h2>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.instructorAvailability) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:                               //Check the value of the particualr quetion of the particular studnet and if 5 display Agree
                                    return "Disagree";                  //4 means agree and so on
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.realWorldExamples) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:
                                    return "Disagree";
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.relevantCourseContent) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:
                                    return "Disagree";
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.engagingActivities) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:
                                    return "Disagree";
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.fairAssessmentMethods) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:
                                    return "Disagree";
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                          <div>
                            <h4 className="text-gray-700 dark:text-gray-200">
                              {(() => {
                                switch (student.feedback.overallSatisfaction) {
                                  case 1:
                                    return "Strongly Disagree";
                                  case 2:
                                    return "Disagree";
                                  case 3:
                                    return "Neutral";
                                  case 4:
                                    return "Agree";
                                  case 5:
                                    return "Strongly Agree";
                                  default:
                                    return "";
                                }
                              })()}
                            </h4>
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>

    </div>
  );
}

export default ViewCourseFeedBack;
