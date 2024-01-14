  import React, { useState,useEffect} from "react";
  import 'react-toastify/dist/ReactToastify.css';
  import { ToastContainer, toast } from 'react-toastify';
  import {useRouter} from "next/router"
  const NewCourseAdmin=()=>{
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


    const initialCourseData = {
      CourseCode: "",
      CourseTitle: "",
      instructor: "",
      description: "",
      prerequisitesDegree: [],
      prerequisitesBranch: [],
      NoLectures:0,
      NoPracticals:0,
      CourseType:"None",
      CourseRegDeadline:null,
      CourseDropDeadline:null,
      credits: null,
      RequiredCredits:0,
      RequiredCGPA:0
    };


    const [occupiedSlots,setOccupiedSlots]=useState([]);
    const [facultyIDs,setFaculties]=useState([]);
    const [courseCodes,setCourseCodes]=useState([]);


    useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/allcourses");
      const data = await response.json();
      const data1=data;
      const createdSlots = data.map(course => course.CreatedSlots).flat();
      const courseCodes= data1.map(course => course.CourseCode).flat();
      setOccupiedSlots(createdSlots);
      setCourseCodes(courseCodes);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, []);


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


    const [examData, setExamData] = useState({
      examName: "",
      maxMarks: "",
      weightage: "",
    });

    const [exams, setExams] = useState([]);
    const handleAddExam = () => {
    setExams([...exams, examData]);
    setExamData({ examName: "", maxMarks: "", weightage: "" });
  };

  const handleRemoveExam = (index) => {
    const updatedExams = [...exams];
    updatedExams.splice(index, 1);
    setExams(updatedExams);
  };

    const [courseData, setCourseData] = useState(initialCourseData);
    const [selectedOptions, setSelectedOptions] = useState([]);

   //To submit a new course and check if there is any errors
    const handleSubmit=async (e)=>
    {
      e.preventDefault();
      if (!facultyIDs.includes(courseData.instructor)) {
    alert('Invalid faculty ID. Please select a valid faculty.');
    setCourseData((prevCourseData) => ({
  ...prevCourseData,
  instructor: "",
}));
    return;
  }
  if (courseCodes.includes(courseData.CourseCode)) {
    alert('Course code already exists. Please choose a different course code.');
    setCourseData((prevCourseData) => ({
  ...prevCourseData,
  CourseCode: "",
}));
    return;
  }
      exams.forEach(exam => {
    exam.maxMarks = parseInt(exam.maxMarks, 10);
    exam.weightage = parseInt(exam.weightage, 10);
  });
       const totalWeight = exams.reduce((sum, exam) => sum + exam.weightage, 0);
       if (totalWeight > 100) {
        setExams([]);
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
     const shouldUpdate = window.confirm('Do you want to update the course details?');
  if (!shouldUpdate) {
    return;
  }
  const Prerequisites = prerequisites.map(({ prerequisitesDegree, prerequisitesBranch }) => ({
    prerequisitesDegree,
    prerequisitesBranch,
  }));
  const simplifiedPrerequisites = prerequisites.map(({ prerequisitesDegree, prerequisitesBranch, LectureSlots, PracticalSlots }) => ({
    prerequisitesDegree,
    prerequisitesBranch,
    LectureSlots: LectureSlots ? LectureSlots.slice(1) : [], // Exclude 0th index
    PracticalSlots: PracticalSlots ? PracticalSlots.slice(1) : [], // Exclude 0th index
  }));
  console.log("The CGPA is "+courseData.RequiredCGPA);
  console.log("The CGPA is "+courseData.RequiredCredits);
  console.log("The CGPA is "+courseData.CourseType);
       let data={ ...courseData,additionstatus:"success", CreatedSlots: simplifiedPrerequisites,prerequisites:Prerequisites};
       let res=await fetch("/api/newcourse",{
         method:"POST",
         headers:{
           "Content-Type":"application/json"
         },
         body:JSON.stringify(data)
       })
         const res1 = await fetch(`/api/assigncoursetofaculty?CourseCode=${courseData.CourseCode}&FacultyID=${courseData.instructor}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ additionstatus: 'success' }), // Add the updated data here
         });
         if (!res1.ok) {
           // Handle non-successful status codes
           const errorResponse1 = await res1.json();
           console.error("Error updating the faculty:", errorResponse1.error);
           // You may want to set an error state or display a notification to the user
           return;
         }
         const facultyResponse = await res1.json();
         const email= facultyResponse.email;
         const res2 = await fetch(`/api/addexamgrades?CourseCode=${courseData.CourseCode}`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({exams }), // Add the updated data here
         });
         if (!res2.ok) {
           // Handle non-successful status codes
           const errorResponse1 = await res2.json();
           console.error("Error updating the faculty:", errorResponse1.error);
           // You may want to set an error state or display a notification to the user
           return;
         }
         const sendEmail = async () => {
    if (email) {
      const emailData = {
        to: email,
        subject: `You have been assigned to the course ${courseData.CourseCode}`,
        text: `Now You're the Course instructor for the course ${courseData.CourseCode}!`,
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
          toast.success('Email Sent to the Course Instructor Successfully!', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          if (!emailResult.success) {
            console.error('Failed to send email:', emailResult.message);
          }
        } else {
          console.error('Failed to send email:', emailResponse.statusText);
        }
      } catch (error) {
        console.error('Error sending email:', error.message);
      }
    }
  };

  setTimeout(sendEmail, 1000);

        setCourseData(initialCourseData);
        setExams([]);
        setTimeTableData({
          Mon: {},
          Tue: {},
          Wed: {},
          Thu: {},
          Fri: {},
        })
       toast.success('New course Create as an admin!', {
         position: "top-center",
         autoClose: 1500,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
         });
    }


  const handleCreditsChange = (event) => {
    const selectedCredits = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      credits: selectedCredits,
    }));
  };


  const handleCourseTypeChange = (event) => {
    const selectedCourseType = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      CourseType: selectedCourseType,
    }));
  };

  const handleCGPAChange = (event) => {
    const CGPA = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      RequiredCGPA: CGPA,
    }));
  };


  const handleInputChange = (event, field, index, type) => {
  const { name, value } = event.target;
  if (name === "CourseCode") {
     setCourseData((prevData) => ({
       ...prevData,
       [name]: value.toUpperCase(),
     }));
   } else {
     setCourseData((prevData) => ({
       ...prevData,
       [name]: value,
     }));
   };
};

  const handleNoLecturesChange = (event) => {
    const selectedLectures = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      NoLectures: selectedLectures,
    }));
  };


  const handleNoPracticalsChange = (event) => {
    const selectedPracticals = event.target.value;
    setCourseData((prevData) => ({
      ...prevData,
      NoPracticals: selectedPracticals,
    }));
  };


    const handleCancel = () => {
      setCourseData(initialCourseData);
      setSelectedOptions1([]);
      setExams([]);
      setPrerequisites([]);
    };

    const [prerequisitesData, setPrerequisiteData] = useState({
       prerequisitesDegree: "",
       prerequisitesBranch: "",
       LectureSlots: [],
       PracticalSlots:[]
     });

