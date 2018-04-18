# Zocalo
Open source platform for collaboration among students and professors

# Test on Local Machine
1. Using terminal, navigate to Zocalo folder
2. If you have Zocalo.db file in the folder, do
    `$rm Zocalo.db`
3. To create a database file with data, navigate to database folder by
    `$cd database`
   and do
    `$./create_db`
4. Nagivate back to project directory by
    `$cd ..`
   and start the server
    `$python appserver.py`
5. Use `$pip install -r requirements.txt` to install python packages
6. If the server starts correctly, it should show
    `Server Running on Port:  8002`
7. Open browser, go to [http://localhost:8002/](http://localhost:8002/)
8. We've create a test login credential:
    - Username:SihanC
    - Password:sc123
