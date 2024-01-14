import React, { useState ,useEffect} from "react";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const Slug = () => {
  const router = useRouter();
  const { slug } = router.query;
  //Check is the token exixsts
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
  const [courseData, setCourseData] = useState({
    CourseCode: "",
    CourseTitle: "",
    instructor: "",
    description: "",
    prerequisitesDegree: [],
    prerequisitesBranch: [],
    NoLectures:null,
    NoPracticals:null,
    CourseRegDeadline:null,
    CourseDropDeadline:null,
    credits: null,
    CourseType:"",
    RequiredCredits:0,
    RequiredCGPA:0
});
//Initial Data structure of the entire course
const [initialCourseData, setInitialCourseData] = useState({
  CourseCode: "",
  CourseTitle: "",
  instructor: "",
  description: "",
  prerequisitesDegree: [],
  prerequisitesBranch: [],
  NoLectures:null,
  NoPracticals:null,
  CourseRegDeadline:null,
  CourseDropDeadline:null,
  credits: null,
  CourseType:"",
  RequiredCredits:0,
  RequiredCGPA:0
});
//Each prerequisiste data in created slots array
  const [prerequisitesData, setPrerequisiteData] = useState({
         prerequisitesDegree: "",
         prerequisitesBranch: "",
         LectureSlots: [],
         PracticalSlots:[]
       });
///Contains all the prerequisistes data
  const [prerequisites, setPrerequisites] = useState([]);

  const [timetableData,setTimeTableData]=useState({
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
    });
//The prerequisiste sleected by the user
    const [selectedPrerequisite, setSelectedPrerequisite] = useState({
     prerequisitesDegree: '',
    prerequisitesBranch: '',
  })

const [appliedStudents,setAppliedStudents]=useState([]);
const [enrolledStudents1,setEnrolledStudents1]=useState([]);
const [gradesStructure,setGradesStructure]=useState([]);
const [occupiedSlots,setOccupiedSlots]=useState([]);
//Fetch all the courses and get their created slots array whihc is required to check availabel slots
useEffect(() => {
const fetchCourses = async () => {
try {
  const response = await fetch("/api/allcourses");
  const data = await response.json();
  const createdSlots = data.map(course => course.CreatedSlots).flat();

  setOccupiedSlots(createdSlots);
} catch (error) {
  console.error("Error fetching courses:", error);
}
};

fetchCourses();
}, []);


//The data structure of an exam grade
const [examData, setExamData] = useState({
  examName: "",
  maxMarks: "",
  weightage: "",
});


//To store all the exam datas
const [exams, setExams] = useState([]);
const handleAddExam = () => {
setExams([...exams, examData]);
setExamData({ examName: "", maxMarks: "", weightage: "" });
};

//Function to add a new cours exams
const handleRemoveExam = (index) => {
const updatedExams = [...exams];
updatedExams.splice(index, 1);
setExams(updatedExams);
};
//Function to remove a course from the course exam grades
const [faculty,setFaculty]=useState("");
//To get the one particular course that needs to updated


useEffect(() => {
const fetchCourses = async () => {
  try {
    if (slug) {
      const response = await fetch(`/api/onecourse?CourseCode=${slug}`);
      const data = await response.json();
      setCourseData(data);
      setInitialCourseData(data);
      setAppliedStudents(data.appliedStudents);
      setEnrolledStudents1(data.enrolledStudents);
      setPrerequisites(data.CreatedSlots);
      setFaculty(data.instructor);
      const filteredGrades = data.courseGrade.filter(grade => grade.studentID === null);
      const gradesStructure = filteredGrades.flatMap(grade => grade.grade.map(exam => ({
        examName: exam.examName,
        maxMarks: exam.maxMarks,
        weightage: exam.weightage,
        marksObtained: exam.marksObtained,
      })));
      setGradesStructure(gradesStructure);
      setExams(gradesStructure);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

fetchCourses();
}, [slug]);
//To handle the slecetd credits
  const handleCreditsChange = (event) => {
    const selectedCredits = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      credits: selectedCredits,
    }));
  };

  //To handle Number of lectures chosen
    const handleNoLecturesChange = (event) => {
      const selectedLectures = event.target.value;
      setCourseData((prevData) => ({
        ...prevData,
        NoLectures: selectedLectures,
      }));
    };

    //To handle Number of Practicals chosen
    const handleNoPracticalsChange = (event) => {
      const selectedPracticals = event.target.value;
      setCourseData((prevData) => ({
        ...prevData,
        NoPracticals: selectedPracticals,
      }));
    };

    //To handle the course type to be chosen
    const handleCourseTypeChange = (event) => {
      const selectedCourseType = event.target.value;
      setCourseData((prevData) => ({
        ...prevData,
        CourseType: selectedCourseType,
      }));
    };

    //To Handle all other input changes doen
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  //To handel the required CGPA change
  const handleCGPAChange = (event) => {
    const CGPA = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      RequiredCGPA: CGPA,
    }));
  };
  const [facultyIDs,setFaculties]=useState([]);
  //To get all the faculties which would be required while setting or changing a particualr faculty


  useEffect(() => {
  const fetchCourses = async () => {
  try {
    const response = await fetch("/api/allfaculties");
    const data = await response.json();
    const facultyIDs = data.map(faculty => faculty.staffID).flat();
    setFaculties(facultyIDs);
  } catch (error) {
    console.error("Error fetching faculties:", error);
  }
  };

  fetchCourses();
  }, []);



  //First chaecks whether the input faculty iD exist sor not then check sthe uniqueness of teh course code
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!facultyIDs.includes(courseData.instructor)) {
  alert('Invalid faculty ID. Please select a valid faculty.');
  setCourseData((prevCourseData) => ({
...prevCourseData,
instructor: "",
}));
  return;
}
//Check whether teh course exams set doesnt exceeds a weightage oof 100
    exams.forEach(exam => {
  exam.maxMarks = parseInt(exam.maxMarks, 10);
  exam.weightage = parseInt(exam.weightage, 10);
});
    const totalWeight = exams.reduce((sum, exam) => sum + exam.weightage, 0);
    if (totalWeight > 100) {
     setExams(gradesStructure);
    toast.error('Total weightage of exams cannot exceed 100!', {
   position: "top-center",
   autoClose: 2000,
   hideProgressBar: true,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   progress: undefined,
   theme: "light",
    });
    return;
  }
  //Askin whether teh user is sure about the changes
  const shouldUpdate = window.confirm('Do you want to update the course details?');
  if (!shouldUpdate) {
    return;
   }
   const Prerequisites = prerequisites.map(({ prerequisitesDegree, prerequisitesBranch }) => ({
     prerequisitesDegree,
     prerequisitesBranch,
   }));
   //To get the prerequiste dgeree and branch only to an array
   const simplifiedPrerequisites = prerequisites.map(({ prerequisitesDegree, prerequisitesBranch, LectureSlots, PracticalSlots }) => ({
     prerequisitesDegree,
     prerequisitesBranch,
     LectureSlots,
     PracticalSlots,
   }));
