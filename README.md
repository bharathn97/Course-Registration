# IRIS_Rec23_221IT017_MERN-NEXT-JS-
A Course Registration Web Application done using MERN(Using Next-JS) 
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
After downloading the zip file and unzipping the file open terminal and run 

-npm i(To install all the node module dependencies)
-npm i mongoose(Just in case,had to install mongoose seperately when i checked)

Open MongoDB Atlas Compass and type the url string as "mongodb://127.0.0.1:27017/iris-db" to connect the mongodb database to the project

Click the Save and Connect button to save and connect to the mongodb connection 

-npm run dev 
To start the project 
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This Next-JS and Mongodb project has been made to follow the MVC Architecture.The MongoDB model, defined in the models directory, represents the data model for the application.The React components represent the view.The controller logic is implemented in the API route /api/filename.js. This route handles the business logic for doing requested instructions.The connectDb middleware in middleware/mongoose.js is used to manage database connections. It ensures that a connection is established before handling the request.


[API routes] can be accessed on [http://localhost:3000/api/] This endpoint can be edited in `pages/api/filename.js`.











## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
