Mukul Tracker Setup Instructions 
============================================

Project Structure:
------------------
mukul-trker/
├── client/    # Frontend (React + Vite)
└── server/    # Backend (Node.js + Docker)


Frontend Setup (Vite + React):
------------------------------

1. Navigate to the frontend directory:
   cd client

2. Install dependencies (force install required for date-fns issues):
   npm install -f

3. Start the development server:
   npm run dev

   - Frontend will run at: http://localhost:5173


Backend Setup (Dockerized Node.js):
-----------------------------------

1. Navigate to the backend directory:
   cd server

2. Build the Docker image:
   docker build -t mukul-trker .

3. Run the Docker container on port 9210:
   docker run -d -p 9210:9210 --name mukul-trker mukul-trker

   - Backend will run at: http://localhost:9210


Useful Docker Commands:
------------------------

- Stop the container:
  docker stop mukul-trker

- Start the container:
  docker start mukul-trker

- Remove the container:
  docker rm mukul-trker

- Rebuild the image after code changes:
  docker build -t mukul-trker .


Environment Variables (Optional .env for Backend):
--------------------------------------------------

Create a .env file inside the 'server' directory with the following content:

PORT=9210
MONGO_URI=mongodb://localhost:27017/mukul-trker
JWT_SECRET=your_jwt_secret


Known Issues:
-------------

- Vite + date-fns might cause installation issues.
  Use: npm install -f

- Ensure MongoDB is running or update MONGO_URI as per your setup.
