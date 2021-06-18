# task-manager-api (made with Nodejs)
This a rest API of a Task-manager app which allows users to **signup/login, logout, upload a profile picture, delete their account and create a to-do list of tasks.** The API allows user to sort tasks in the order they were created and whether or not they are done or yet to be done. The API also **sends out a welcome email everytime a new user signs up** and **sends a Goodbye email asking them for feedback** when a user deletes their account.
## Features
* CRUD operations for Users
* CRUD operations of tasks for every user
* Authentication allowing login/signup/dlete account for users using JSON Web Tokens(JWT)
* Validation and Error handling
* File upload (profile picture for the users)

### Tools used
* **MongoDB**   - NoSQL databse used to store the user credentials and their task list
* **Postman**   - For making API calls
* **SendGrid**  - For sending welcome/goodbye emails to users
* **MongoDB Compass and Robo3T** - GUIs to view the databases 
#### Postman Collection
If you are using Postman, you can import the file Task App.postman_collection.json

