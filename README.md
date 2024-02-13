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


# Notes for 2/11
- Under absolutely no circumstance should you store the URL for the backend in a variable. It messes up the routing
- Got the app list to actually load on the explore page. 
- Next on the todo list is to work on pagination for the app list. The backend function already has pagination built in. Just need to implement some arrows in the frontend to do so. 

# Notes for 2/13
- Pagination is now running correctly on the frontend. After playing around with parameters and the loaders, it now runs correctly, and the arrow for the left page only shows up at a page greater than the first one. 
- Search was added as a function in the backend as well. Stored in Backend/routes/search.js. Works as expected, gave the option to include runs as well, specifically because of the drop down in the sidebar. 
