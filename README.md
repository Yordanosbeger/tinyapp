### TinyApp Project

A full stack web app built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Snake"](images/snake.png)

!["Snake Name"](images/snake_name.png)



## Dependencies
- Node.js
- Express
- EJS
- bcrypt
- cookie-session

## Usage

1. Visit the application in your web browser.
2. Create a new item by clicking the "New Item" button.

## Getting Started

1. Install all dependencies (using the `npm install` command).
2. Run the development web server using the `node express_server.js` command.
3. Go to [localhost:8080](http://localhost:8080) in your browser.

To start the project, run the following command:

```bash

npm start

To test the project, run the following command: 

``` bash

 npm test

 ## How to use TinyApp
 #Register/Login
 Users must be logged in to creat new links, view them, and edit them.
click Register button , put on it email and password to register.

##Creat New Links
Either click Creat a New Short Link in My URLs page,or Creat New URL you want to shorten.
##Edit or Delete Short Links 
. In My URLs,you can delet any link you want.
. You can also click Edit, and then enter a new   long URL to update your link.It will be the same short URL, but redirect to an updated long URL.

## User Short Link
.The path to use any short link is /u/:shortLink.This will redirect you the long URL.
.You can reach this by clicking edit on the a link corresponding to short URL.








