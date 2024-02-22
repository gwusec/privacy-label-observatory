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

# Notes for 2/16
- So now there are more search params. What that means is that on the URL, you can tell that there's an ID, and upon each app getting clicked, the search param will update to have the new app ID. This will make it easier for the loader to update the ID, because it will be watching the search params. 
- The view page is pretty bare bones right now, it loads the first app in the list automatically. Still need to work out the kinks. Might need to add views that have the most popular apps to really show the flexibility of the app. 

# Notes for 2/19
- Haven't had time to do a lot of work because of midterms. But idea.
- Struggled to figure out a suitable way to load apps. However, idea. Have a sample id route loaded in immediately (maybe U Haul or something of the sort) and make that part of the URL. After that, once a user selects an app, replace it. That way, it'll make the logic easier for selecting an app

# Notes for 2/21
- Finally figured out part of the problem. I don't have a route for app ID in the backend, I was calling search, which has nothing to do with what I'm doing right now.
- Also of note, I can export the loader and call the loader upon a button request, which will perform the action to update in the other page. 
- Will need to clean a lot of this code base because after slamming my keyboard, I finally figured out what was going wrong. 