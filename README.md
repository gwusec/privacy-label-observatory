# How to set up Observatory
1. Make sure Elastic/Kibana is set up. Make note of the passwords for elastic and kibana

2. Using the upload script in final_copy directory, upload runs 1 through 69, ignoring any errors that occur. Ensure that data was uploaded via Kibana dashboard. 

3. cd to backend directory and run npm install to install all dependencies. 

4. Run "npm run dev" in the backend directory to run it. If successful, it should run on port 8017. 

5. Using another terminal shell, cd to frontend and run "npm install" to install all dependencies as well. 

6. Run "npm run dev" in the frontend directory to run it. If successful, it should run on port 3000. 



# Installation Changes
.env file was created in the frontend, with one variable: 
```sh
BACKEND_API = "http://localhost:8080/"
```
or whatever port you're using. This is needed to simplify instead of writing the URL for everything

Backend still has nodemon, running:
```sh
npm run dev
```
will solve that

react-icons was installed to represent the arrows on the explore sidebar. 

papaparse was installed for parsing CSV. 


