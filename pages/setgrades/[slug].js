import React,{useState,useEffect} from "react";
import {useRouter} from "next/router"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Slug = () => {
  const router=useRouter();
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
  const {slug}=router.query;
  const {CourseCode}=router.query;
  const [courseGrades,setCourseGrades]=useState([]);
  const [CourseTitle,setCourseTitle]=useState(null);
  const [gradesStructure, setGradesStructure] = useState([
  { examName: "", maxMarks: 0, weightage: 0, marksObtained: 0 }
]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue,setInputValue]=useState(false);
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (CourseCode && slug) {
        const response = await fetch(`/api/onecourse?CourseCode=${CourseCode}`);
        const data = await response.json();
        setCourseTitle(data.CourseTitle);
        const studentGrades = data.courseGrade.filter(grade => grade.studentID === slug);

        if (studentGrades.length > 0) {
          // If data is found, set gradesStructure to the data with that studentID
          const gradesStructure = studentGrades.flatMap(grade => grade.grade.map(exam => ({
            examName: exam.examName,
            maxMarks: exam.maxMarks,
            weightage: exam.weightage,
            marksObtained: exam.marksObtained,
          })));
          const filteredGrades = data.courseGrade.filter(grade => grade.studentID === null);
          filteredGrades.forEach(grade => {
            grade.grade.forEach(exam => {
              if (!gradesStructure.some(existingExam => existingExam.examName === exam.examName)) {
                gradesStructure.push({
                  examName: exam.examName,
                  maxMarks: exam.maxMarks,
                  weightage: exam.weightage,
                  marksObtained: exam.marksObtained,
                });
              }
            });
          });
          setGradesStructure(gradesStructure);
        } else {
          // If no data is found, set gradesStructure with default values or null
          const filteredGrades = data.courseGrade.filter(grade => grade.studentID === null);
          const gradesStructure = filteredGrades.flatMap(grade => grade.grade.map(exam => ({
            examName: exam.examName,
            maxMarks: exam.maxMarks,
            weightage: exam.weightage,
            marksObtained: exam.marksObtained,
          })));
          setGradesStructure(gradesStructure);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [CourseCode,slug]);
const [email,setEmail]=useState("");
useEffect(() => {
const fetchStudent = async () => {
  try {
    if (slug) {
      const response = await fetch(`/api/studentdetails?StudentID=${slug}`);
      const data = await response.json();
      setEmail(data.email);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

fetchStudent();
}, [slug]);
const handleGradeChange = (index, key, value) => {
  // Update the local state when a grade is edited
  const updatedGradesStructure = [...gradesStructure];
  updatedGradesStructure[index][key] = parseFloat(value);
  setGradesStructure(updatedGradesStructure);
};

const handleSubmit = async () => {
  try {
    const isConfirmed = window.confirm("Are you sure you want to set the marks?");
    if (!isConfirmed) {
      // User clicked Cancel, do nothing
      return;
    }

    const updatedGradesStructure = gradesStructure.map(exam => ({
      ...exam,
      marksObtained: parseFloat(exam.marksObtained),
      maxMarks:parseFloat(exam.maxMarks)
    }));

    // Check if marks obtained are less than max marks
    const isValidData = updatedGradesStructure.every(exam => exam.marksObtained <= exam.maxMarks);

    if (!isValidData) {
      alert("Invalid data. Marks obtained cannot exceed maximum marks.");
      return;
    }
    const response = await fetch(`/api/addstudentgrades?StudentID=${slug}&CourseCode=${CourseCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedGradesStructure
      }),
    });

    if (response.ok) {
      toast.success(`Course Grade Marks for student ${slug} has been updated!`, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      console.log("The email of the recpeient is"+email);
      const emailData = {
      to: email, // replace with the recipient's email
      subject: `Marks Updation for the course ${CourseCode}`,
      text: `Marks Updation or Marks Upload has been done for:${CourseCode} - ${CourseTitle}`,
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

      setIsSubmitted(true);
      console.log("Grades submitted successfully");
    } else {
      // Handle errors
      console.error("Error submitting grades:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error submitting grades:", error);
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
    <section className="container px-4 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between text-center">
        <h1 className="text-lg font-medium text-gray-800 dark:text-black">
          {CourseCode}-{CourseTitle}
        </h1>
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
                      className="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center gap-x-3">
                        Exam Name
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-12 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Maximum Marks
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Weightage
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Marks Obtained
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {gradesStructure.map((exam, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-lg font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <div>
                              <h1 className="font-normal text-gray-800 dark:text-white ">
                                {exam.examName}
                              </h1>

                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-lg font-normal text-gray-100 whitespace-nowrap">
                        {exam.maxMarks}
                      </td>
                      <td className="px-4 py-4 text-lg text-gray-100 dark:text-gray-300 whitespace-nowrap">
                        {exam.weightage}%
                      </td>
                      <td className="px-2 py-4 text-lg text-gray-100 dark:text-gray-900 whitespace-nowrap">
                            <input
                              type="number"
                              value={exam.marksObtained}
                              onChange={(e) => handleGradeChange(index, "marksObtained", e.target.value)}
                            />
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit" onClick={handleSubmit} disabled={isSubmitted} className="rounded-md bg-indigo-600 px-5 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SUBMIT THE GRADES OF THE STUDENT</button>
      </div>
    </section>
    </div>
  );
};

export default Slug;