const [prerequisites, setPrerequisites] = useState([]);
  const [timetableData,setTimeTableData]=useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
  });
  const [selectedPrerequisite, setSelectedPrerequisite] = useState({
   prerequisitesDegree: '',
  prerequisitesBranch: '',
})


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


const updateTimeTable = (Slots) => {
  const currentTimetableData = { ...timetableData };

    Slots.LectureSlots.forEach(lecture => {
      if (!currentTimetableData[lecture.day]) {
        currentTimetableData[lecture.day] = {};
      }
      currentTimetableData[lecture.day][lecture.time] = 'Occupied';
    });
    Slots.PracticalSlots.forEach(practical => {
      if (!currentTimetableData[practical.day]) {
        currentTimetableData[practical.day] = {};
      }
      currentTimetableData[practical.day][practical.time] = 'Occupied';
    });

  setTimeTableData(currentTimetableData);
};


     const handleAddPrerequisites = () => {
     setPrerequisites([...prerequisites, prerequisitesData]);
     setPrerequisiteData({ prerequisitesDegree: "",prerequisitesBranch: "",LectureSlots: [],PracticalSlots:[]});
   };


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



const handleCheck = (prerequisite) => {
  console.log('Checking prerequisites:', prerequisite);

  let isConflict = false;

  if (prerequisite.LectureSlots) {
    console.log('Checking Lecture Slots:', prerequisite.LectureSlots);

    for (let j = 1; j < prerequisite.LectureSlots.length; j++) {
      const slot = prerequisite.LectureSlots[j];
      console.log('Checking Lecture Slot:', slot);

      if (slot.day) {
        const { day, time } = slot;
        console.log('Checking Day and Time:', day, time);

        if (timetableData[day] && timetableData[day][time] === 'Occupied') {
          isConflict = true;
          break;
        }
      }
    }
  }

  if (!isConflict && prerequisite.PracticalSlots) {
    console.log('Checking Practical Slots:', prerequisite.PracticalSlots);

    for (let k = 1; k < prerequisite.PracticalSlots.length; k++) {
      const slot = prerequisite.PracticalSlots[k];
      console.log('Checking Practical Slot:', slot);

      if (slot.day) {
        const { day, time } = slot;
        console.log('Checking Day and Time:', day, time);

        if (timetableData[day] && timetableData[day][time] === 'Occupied') {
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
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h1 class="text-base font-bold leading-7 text-black">CREATE A NEW COURSE</h1>
      <h2 class="mt-1 text-lg leading-6 text-gray-600">ADD A NEW COURSE AS ADMIN</h2>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label htmlFor="username" class="block text-lg font-large font-bold leading-6 text-gray-900">Course Code</label>
          <div class="mt-2">
          <span className="font-semibold text-red-500">Please Choose A New and Unique Code</span>
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" name="CourseCode" id="CourseCode"  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg sm:leading-6" value={courseData.CourseCode}
                      onChange={handleInputChange} />
            </div>
          </div>
        </div>
        <div class="sm:col-span-4">
          <label htmlFor="username" class="block text-lg font-large font-bold leading-6 text-gray-900">Course Title</label>
          <div class="mt-2">
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" name="CourseTitle" id="CourseTitle"  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg sm:leading-6" value={courseData.CourseTitle}
                      onChange={handleInputChange}/>
            </div>
          </div>
        </div>
        <div class="sm:col-span-4">
          <label htmlFor="username" class="block text-lg font-large font-bold leading-6 text-gray-900">Instructor</label>
          <div class="mt-2">
          <span className="font-semibold text-red-500">Please type the Staff Id of the faculty you want to assign this course to</span>
            <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" name="instructor" id="instructor"  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-lg sm:leading-6" value={courseData.instructor} onChange={handleInputChange}/>
            </div>
          </div>
        </div>
          <div class="mt-5 space-y-10">
            <div class="mt-2 space-y-1">
              <label htmlFor="CourseType" class="block text-lg font-bold leading-6 text-gray-900">Course Type</label>
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

        <div class="col-span-full">
          <label htmlFor="about" class="block text-lg font-large font-bold leading-6 text-gray-900">Course Description</label>
          <div class="mt-2">
          <textarea
  id="description"
  name="description"
  rows="2"
  class="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
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
    <div class="">
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
<div class="border-b border-gray-900/10 pb-12">
  <div class="mt-5 space-y-20">
    <div class="mt-2 space-y-1">
      <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Number of Lecture Per Week in Hours</label>
      <span className="font-semibold text-red-500">Cannot be updated again once set!</span>
      <select
        id="courseCredits"
        name="courseCredits"
        className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
        value={courseData.NoLectures}
        onChange={handleNoLecturesChange} // Update this function accordingly
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
<div class="border-b border-gray-900/10 pb-12">
  <div class="mt-5 space-y-10">
    <div class="mt-2 space-y-1">
      <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Number of Practicals per Week in Hours</label>
      <span className="font-semibold text-red-500">Cannot be updated again once set!</span>
      <select
        id="courseCredits"
        name="courseCredits"
        className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
        value={courseData.NoPracticals}
        onChange={handleNoPracticalsChange} // Update this function accordingly
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
</div>
    </div>

    <div class="border-b border-gray-900/10 pb-12">
      <div class="mt-5 space-y-10">
        <div class="mt-2 space-y-1">
          <label htmlFor="courseCredits" class="block text-lg font-bold leading-6 text-gray-900">Course Credits</label>
          <select
            id="courseCredits"
            name="courseCredits"
            className="block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
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
           {Array.from({ length: courseData.NoLectures }, (_, i) => i + 1).map((lectureIndex) => (
             <>
               <th class="py-3 px-6 text-left">{`Lecture Slot ${lectureIndex}`}</th>
             </>
           ))}
           {Array.from({ length: courseData.NoPracticals }, (_, i) => i + 1).map((practicalIndex) => (
             <>
               <th class="py-3 px-6 text-left">{`Practical Slot ${practicalIndex}`}</th>
             </>
           ))}
           <th class="py-3 px-3 text-left">Check</th>
           <th class="py-3 px-3 text-left">Actions</th>
         </tr>
       </thead>
       <tbody className="text-lg">
         {prerequisites.map((prerequisite, index) => (
           <tr key={index} class="border-b border-purple-500">
             <td class="py-3 px-6 text-left">{prerequisite.prerequisitesDegree}</td>
             <td class="py-3 px-6 text-left">{prerequisite.prerequisitesBranch}</td>
             {Array.from({ length: courseData.NoLectures }, (_, i) => i + 1).map((slotIndex) => (
  <React.Fragment key={slotIndex}>
    <td className="py-2 px-2 text-left">
      <label htmlFor={`daySlot${slotIndex}`} className="block text-xs mb-1">Lecture Slot {slotIndex} (Day)</label>
      <select
        id={`daySlot${slotIndex}`}
        value={prerequisite.LectureSlots ? prerequisite.LectureSlots[slotIndex]?.day || '' : ''}
        onChange={(e) => handleSlotChange(index, slotIndex, 'LectureSlots', 'day', e.target.value, prerequisite.Degree, prerequisite.Branch)}
        className="border border-purple-500 rounded-md px-1 py-1 text-sm"
      >
        <option value="">Select Day</option>
        <option value="Mon">Mon</option>
        <option value="Tue">Tue</option>
        <option value="Wed">Wed</option>
        <option value="Thu">Thu</option>
        <option value="Fri">Fri</option>
        <option value="Sat">Sat</option>
        <option value="Sun">Sun</option>
      </select>

      <label htmlFor={`timeSlot${slotIndex}`} className="block text-xs mb-1 mt-2">Lecture Slot {slotIndex} (Time)</label>
      <select
        id={`timeSlot${slotIndex}`}
        value={prerequisite.LectureSlots ? prerequisite.LectureSlots[slotIndex]?.time || '' : ''}
        onChange={(e) => handleSlotChange(index, slotIndex, 'LectureSlots', 'time', e.target.value, prerequisite.Degree, prerequisite.Branch)}
        className="border border-purple-500 rounded-md px-1 py-1 text-sm mt-1"
      >
        <option value="">Select Time</option>
        <option value="8-9">8-9</option>
        <option value="9-10">9-10</option>
        <option value="10-11">10-11</option>
        <option value="11-12">11-12</option>
        <option value="1-2">1-2</option>
        <option value="2-3">2-3</option>
        <option value="3-4">3-4</option>
        <option value="4-5">4-5</option>
      </select>
    </td>
  </React.Fragment>
))}
             {Array.from({ length: courseData.NoPracticals }, (_, i) => i + 1).map((slotIndex) => (
   <React.Fragment key={slotIndex}>
     <td className="py-2 px-2 text-left">
       <label htmlFor={`daySlot${slotIndex}`} className="block text-xs mb-1">Practical Slot {slotIndex} (Day)</label>
       <select
         id={`daySlot${slotIndex}`}
         value={prerequisite.PracticalSlots ? prerequisite.PracticalSlots[slotIndex]?.day || '' : ''}
         onChange={(e) => handleSlotChange(index, slotIndex, 'PracticalSlots', 'day', e.target.value, prerequisite.Degree, prerequisite.Branch)}
         className="border border-purple-500 rounded-md px-1 py-1 text-sm"
       >
         <option value="">Select Day</option>
         <option value="Mon">Mon</option>
         <option value="Tue">Tue</option>
         <option value="Wed">Wed</option>
         <option value="Thu">Thu</option>
         <option value="Fri">Fri</option>
       </select>

       <label htmlFor={`timeSlot${slotIndex}`} className="block text-xs mb-1 mt-2">Practical Slot {slotIndex} (Time)</label>
       <select
         id={`timeSlot${slotIndex}`}
         value={prerequisite.PracticalSlots ? prerequisite.PracticalSlots[slotIndex]?.time || '' : ''}
         onChange={(e) => handleSlotChange(index, slotIndex, 'PracticalSlots', 'time', e.target.value, prerequisite.Degree, prerequisite.Branch)}
         className="border border-purple-500 rounded-md px-1 py-1 text-sm mt-1"
       >
         <option value="">Select Time</option>
         <option value="8-9">8-9</option>
         <option value="9-10">9-10</option>
         <option value="10-11">10-11</option>
         <option value="11-12">11-12</option>
         <option value="1-2">1-2</option>
         <option value="2-3">2-3</option>
         <option value="3-4">3-4</option>
         <option value="4-5">4-5</option>
       </select>
     </td>
   </React.Fragment>
 ))}

             <td class="py-3 px-6 text-left">
               <button
                 type="button"
                 onClick={() => handleCheck(prerequisite)}
                 class="text-green-600 hover:underline"
               >
                 Check
               </button>
             </td>
             <td class="py-3 px-6 text-left">
               <button
                 type="button"
                 onClick={() => handleRemovePrerequisite(index)}
                 class="text-red-600 hover:underline"
               >
                 Remove
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>

     <div class="flex items-center gap-x-8 mt-4 space-y-1">
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
   </div>
  </form>
  <div class="mt-10">
    <h1 class="text-xl font-bold leading-8 text-black">SET THE COURSE GRADES STRUCTURE</h1>
    <div class="space-y-6">
      <table class="w-full border-collapse border border-purple-500 text-lg">
        <thead>
          <tr class="bg-purple-500 text-white">
            <th class="py-3 px-6 text-left">Exam Name</th>
            <th class="py-3 px-6 text-left">Max Marks</th>
            <th class="py-3 px-6 text-left">Weightage</th>
            <th class="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {exams.map((exam, index) => (
            <tr key={index} class="border-b border-purple-500">
              <td class="py-3 px-6 text-left">{exam.examName}</td>
              <td class="py-3 px-6 text-left">{exam.maxMarks}</td>
              <td class="py-3 px-6 text-left">{exam.weightage}</td>
              <td class="py-3 px-6 text-left">
                <button
                  type="button"
                  onClick={() => handleRemoveExam(index)}
                  class="text-red-600 hover:underline"
                >
                  Remove
                </button>
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
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button type="button" onClick={handleCancel} class="rounded-md bg-red-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Cancel</button>
    <button type="submit" onClick={handleSubmit} class="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">SAVE AND SUBMIT</button>
  </div>
  </div>
    );
  }
  export default NewCourseAdmin;
