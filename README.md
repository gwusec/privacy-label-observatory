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


# Notes for 2/11
- Under absolutely no circumstance should you store the URL for the backend in a variable. It messes up the routing
- Got the app list to actually load on the explore page. 
- Next on the todo list is to work on pagination for the app list. The backend function already has pagination built in. Just need to implement some arrows in the frontend to do so. 