//To reallocate the courses between the faculties if the instructor is changed
   if(courseData.instructor!==faculty)
   {
     console.log("The old faculty is"+faculty);
     console.log("The new faculty is"+courseData.instructor);
     const res7 = await fetch(`/api/assigncoursetofaculty?FacultyID=${courseData.instructor}&CourseCode=${slug}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({}),
     });
     const res8 = await fetch(`/api/removecoursefaculty?StaffID=${faculty}&CourseCode=${slug}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({}),
     });
   }
   //Senidng teh udpated data
    let data={ ...courseData,exams ,CreatedSlots: simplifiedPrerequisites,prerequisites:Prerequisites};
    try {
      const res = await fetch(`/api/updatecourse?CourseCode=${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error updating course:", errorResponse.error);
        return;
      }
      const response = await res.json();
      if (response.success) {
        console.log("Course successfully updated!");
        const updatedRes = await fetch(`/api/onecourse?CourseCode=${response.data.CourseCode}`);
        const updatedData = await updatedRes.json();
        setCourseData(updatedData);
        router.push(`/course_admin/${response.data.CourseCode}`);
        toast.success(`${response.data.CourseCode} Updated!`, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      } else {
        console.error("Error updating course:", response.error);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

//To undo all the changes
 const handleCancel = () => {
   setCourseData(initialCourseData);
   };


   //To handle the requested students and the enrolled students
  const [requestedStudents, setRequestedStudents] = useState([]);
  const [initialRequestedStudents, setInitialRequestedStudents] = useState([]);
  const [initialEnrolledStudents, setInitialEnrolledStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch details for all students in parallel
        const studentsData = await Promise.all(
          appliedStudents.map(async (studentID) => {
            const response = await fetch(`/api/studentdetailscourse?StudentID=${studentID}`);
            return response.json();
          })
        );
        const studentsData1 = await Promise.all(
          enrolledStudents1.map(async (studentID) => {
            const response1 = await fetch(`/api/studentdetailscourse?StudentID=${studentID}`);
            return response1.json();
          })
        );

        // Now studentsData is an array of details for each student
        setRequestedStudents(studentsData);
        setEnrolledStudents(studentsData1);
        setInitialRequestedStudents(studentsData);
        setInitialEnrolledStudents(studentsData1);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [appliedStudents,enrolledStudents1]);

    const handleEnroll = (student) => {
      // Move the student from requested to enrolled
      setEnrolledStudents([...enrolledStudents, student]);
      setRequestedStudents(requestedStudents.filter((s) => s.id !== student.id));
    };

    const handleCancel1 = () => {
      setRequestedStudents(initialRequestedStudents);
      setEnrolledStudents(initialEnrolledStudents);
      };

      const [updatedappliedStudents,setupdatedAppliedStudents]=useState([]);
      const [updatedenrolledStudents,setupdatedEnrolledStudents]=useState([]);

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    // Display a confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to make these changes?");

    // If the user confirms, proceed with the changes
    if (isConfirmed) {
    const enrolledStudentIDs = enrolledStudents.map((student) => student.studentID);
     const appliedStudentIDs = requestedStudents.map((student) => student.studentID);
     console.log(enrolledStudentIDs);
     console.log(appliedStudentIDs);
      try {
        // Collect student IDs to update appliedStudents and enrolledStudents arrays
        // Iterate over the enrolled students
        for (const student of enrolledStudents) {
          const { studentID } = student;

          // Make a PUT request for each enrolled student
          const res = await fetch(
            `/api/enrollstudenttocourse?StudentID=${studentID}&CourseCode=${slug}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            // Handle non-successful status codes
            const errorResponse = await res.json();
            console.error("Error enrolling student:", errorResponse.error);
            // You may want to set an error state or display a notification to the user
            return;
          }

          const response = await res.json();
        }

        // Update appliedStudents and enrolledStudents arrays
        const updateRes = await fetch(`/api/appliedenrollment?CourseCode=${slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enrolledStudentIDs,appliedStudentIDs}),
        });

        if (!updateRes.ok) {
          // Handle non-successful status codes for updating appliedStudents and enrolledStudents
          const errorResponse = await updateRes.json();
          console.error("Error updating appliedStudents and enrolledStudents:", errorResponse.error);
          // You may want to set an error state or display a notification to the user
          return;
        }


        for (const student of enrolledStudents) {
          const { email } = student;
          console.log("The email of the recpeient is"+email);
          const emailData = {
          to: email,
          subject: `Enrollment to Course${slug}`,
          text: `You have been successfully enrolled to the course: ${slug} - ${courseData.CourseTitle}
          The Course Registration Deadline is ${courseData.CourseRegDeadline} and The Course Drop Deadline is ${courseData.CourseDropDeadline}`,
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
        };


        const updateResponse = await updateRes.json();
        setupdatedAppliedStudents(updateResponse.data.appliedStudents);
        setupdatedEnrolledStudents(updateResponse.data.enrolledStudents);

        // All students have been successfully enrolled
        console.log("All students enrolled successfully!");
      } catch (error) {
        console.error("Error enrolling students:", error);
      }
    } else {
      // If the user cancels the confirmation, you can choose to do nothing or show a message
      console.log("Enrollment canceled by the user");
    }
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch details for all students in parallel
        const studentsData = await Promise.all(
          updatedappliedStudents.map(async (studentID) => {
            const response = await fetch(`/api/studentdetailscourse?StudentID=${studentID}`);
            return response.json();
          })
        );
        const studentsData1 = await Promise.all(
          updatedenrolledStudents.map(async (studentID) => {
            const response1 = await fetch(`/api/studentdetailscourse?StudentID=${studentID}`);
            return response1.json();
          })
        );

        // Now studentsData is an array of details for each student
        setRequestedStudents(studentsData);
        setEnrolledStudents(studentsData1);
        setInitialRequestedStudents(studentsData);
        setInitialEnrolledStudents(studentsData1);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, [updatedappliedStudents,updatedenrolledStudents]);

  const handleE = (studentID,CourseCode) => {
    // Redirect to the specified URL
    router.push(`/setgrades/${studentID}?CourseCode=${CourseCode}`);
  };


  //To geenerate time table whenever athe suer chooses a new prerequisste and the degree
    const generateTimetable = () => {
    const filteredSlots = occupiedSlots.filter(slot =>
      slot.prerequisitesDegree === selectedPrerequisite.prerequisitesDegree &&
      slot.prerequisitesBranch === selectedPrerequisite.prerequisitesBranch
    )
    const updatedTimetableData = {
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
    };
    filteredSlots.forEach(slot => {
      slot.LectureSlots.forEach(lecture => {
        if (!updatedTimetableData[lecture.day]) {
          updatedTimetableData[lecture.day] = {};
        }
        updatedTimetableData[lecture.day][lecture.time] = 'Occupied';
      });
      slot.PracticalSlots.forEach(practical => {
        if (!updatedTimetableData[practical.day]) {
          updatedTimetableData[practical.day] = {};
        }
        updatedTimetableData[practical.day][practical.time] = 'Occupied';
      });
    });
    setTimeout(() => {
      setTimeTableData(updatedTimetableData);
    }, 100);
  };



//To cehck whether there is any conflict with other slots occupied if yes then allow updated time table else show errro
  const CheckTimeTable = (prerequisite) => {
    console.log(prerequisite);
  const filteredSlots = occupiedSlots.filter(slot =>
    slot.prerequisitesDegree === prerequisite.prerequisitesDegree &&
    slot.prerequisitesBranch === prerequisite.prerequisitesBranch
  )
  const updatedTimetableData = {
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
  };
  filteredSlots.forEach(slot => {
    slot.LectureSlots.forEach(lecture => {
      if (!updatedTimetableData[lecture.day]) {
        updatedTimetableData[lecture.day] = {};
      }
      updatedTimetableData[lecture.day][lecture.time] = 'Occupied';
    });
    slot.PracticalSlots.forEach(practical => {
      if (!updatedTimetableData[practical.day]) {
        updatedTimetableData[practical.day] = {};
      }
      updatedTimetableData[practical.day][practical.time] = 'Occupied';
    });
  });
  setTimeout(() => {
    setTimeTableData(updatedTimetableData);
  }, 100);
};



//Once the check is doen to update teh time table
const updateTimeTable = (Slots) => {
  const currentTimetableData = { ...timetableData };
  const updatedOccupiedSlots = [...occupiedSlots];

  // Remove the old slots from the timetable for the current course
  updatedOccupiedSlots.forEach((slot, index) => {
    if (
      slot.prerequisitesDegree === Slots.prerequisitesDegree &&
      slot.prerequisitesBranch === Slots.prerequisitesBranch
    ) {
      slot.LectureSlots.forEach((lecture) => {
        if (
          currentTimetableData[lecture.day] &&
          currentTimetableData[lecture.day][lecture.time] === 'Occupied'
        ) {
          currentTimetableData[lecture.day][lecture.time] = '';
        }
      });
      slot.PracticalSlots.forEach((practical) => {
        if (
          currentTimetableData[practical.day] &&
          currentTimetableData[practical.day][practical.time] === 'Occupied'
        ) {
          currentTimetableData[practical.day][practical.time] = '';
        }
      });
      // Check if the existing slot is updated
      const isSlotUpdated = Slots.LectureSlots.find(
        (ls) =>
          ls.day === slot.LectureSlots[0]?.day &&
          ls.time === slot.LectureSlots[0]?.time
      ) ||
      Slots.PracticalSlots.find(
        (ps) =>
          ps.day === slot.PracticalSlots[0]?.day &&
          ps.time === slot.PracticalSlots[0]?.time
      );

      // Only remove the existing slot if it is updated
      if (isSlotUpdated) {
        updatedOccupiedSlots.splice(index, 1);
      }
    }
  });
  // Add the new slots to the timetable
  Slots.LectureSlots.forEach((lecture) => {
    if (!currentTimetableData[lecture.day]) {
      currentTimetableData[lecture.day] = {};
    }
    currentTimetableData[lecture.day][lecture.time] = 'Occupied';
  });

  Slots.PracticalSlots.forEach((practical) => {
    if (!currentTimetableData[practical.day]) {
      currentTimetableData[practical.day] = {};
    }
    currentTimetableData[practical.day][practical.time] = 'Occupied';
  });

  setTimeTableData(currentTimetableData);
  setOccupiedSlots(updatedOccupiedSlots);
};

//To add a new prerquisite degree andd branch
const handleAddPrerequisites = () => {
  const newPrerequisite = { ...prerequisitesData };
  setPrerequisites((prevPrerequisites) => [...prevPrerequisites, newPrerequisite]);
  setPrerequisiteData({ prerequisitesDegree: "", prerequisitesBranch: "", LectureSlots: [], PracticalSlots: [] });
};

//To remove a prerequisiste that is added
     const handleRemovePrerequisite = (index) => {
       const updatedPrerequisites = [...prerequisites];
       updatedPrerequisites.splice(index, 1);
       setPrerequisites(updatedPrerequisites);
       setTimeTableData({
         Mon: {},
         Tue: {},
         Wed: {},
         Thu: {},
         Fri: {},
       });
     };
     const handleSlotChange = (prerequisiteIndex, slotIndex, slotType, key, value , degree ,branch) => {
    const updatedPrerequisites = [...prerequisites];
    const updatedPrerequisite = { ...updatedPrerequisites[prerequisiteIndex] };
    if (!updatedPrerequisite[slotType]) {
      updatedPrerequisite[slotType] = [];
    }
    if (!updatedPrerequisite[slotType][slotIndex]) {
      updatedPrerequisite[slotType][slotIndex] = {};
    }
    updatedPrerequisite[slotType][slotIndex][key] = value;
    updatedPrerequisites[prerequisiteIndex] = updatedPrerequisite;

    setPrerequisites(updatedPrerequisites);
  };




//To cehck the time tabel and see i fthere is any ocnflict
  const handleCheck = (prerequisite, prerequisiteIndex) => {
    console.log('Checking prerequisites:', prerequisite);
    console.log('Checking all prerequisites:', prerequisites);
    let isConflict = false;
    if (prerequisite.LectureSlots) {
      console.log('Checking Lecture Slots:', prerequisite.LectureSlots);

      for (let j = 0; j < prerequisite.LectureSlots.length; j++) {
        const slot = prerequisite.LectureSlots[j];
        console.log('Checking Lecture Slot:', slot);

        if (slot.day) {
          const { day, time } = slot;
          console.log('Checking Day and Time:', day, time);
          // Check for conflicts only if the slot has been changed
          const isSlotChanged = !prerequisites[prerequisiteIndex]?.LectureSlots[j] ||
            prerequisites[prerequisiteIndex]?.LectureSlots[j].day !== slot.day ||
            prerequisites[prerequisiteIndex]?.LectureSlots[j].time !== slot.time;
          if (isSlotChanged && timetableData[day] && timetableData[day][time] === 'Occupied') {
            isConflict = true;
            break;
          }
        }
      }
    }
    if (!isConflict && prerequisite.PracticalSlots) {
      console.log('Checking Practical Slots:', prerequisite.PracticalSlots);

      for (let k = 0; k < prerequisite.PracticalSlots.length; k++) {
        const slot = prerequisite.PracticalSlots[k];
        console.log('Checking Practical Slot:', slot);

        if (slot.day) {
          const { day, time } = slot;
          console.log('Checking Day and Time:', day, time);

          // Check for conflicts only if the slot has been changed
          const isSlotChanged = !prerequisites[prerequisiteIndex]?.PracticalSlots[k] ||
            prerequisites[prerequisiteIndex]?.PracticalSlots[k].day !== slot.day ||
            prerequisites[prerequisiteIndex]?.PracticalSlots[k].time !== slot.time;

          if (isSlotChanged && timetableData[day] && timetableData[day][time] === 'Occupied') {
            isConflict = true;
            break;
          }
        }
      }
    }

    if (isConflict) {
      alert('Error: Slots are already occupied!');
    } else {
      alert('Timetable is available. Updating timetable...');
      updateTimeTable(prerequisite);
    }
  };


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
    <form>
<div className="space-y-12">
  <div className="">
    <h1 className="text-base font-bold leading-7 text-black">UPDATE THE COURSE AS ADMIN</h1>
    <h2 className="mt-1 text-lg leading-6 text-gray-600">MAKE CHANGES AS ADMIN</h2>

    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-4">
        <label htmlFor="username" className="block text-lg font-large font-bold leading-6 text-gray-900">Course Code</label>
        <div className="mt-1">
        <span className="text-red-600 font-bold text-sm">Cannot Reset The CourseCode Once Set!</span>
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input type="text" name="CourseCode" id="CourseCode"  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900  focus:ring-0 sm:text-lg sm:leading-6" value={courseData.CourseCode}
                disabled readOnly/>
          </div>
        </div>
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="username" className="block text-lg font-large font-bold leading-6 text-gray-900">Course Title</label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input type="text" name="CourseTitle" id="CourseTitle"  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900  focus:ring-0 sm:text-lg sm:leading-6" value={courseData.CourseTitle}
                    onChange={handleInputChange}/>
          </div>
        </div>
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="username" className="block text-lg font-large font-bold leading-6 text-gray-900">Course Instructor</label>
        <div className="mt-2">
        <span className="font-semibold text-red-500">Please type the Staff Id of the faculty you want to assign this course to</span>
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input type="text" name="instructor" id="instructor"  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900  focus:ring-0 sm:text-lg sm:leading-6" value={courseData.instructor}
                    onChange={handleInputChange}/>
          </div>
        </div>
      </div>
      <div class="mt-5 space-y-10">
        <div class="mt-2 space-y-1">
          <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Course Type</label>
          <select
            id="CourseType"
            name="CourseType"
            className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
            value={courseData.CourseType}
            onChange={handleCourseTypeChange}
          >
            <option value="Programme Core">Programme Core</option>
            <option value="Elective">Elective</option>
            <option value="Mandatory Learning Course">Mandatory Learning Course</option>
          </select>
        </div>
      </div>
      <div className="col-span-full">
        <label htmlFor="about" className="block text-lg font-large font-bold leading-6 text-gray-900">Course Description</label>
        <div className="mt-2">
        <textarea
id="description"
name="description"
rows="3"
className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
value={courseData.description}
onChange={handleInputChange}
>
</textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="mt-5 space-y-10">
    <div class="mt-2 space-y-1">
      <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Minimum Required CGPA</label>
      <select
        id="RequiredCGPA"
        name="RequiredCGPA"
        className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
        value={courseData.RequiredCGPA}
        onChange={handleCGPAChange} // Update this function accordingly
      >
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    </div>
  </div>

    <div class="mt-5 space-y-10">
      <div class="mt-2 space-y-1">
        <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Minimum Required Credits</label>
  <input
    type="number"
    name="RequiredCredits"
    placeholder="Total Credits"
    value={courseData.RequiredCredits}
    onChange={handleInputChange}
    class="border border-purple-500 rounded-md px-4 py-2 text-lg"
  />
  </div>
</div>
  <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
<div class="sm:col-span-2">
<label htmlFor="courseRegDeadline" class="block text-lg font-large font-bold leading-6 text-gray-900">Course Registration Deadline</label>
<div class="mt-2">

  <input
    type="date"
    name="CourseRegDeadline"
    id="courseRegDeadline"
    autoComplete="courseRegDeadline"
    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
    value={new Date(courseData.CourseRegDeadline).toISOString().split('T')[0]}
    onChange={handleInputChange}
  />
</div>
</div>
<div class="sm:col-span-2">
<label htmlFor="courseDropDeadline" class="block text-lg font-large font-bold leading-6 text-gray-900">Course Drop Deadline</label>
<div class="mt-2">
  <input
    type="date"
    name="CourseDropDeadline"
    id="courseDropDeadline"
    autoComplete="courseDropDeadline"
    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
    value={new Date(courseData.CourseDropDeadline).toISOString().split('T')[0]}
    onChange={handleInputChange}
  />
</div>
</div>
</div>
  <div className="mt-10 flex flex-box space-x-60">
    <div class="mt-5 space-y-20">
      <div class="mt-2 space-y-1">
        <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Number of Lecture Per Week in Hours</label>
        <select
          id="courseCredits"
          name="courseCredits"
          className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
          value={courseData.NoLectures}
          onChange={() => {}}
          disabled
        >
        <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
    </div>
    <div class="mt-5 space-y-10">
      <div class="mt-2 space-y-1">
        <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Number of Practicals per Week in Hours</label>
        <select
          id="courseCredits"
          name="courseCredits"
          className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
          value={courseData.NoPracticals}
          onChange={() => {}}
          disabled
        >
        <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
    </div>
  </div>
  <div className="mt-5 space-y-10">
    <div className="mt-2 space-y-1">
      <label htmlFor="courseCredits" className="block text-sm font-bold leading-6 text-gray-900">Course Credits</label>
      <select
        id="courseCredits"
        name="courseCredits"
        className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        value={courseData.credits}
        onChange={handleCreditsChange} // Update this function accordingly
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
  </div>
</div>
<div>
<section class="container px-4 mx-auto">
<div className="flex space-x-1">
        <h2 class="text-lg font-medium text-gray-800 dark:text-black">{selectedPrerequisite.prerequisitesDegree}</h2>
        <h2 class="text-lg font-medium text-gray-800 dark:text-black">-{selectedPrerequisite.prerequisitesBranch}</h2>
</div>
    <div class="flex flex-col mt-6">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="py-3.5 px-4 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Day
                                </th>
                                <th scope="col" class="px-12 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    8-9 AM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    9-10 AM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    10-11 AM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    11-12 AM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    12-01 PM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    01-02 PM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    02-03 PM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    03-04 PM
                                </th>
                                <th scope="col" class="px-4 py-3.5 text-lg font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    04-05 PM
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                  {Object.keys(timetableData).map(day => (
                                    <tr key={day} className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                      <td class="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">{day}</td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                       style={{ color: timetableData[day]['8-9'] === 'Occupied' ? 'red' : 'green' }}>
                                       {timetableData[day]['8-9'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['9-10'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['9-10'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['10-11'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['10-11'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['11-12'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['11-12'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                          Lunch Break
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['1-2'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['1-2'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['2-3'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['2-3'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['3-4'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['3-4'] || 'Available'}
                                      </td>
                                      <td className="px-4 py-4 text-lg text-gray-500 dark:text-gray-300 whitespace-nowrap"
                                          style={{ color: timetableData[day]['4-5'] === 'Occupied' ? 'red' : 'green' }}>
                                        {timetableData[day]['4-5'] || 'Available'}
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
<div class="mt-10">
<h1 class="text-xl font-bold leading-8 text-black">SET THE PREREQUISITES</h1>
<div class="space-y-6">
 <table class="w-full border-collapse border border-purple-500 text-lg">
   <thead>
     <tr class="bg-purple-500 text-white">
       <th class="py-3 px-6 text-left">Prerequisite Degree</th>
       <th class="py-3 px-6 text-left">Prerequisite Branch</th>
       {Array.from({ length: courseData.NoLectures }, (_, i) => i ).map((lectureIndex) => (
         <>
           <th class="py-3 px-6 text-left">{`Lecture Slot ${lectureIndex}`}</th>
         </>
       ))}
       {Array.from({ length: courseData.NoPracticals }, (_, i) => i ).map((practicalIndex) => (
         <>
           <th class="py-3 px-6 text-left">{`Practical Slot ${practicalIndex}`}</th>
         </>
       ))}
       <th class="py-3 px-3 text-left">Check</th>
       <th class="py-3 px-3 text-left">Check Time Table</th>
     </tr>
   </thead>
   <tbody className="text-lg">
     {prerequisites && prerequisites.map((prerequisite, index) => (
       <tr key={index} class="border-b border-purple-500">
         <td class="py-3 px-6 text-left">{prerequisite.prerequisitesDegree}</td>
         <td class="py-3 px-6 text-left">{prerequisite.prerequisitesBranch}</td>
         {Array.from({ length: courseData.NoLectures }, (_, i) => i ).map((slotIndex) => (
           <React.Fragment key={slotIndex}>
             <td class="py-2 px-2 text-left">
               <input
                 type="text"
                 placeholder={`Lecture Slot ${slotIndex} (Day)`}
                 value={prerequisite.LectureSlots ? prerequisite.LectureSlots[slotIndex]?.day || '' : ''}
                 onChange={(e) => handleSlotChange(index, slotIndex, 'LectureSlots', 'day', e.target.value,prerequisite.Degree,prerequisite.Branch)}
                 class="border border-purple-500 rounded-md px-1 py-1 text-sm"
               />
               <input
                 type="text"
                 placeholder={`Lecture Slot ${slotIndex} (Time)`}
                 value={prerequisite.LectureSlots ? prerequisite.LectureSlots[slotIndex]?.time || '' : ''}
                 onChange={(e) => handleSlotChange(index, slotIndex, 'LectureSlots', 'time', e.target.value,prerequisite.Degree,prerequisite.Branch)}
                 class="border border-purple-500 rounded-md px-1 py-1 text-sm"
               />
             </td>
           </React.Fragment>
         ))}
         {Array.from({ length: courseData.NoPracticals }, (_, i) => i ).map((slotIndex) => (
           <React.Fragment key={slotIndex}>
             <td class="py-2 px-2 text-left">
               <input
                 type="text"
                 placeholder={`Practical Slot ${slotIndex} (Day)`}
                 value={prerequisite.PracticalSlots ? prerequisite.PracticalSlots[slotIndex]?.day || '' : ''}
                 onChange={(e) => handleSlotChange(index, slotIndex, 'PracticalSlots', 'day', e.target.value,prerequisite.Degree,prerequisite.Branch)}
                 class="border border-purple-500 rounded-md px-1 py-1 text-sm"
               />
               <input
                 type="text"
                 placeholder={`Practical Slot ${slotIndex} (Time)`}
                 value={prerequisite.PracticalSlots ? prerequisite.PracticalSlots[slotIndex]?.time || '' : ''}
                 onChange={(e) => handleSlotChange(index, slotIndex, 'PracticalSlots', 'time', e.target.value,prerequisite.Degree,prerequisite.Branch)}
                 class="border border-purple-500 rounded-md px-1 py-1 text-sm"
               />
             </td>
           </React.Fragment>
         ))}
         <td class="py-3 px-6 text-left">
           <button
             type="button"
             onClick={() => handleCheck(prerequisite,index)}
             class="text-green-600 hover:underline"
           >
             Check
           </button>
         </td>
         <td class="py-3 px-6 text-left">
           <button
             type="button"
             onClick={() => CheckTimeTable(prerequisite)}
             class="text-blue-600 hover:underline"
           >
             Check Time Table
           </button>
         </td>
       </tr>
     ))}
   </tbody>
 </table>

 <div class="flex items-center gap-x-8 mt-4">
 <select
name="prerequisitesDegree"
value={prerequisitesData.prerequisitesDegree}
onChange={(e) => {
const newValue = e.target.value;
setPrerequisiteData((prevData) => ({
...prevData,
prerequisitesDegree: newValue,
}));
setSelectedPrerequisite((prevSelected) => ({
...prevSelected,
prerequisitesDegree: newValue,
}));
}}
className="border border-purple-500 rounded-md px-4 py-2 text-lg"
>
<option value="">Select Prerequisites Degree</option>
<option value="Btech">Btech</option>
<option value="Mtech">Mtech</option>
<option value="Phd">Phd</option>
</select>

<select
name="prerequisitesBranch"
value={prerequisitesData.prerequisitesBranch}
onChange={(e) => {
const newValue = e.target.value;
setPrerequisiteData((prevData) => ({
...prevData,
prerequisitesBranch: newValue,
}));
setSelectedPrerequisite((prevSelected) => ({
...prevSelected,
prerequisitesBranch: newValue,
}));
}}
className="border border-purple-500 rounded-md px-4 py-2 text-lg mt-4"
>
<option value="">Select Prerequisites Branch</option>
<option value="IT">IT</option>
<option value="AI">AI</option>
<option value="META">META</option>
<option value="MECH">MECH</option>
<option value="EEE">EEE</option>
<option value="ECE">ECE</option>
<option value="CS">CS</option>
</select>
   <button type="button" onClick={()=>{handleAddPrerequisites();
   generateTimetable();}} class="bg-indigo-600 text-white px-6 py-2 rounded-md text-lg">
     Add Prerequisite
   </button>
 </div>
</div>
</div>
<div class="mt-10">
<h1 class="text-xl font-bold leading-8 text-black">UPDATE THE COURSE GRADES STRUCTURE</h1>
<div class="space-y-6">
  <table class="w-full border-collapse border border-purple-500 text-lg">
    <thead>
      <tr class="bg-purple-500 text-white">
        <th class="py-3 px-6 text-left">Exam Name</th>
        <th class="py-3 px-6 text-left">Max Marks</th>
        <th class="py-3 px-6 text-left">Weightage</th>
        <th class="py-3 px-10 text-right">Actions</th>
      </tr>
    </thead>
    <tbody className="text-lg">
      {exams.map((exam, index) => (
        <tr key={index} class="border-b border-purple-500">
          <td class="py-3 px-6 text-left">{exam.examName}</td>
          <td class="py-3 px-6 text-left">{exam.maxMarks}</td>
          <td class="py-3 px-6 text-left">{exam.weightage}</td>
          <td class="py-3 px-10 text-right">
           Unable To Remove Can Only Add New Exams
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <div class="flex items-center gap-x-8 mt-4">
    <input
      type="text"
      name="examName"
      placeholder="Exam Name"
      value={examData.examName}
      onChange={(e) => setExamData({ ...examData, examName: e.target.value })}
      class="border border-purple-500 rounded-md px-4 py-2 text-lg"
    />
    <input
      type="number"
      name="maxMarks"
      placeholder="Max Marks"
      value={examData.maxMarks}
      onChange={(e) => setExamData({ ...examData, maxMarks: e.target.value })}
      class="border border-purple-500 rounded-md px-4 py-2 text-lg"
    />
    <input
      type="number"
      name="weightage"
      placeholder="Weightage"
      value={examData.weightage}
      onChange={(e) => setExamData({ ...examData, weightage: e.target.value })}
      class="border border-purple-500 rounded-md px-4 py-2 text-lg"
    />
    <button type="button" onClick={handleAddExam} class="bg-indigo-600 text-white px-6 py-2 rounded-md text-lg">
      Add Exam
    </button>
  </div>
</div>
</div>
<div className="mt-6 flex items-center justify-end gap-x-6">
  <button type="button" onClick={handleCancel} className="rounded-md bg-red-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancel</button>
  <button type="submit" onClick={handleSubmit} className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SUBMIT</button>
</div>
</form>
<div className="overflow-x-auto flex" style={{marginTop: 5+'em'}}>
      <div className="table-container border-r border-gray-800 pr-4">
        <h2 className="font-bold text-lg mb-2 text-center">Requested Students</h2>
        <table className="min-w-full divide-y-2 divide-gray-400 bg-white text-lg">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Roll Number</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Programme</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Branch</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Sem</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Total Credits</th>
              <th className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">Enrollment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {requestedStudents.map((student) => (
              <tr key={student.id} className="odd:bg-gray-50">
                {/* Include the data from the student object */}
                <td className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">{student.studentID}</td>
                <td className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">{student.name}</td>
                <td className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">{student.programType}</td>
                <td className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">{student.department}</td>
                <td className="whitespace-nowrap px-5 py-2 font-medium text-gray-900">{student.sem}</td>
                <td className="whitespace-nowrap px-7 py-2 font-medium text-gray-900">{student.TotalCredits}</td>
                <td className="whitespace-nowrap px-7 py-2">
                  <button
                    className="bg-blue-500 text-white px-5 py-1 rounded"
                    onClick={() => handleEnroll(student)}
                  >
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enrolled Students Table */}
      <div className="table-container p-4 border-r">
        <h2 className="font-bold text-lg mb-2 text-center">Enrolled Students</h2>
        <table className="min-w-full divide-y-2 divide-gray-400 bg-white text-lg">
          {<thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Roll Number</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Programme</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Branch</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Sem</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Total Credits</th>
              <th className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">Set Exam Grades</th>
            </tr>
          </thead>}
          <tbody className="divide-y divide-gray-200">
            {enrolledStudents.map((student) => (
              <tr key={student.id} className="odd:bg-gray-50">
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.studentID}</td>
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.name}</td>
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.programType}</td>
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.department}</td>
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.sem}</td>
                <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900">{student.TotalCredits}</td>
                <td className="whitespace-nowrap px-5 py-2">
                  <button
                    className="bg-blue-500 text-white px-5 py-1 rounded"
                    onClick={() => handleE(student.studentID,courseData.CourseCode)}
                  >
                    Set Exam Grades
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" onClick={handleCancel1} className="rounded-md bg-red-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancel</button>
      <button type="submit" onClick={handleSubmit1} className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SAVE AND SUBMIT TO ADMIN</button>
    </div>
</div>
  );
};

export default Slug;
