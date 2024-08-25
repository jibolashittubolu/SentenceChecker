# DOWNLOAD AND INSTALL PYTHON ON YOUR MACHINE (if python does not exist) from python.org or install python 3.7.9 from [official python 3.7.9](https://www.python.org/downloads/release/python-379/)

# open your machine's CLI terminal and navigate to the directory serverfastapi i.e where this file exists using "cd serverfastapi"
# create a virtual environment in this folder by executing "python -m venv ." in your terminal

# ACTIVATE THE VIRTUAL ENVIRONMENT by executing
# For Windows machine cmd CLI type and execute "source ./Scripts/activate"
# For Windows machine power shell CLI type and execute "source ./Scripts/Activate.ps1"
# For Linux/MacOs machine CLI type execute "source ./bin/activate"
# type and execute "cd ../" to go back to the /serverfastapi directory


# CHECK THAT PYTHON WAS CORRECTLY INSTALLED IN THE VIRTUAL ENVIRONMENT by typing and running "python --version" in your CLI terminal


# SET UP ENVIRONMENTAL VARIABLES
# locate the file /serverfastapi/app/.env.example then duplicate the file env.example within the same directory. .env.example should now have a duplicate
# rename the duplicate file to ".env"
# open ".env" and fill in/complete the secret variables with your own variables/secrets
# ensure that the PORT variable is provided as 8000


# FINAL EXECUTIONS : run the below code one after the other in your CLI Terminal
# run "python -m pip install --upgrade pip"
# run "pip install -r requirements.txt" to install dependencies
# run "cd app" to navigate to the app directory contained in /serverfastapi/app
# run "uvicorn main:app --reload" to launch the server in development mode



# POTENTIAL ISSUES
# Use Python 3.7.9 from [official python 3.7.9](https://www.python.org/downloads/release/python-379/) if you run into issues with Python
# Open your terminal in administrator mode/privileges if you run into permission issue
# Reinstall and Restart the process if you believe there is a corruption or mismatch somewhere