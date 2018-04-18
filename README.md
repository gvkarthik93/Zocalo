


# Zocalo
Open source platform for collaboration among students and professors

# Test on Local Machine
1. Using terminal, navigate to Zocalo folder
2. To create a database file with data, navigate to database folder by
    `$cd database`
   and do
    `$./create_db`
3. Nagivate back to project directory by `$cd ..`
   and use `$pip install -r requirements.txt` to install all the packages required for the project.
4. Start the server
    `$python appserver.py`
5. If the server starts correctly, it should show
    `Server Running on Port:  8002`
6. Open browser, go to [http://localhost:8002/](http://localhost:8002/)
7. We've create a test login credential:
    - Username:SihanC
    - Password:sc123

<hr>


<h3>Deployment</h3>
<ol>
  <li>Checkout the project from github `https://github.com/gvkarthik93/Zocalo.git`</li>
  <li>Using terminal, navigate to Zocalo folder</li>
  <li>Use `$pip3 install -r requirements.txt` to install all the packages required for the project.</li>
  <li>Nagivate back to project directory by
    `$cd ..` and start the server
    `$python appserver.py`</li>
  <li>If the server starts correctly, it should show
    `Server Running on Port:  8002`</li>
  <li>Open browser, go to [http://localhost:8002/](http://localhost:8002/) to test the server</li>
  <li>Open `https://www.heroku.com/` and signup with a new account credentials.</li>
  <li>Install heroku CLI from `https://www.heroku.com/`</li>
  <li>Now on the terminal run the command `heroku create` (Note that the command should run in the project directory)</li>
  <li>After running the above command, push the code from git repository to heroku for creating deployment packet using the following command: `git push heroku master`</li>
  <li>If you've already created an app on heroku, then run the following command to connect to the app: `heroku git:remote -a project-name`</li>
  <li>After pushing the code to heroku, heroku creates a deployment packet. Now to run the server on heroku, run the following command: `heroku start`</li>
  <li>The above command will start the server on heroku and the application is now open on internet.</li>
</ol>

