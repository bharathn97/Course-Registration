import React,{useState,useEffect} from "react";
import {useRouter} from "next/router"
const Slug = () => {
  const router=useRouter();
  //Check if the token exists in the local storage
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
  const {StudentID}=router.query;
  const [courseGrades,setCourseGrades]=useState([]);
  const [CourseTitle,setCourseTitle]=useState(null);
  const [gradesStructure, setGradesStructure] = useState([
  { examName: "", maxMarks: 0, weightage: 0, marksObtained: 0 }
]);
//To fetch the ocurse grades whose identifier is the studentID if there are couregrades iwth student ID then display them
useEffect(() => {
const fetchCourses = async () => {
  try {
    if (StudentID && slug) {
      const response = await fetch(`/api/onecourse?CourseCode=${slug}`);
      const data = await response.json();
      setCourseTitle(data.CourseTitle);
      //Get all the course grades iwth the student ID as the identifier
      const studentGrades = data.courseGrade.filter(grade => grade.studentID === StudentID);

      if (studentGrades.length> 0) {
        // If data is found, set gradesStructure to the data with that studentID
        const gradeStructure = studentGrades.flatMap(grade => grade.grade.map(exam => ({
          examName: exam.examName,
          maxMarks: exam.maxMarks,
          weightage: exam.weightage,
          marksObtained: parseFloat(exam.marksObtained),
          marksScaled: parseFloat(((parseFloat(exam.marksObtained)/parseFloat(exam.maxMarks)) * parseFloat(exam.weightage))),
        })));
        const uniqueGradesStructure = removeDuplicateExams(gradeStructure);
        //Get only the unique ones not th erepreated one
       setGradesStructure(uniqueGradesStructure);
      } else {
        // If no data is found, set gradesStructure with default values or null
        const filteredGrades = data.courseGrade.filter(grade => grade.studentID === null);
        const gradeStructure = filteredGrades.flatMap(grade => grade.grade.map(exam => ({
          examName: exam.examName,
          maxMarks: exam.maxMarks,
          weightage: exam.weightage,
          marksObtained: parseFloat(exam.marksObtained),
          marksScaled:null,
        })));
        const uniqueGradesStructure = removeDuplicateExams(gradeStructure);
        setGradesStructure(uniqueGradesStructure);
      }
      console.log(gradesStructure);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

  fetchCourses();
}, [StudentID,slug]);
//To handle repreated course exam grades
const removeDuplicateExams = (grades) => {
    const uniqueExams = [];
    const seenExams = new Set();

    for (const exam of grades) {
      if (!seenExams.has(exam.examName)) {
        uniqueExams.push(exam);
        seenExams.add(exam.examName);
      }
    }

    return uniqueExams;
  };
  //To calcualte the total marks obtained
  const calculateTotals = () => {
    let totalMaxMarks = 0;
    let totalWeightage = 0;
    let totalMarksObtained = 0;
    let totalMarksScaled = 0;

    gradesStructure.forEach(exam => {
      totalMaxMarks += exam.maxMarks;
      totalWeightage += exam.weightage;
      totalMarksObtained += exam.marksObtained || 0; // Use 0 if marksObtained is null
      totalMarksScaled += exam.marksScaled || 0; // Use 0 if marksScaled is null
    });

    return {
      totalMaxMarks,
      totalWeightage,
      totalMarksObtained,
      totalMarksScaled,
    };
  };
  const totals = calculateTotals();
  return (
    <div>
    <section className="container px-4 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between text-center">
        <h1 className="text-lg font-medium text-gray-800 dark:text-black">
          {slug}-{CourseTitle}
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
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Marks Scaled
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {gradesStructure && gradesStructure.map((exam, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-lg font-medium text-gray-700 whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <div>
                              <h1 className="font-normal text-gray-800 dark:text-white ">
                                {exam && exam.examName}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-lg font-normal text-gray-100 whitespace-nowrap">
                        {exam && exam.maxMarks}
                      </td>
                      <td className="px-4 py-4 text-lg text-gray-100 dark:text-gray-300 whitespace-nowrap">
                        {exam && exam.weightage}%
                      </td>
                      <td className="px-4 py-4 text-lg text-gray-100 dark:text-gray-100 whitespace-nowrap">
                            {exam && exam.marksObtained}
                        </td>
                        <td className="px-4 py-4 text-lg text-gray-100 dark:text-gray-100 whitespace-nowrap">
                              {exam && exam.marksScaled}
                          </td>
                    </tr>
                  ))}
                  <tr>
                <td className="px-4 py-4 text-lg font-medium text-gray-700 whitespace-nowrap">
                  <div className="inline-flex items-center gap-x-3">
                    <div className="flex items-center gap-x-2">
                      <div>
                        <h1 className="font-bold text-gray-600 dark:text-white ">
                          Total
                        </h1>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-4 text-lg font-bold text-gray-600 whitespace-nowrap">
                  {totals.totalMaxMarks}
                </td>
                <td className="px-4 py-4 text-lg font-bold text-gray-100 dark:text-gray-600 whitespace-nowrap">
                  {totals.totalWeightage}%
                </td>
                <td className="px-4 py-4 text-lg font-bold text-gray-100 dark:text-gray-600 whitespace-nowrap">
                  {totals.totalMarksObtained}
                </td>
                <td className="px-4 py-4 text-lg font-bold text-gray-100 dark:text-gray-600 whitespace-nowrap">
                  {totals.totalMarksScaled}
                </td>
              </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </section>
    </div>
  );
};

export default Slug;
