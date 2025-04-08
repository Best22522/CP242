# expressjs-webserver
Expressjs Application
1. At command prompt, create a folder expressjs-webserver <br>
	$ mkdir expressjs-[your id]
2. Change folder to the newly created folder <br>
        $ cd expressjs-[your id]
3. Initialize nodejs (this command will create package.json) <br>
        $ npm init -y
4. Open folder using vscode <br>
        $ code .
5. Install dependencies (libraries) <br>
        $ npm install -dev body-parser ejs express
5. In package.json, you should see dependencies (libraries) section with the libraries we install <br>  
6. In package.json, Add one new line into the scripts section to look like below (don't forget the ',')
   <pre>
     "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start" : "node app.js"
     },
   </pre><br>
7. Copy contents from the project on github to yours. **Don't** overwrite existing files (Don't copy package.json and package-lock.json)
8. Run nodejs application from the command prompt <br>
        $ npm start  (or you can run $ node app.js)
9. Open browser http://localhost:3000 
10. Try interact with the web page
11. Use ctrl+c to stop node application
<br>

**Exercise** (You need to restart **npm start** when you modify your code)
1. Currently, webpage displays a note without showing which part is the subject and which part is the content.  Modify code so that it displays (after your have posted). <b> DO NOT</b> modify the form
   <pre>
    <b>Subject:</b>  FirstTitle
    <b>Data:</b>  This is my first content
   </pre>
2. Screen capture https://cs.science.swu.ac.th/ and add the picture to bottom of the page
3. Currently, when you click View Tags, it returns an empty tag. Modify code so that it is not empty, but returns **{"tags":[0]}** in the first time. For the second time add next number. E.g, the result after 4 clicks would be  **{"tags":[0,1,2,3]}**

4. Currently, when you click View Category, it returns an error. Modify code so that it return **{"categories":['unknown']}** if the content is not belong to any category.
