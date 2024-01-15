# IRIS_Rec23_221IT017_MERN-NEXT-JS-
A Course Registration Web Application done using MERN(Using Next-JS) 
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
After downloading the zip file and unzipping the file open terminal and run 

-npm i(To install all the node module dependencies)
-npm i mongoose(Just in case,had to install mongoose seperately when i checked)

Open MongoDB Atlas Compass and type the url string as "mongodb://127.0.0.1:27017/iris-db" to connect to the mongodb database to the project

Click the Save and Connect button to save and connect to the mongodb connection 

-npm run dev 
To start the project 
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This Next-JS and Mongodb project has been made to follow the MVC Architecture.The MongoDB model, defined in the models directory, represents the data model for the application.The React components represent the view.The controller logic is implemented in the API route /api/filename.js. This route handles the business logic for doing requested instructions.The connectDb middleware in middleware/mongoose.js is used to manage database connections. It ensures that a connection is established before handling the request.

Instructions to Run the Project

->The starting page of the project has 3 buttons one id admin the student and the faculty u can either choose to sign in or sign up once signed up you get redirected to homepage and then you need to login to go to dashboard for each type of user respectively

->Admin can create new students anf faculty 

Further instructions to run the project is shown in the video
I have uploaded a google drive link for the demonstration videos:(5 videos explaining different parts of the project)

https://drive.google.com/drive/folders/1AYQLIr9JYOJrNEJ-XvwZw2DZVDhynS1r?usp=sharing

LIST OF IMPLEMENTED FEATURES

1.Three way user login where student has fields like enrolled courses,sem,CGPA,Total Credits,department,Student ID and admin has just the name email and the password.

The faculty has fields like department,assigned courses,staffID,name,email

2.Authentication done using jwt token and checked whether token exists in each component after user login

3.As an Admin,The following features are implemented:

->Viewing All Faculty details

->New Course Request additions and approval done by admin

->Creation of a new faculty or student as an admin

->Creating a new course as an admin where addition doesnt require any approval

->View all students enrollment details to different courses and also stastics generated for each each course like number of students enrolled and the average CGPA 
of all the students enrolled to a particular course

->View all course feedbacks of all the students to different courses

->View all available courses irrespective of department or degree and also the ability to remove a course
Once a course has been deleted as an admin the details are removed from faculty and student as well if they has enrolled to this particualr course

->Editing or updating the courses like changing the course title adding new prerequisites(For example Btech+CS)
Check available slots for each combination of a degree and a branch

->Adding new exams structure(For example Quiz-1-15 Max-15%Weightage)

->Can choose to enroll or drop the students who have requested to enroll to a particular course

->Once a student is enrolled ,his/her marks in the course grades section could be set 

->Changing the instructor of the course is also handled properly

->As an admin we can set the course feedback forms
Only once set can students give feedbacks

->Search functionality based on Course Code and Course Title done for all available courses

->Emails are sent to particular course instructor if a new course is created under is name

->Emails are sent to all students enrolled to a particualr course if marks updation or marks upload is done

->Can set the minimum CGPA or minimum Credits required to enroll to a particular course

4.As a Faculty,The following features are implemented

->Can view his own details in My Account section

->Can create a new course but for the course to exist needs to be done an approval by admin

->Can view the time table where all the lecture slots and practical slots are being displayed for each the faculty is assigned to.If the slots are matching the 
admin or the faculty can change the slots for every course he is assigned to according to his own comforts

->Can also edit and update the course just like the admin

->Can choose to enroll or drop the students who have requested to enroll to a particular course

->Once a student is enrolled ,his/her marks in the course grades section could be set 

->As a faculty can create only those courses that belong to her/his department

->Can also add new prerequisite but only with the department he belongs to

->Can set the minimum CGPA or minimum Credits required to enroll to a particular course


5.As a student,The following features are implemented

->Can view all the available courses that belong to his department and degree which has all teh required details

->Can also choose to enroll to the courses but first checking is done by the system which checks based on the student's CGPA and total credist required and also 
the course registration deadline

->If the course registration deadline has passed the student can no longer enroll to the course

->A table to view the enrolled courses as well where the student can view the course grades for each course 

->Only once set by the admin the course feedback is filled

->Only Once feedback is filled Course Grade is displayed

->Can view his own account details in myaccount section

->Can view the timetable for the courses he has enrolled to 

->Once enrolled to course the course reaches the coursecart and only once submitted the request is sent to the admin and the course instructor

->Can choose to drop a course only before the course drop deadline

->A notification bar is also displayed regarding the course drop deadline and course enrollment deadline

->Emails are sent to students enrolled to a particular course if he/she has been approved for the course and also when marks are updated or uploaded

->Emails also sent when the student drops a particular course


List of Non-implemented features/Planned features

->Course updation approval by the admin whenever a faculty updates or changes any details by th admin

->Checking available slots initially for the course instructor as well while setting up the time table for a course
(It is still done since it could later be updated by the respective faculty to the course he has been assigned)

->Show courses based on the semester for students(Sem filtering) and also show all the courses available whenver an outsider also tries to login

->Assigning multiple faculties to a course so that multiple branch-degree combinations could be handled by different faculties
Thus reducing collision in time table and slots assignment

->Updating details of a student or a faculty
Like changing the name,email,department,sem,student ID and staffID and handling such cases cautiously

->Easier way of viewing course schedule details for all the users

->Real time CGPA calculation like based on relative grading and updation of course credits once the course has been completed for a student

->Searching for a particular feature or section done more easily

->More features could have been implemented under faculty section like uploading assignments,creating an online test platform

->Also assignments being uploaded by students and also showing the deadlines for them which later could be accessed by the faculty and allocation of marks for them

->Also sending emails related to assignments by the faculty

->Generate more statistics regarding the enrollment details

->Removal of a prerequisite dgree and branch once already set while updating a course(Right now can only add new ones cannot remov already set ones)

->Removing course exams while updating a course(Right now can only add new exams cannot be removed)

List of Known Bugs

->Potential warning errors are being observed when faculties are being changed for a particular course(It is working but warnings

->Could lead to 404 or 500 internal server error if wrong details or the unmatched(Wrong syntax) details are being fed

->While updating as a faculty or an admin for a particular course,while updating the time table and slots available,
Shows un-updated data.But the slots are being updated properly
(For example once i update a course slot and click check ans then try to click check time table it shows the old timetable without the updation,But the slots are being updated in the backend properly)

->Page rendering could be a problem at times

->Rigourous back and forth of pages could lead to improper rendering of the details of the page

->Could have implemented a better authentication system



[API routes] can be accessed on [http://localhost:3000/api/] This endpoint can be edited in `pages/api/filename.js`.

ScreenShots

U can view the screenshots here for further refernces!

https://drive.google.com/drive/folders/1aEgyIoyvDyFPGoGpBeR_HeCSLLp9MkCe?usp=sharing



References Used

Learn Next JS

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

Learn MongoDB

Documentation - https://docs.mongodb.com/manual/
Developer Center - https://www.mongodb.com/developer/
MongoDB University - https://learn.mongodb.com

Also took the help of ChatGPT to do the project!

CodeWithHarry helped me learn Next JS!

For Front End development

https://tailwindui.com/components

https://merakiui.com/components

