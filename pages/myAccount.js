import React, { useEffect, useState } from 'react';
import connectDb from '../middleware/mongoose';
import Student from '../models/Student';
import Link from "next/link"
import { useRouter } from 'next/router';
const MyAccount = () => {
  const [studentData, setStudentData] = useState(null);
//To store the student details
  const router = useRouter();
//Check whether there is token in local Storage if not redirect to home page
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

const { studentID } = router.query;
//To fetch the studnet details using Student ID to identify the particular stundent
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (studentID) {
        const response = await fetch(`/api/studentdetails?StudentID=${studentID}`);
        const data = await response.json();
        setStudentData(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [studentID]);
//Wait until student ID is defined

  return (
    <div>
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-5 py-24 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">PROFILE DETAILS</h1>
              <div class="flex mb-4">
                <a class="flex-grow border-b-2 border-gray-300 py-2 text-lg text-center px-1">Details</a>
              </div>

              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Name</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.name}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Email</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.email}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Student ID</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.studentID}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Program Type</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.programType}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Semester</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.sem}</span>
              </div>
              <div class="flex border-t border-b border-gray-200 py-2">
                <span class="text-gray-500">Department</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.department}</span>
              </div>
              <div class="flex border-t border-b border-gray-200 py-2">
                <span class="text-gray-500">Total Credits</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.TotalCredits}</span>
              </div>
              <div class="flex border-t border-b border-gray-200 py-2">
                <span class="text-gray-500">CGPA</span>
                <span class="ml-auto text-gray-900">{studentData && studentData.CGPA}</span>
              </div>
              <Link href={`/student?studentID=${studentID}`}>
              <div class="flex">
                <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">DashBoard</button>
              </div>
              </Link>
            </div>
            <img alt="ecommerce" class="lg:w-1/2  lg:h-auto h-32 object-cover object-center rounded" src="https://dummyimage.com/400x400" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyAccount;
