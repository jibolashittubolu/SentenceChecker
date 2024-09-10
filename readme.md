Clone the repository. Please note that ----

- The 3 folders contained within the repository are all required
- The clientnext server is the client application
- The serverexpress is the proxy server
- The serverfastapi is the upstream server

- To utilize the application, you are required to start an instance of each so that they can connect with each other

- The documentation for starting up each server/app is contained within the readme.md of their respective folders


###### The summary is also explained below


# clientnext
###### DOWNLOAD AND INSTALL Node.js ON YOUR MACHINE (if Node.js does not exist) from nodejs.org or use the installer [official Node.js](https://nodejs.org/en/download/prebuilt-installer)

###### CHECK THAT Node.js IS INSTALLED by typing and running "node --version" in your cli

###### open your machine's CLI terminal and navigate to the directory "clientnext" i.e where this file exists
- type and execute "npm install" to install the project's dependencies


###### SET UP ENVIRONMENTAL VARIABLES
- locate the file "/clientnext/.env.example" then duplicate the file .env.example within the same directory. Note .env.example should now have a duplicate
- rename the duplicate file to ".env"
- open ".env" and fill in/complete the secret variables with your own variables/secrets
- ensure that the NEXT_PUBLIC_PORT variable is provided as 8002

###### FINAL EXECUTION : run the below in your CLI terminal
- run "npm run dev" to launch the web app in development mode



###### POTENTIAL ISSUES
- Use Node.js v18.20.4 LTS or lower  from [official Node.js](https://nodejs.org/en/download/prebuilt-installer) if you run into issues with node
- Open your terminal in administrator mode/privileges if you run into permission issue
- Reinstall and Restart the process if you believe there is a corruption or mismatch somewhere




# serverexpress
###### DOWNLOAD AND INSTALL Node.js ON YOUR MACHINE (if Node.js does not exist) from nodejs.org or use the installer [official Node.js](https://nodejs.org/en/download/prebuilt-installer)

###### CHECK THAT Node.js IS INSTALLED by typing and running "node --version" in your cli

###### open your machine's CLI terminal and navigate to the directory "serverexpress" i.e where this file exists
- type and execute "npm install" to install the project's dependencies


###### SET UP ENVIRONMENTAL VARIABLES
- locate the file "/serverexpress/.env.example" then duplicate the file .env.exaple within the same directory. Note .env.example should now have a duplicate
- rename the duplicate file to ".env"
- open ".env" and fill in/complete the secret variables with your own variables/secrets
- ensure that the PORT variable is provided as 8001

###### FINAL EXECUTION : run the below in your terminal CLI
- run "npm run ts-nodemon" to launch the server in development mode


###### POTENTIAL ISSUES
- Use Node.js v18.20.4 LTS or lower  from [official Node.js](https://nodejs.org/en/download/prebuilt-installer) if you run into issues with node
- Open your terminal in administrator mode/privileges if you run into permission issue
- Reinstall and Restart the process if you believe there is a corruption or mismatch somewhere



# serverfastapi
###### DOWNLOAD AND INSTALL PYTHON ON YOUR MACHINE (if python does not exist) from python.org or install python 3.7.9 from [official python 3.7.9](https://www.python.org/downloads/release/python-379/)

###### open your machine's CLI terminal and navigate to the directory serverfastapi i.e where this file exists using "cd serverfastapi"
- create a virtual environment in this folder by executing "python -m venv ." in your terminal

###### ACTIVATE THE VIRTUAL ENVIRONMENT by executing
- If you are using Windows machine cmd CLI terminal type and execute "source ./Scripts/activate"
- If you are using Windows - power shell CLI type and execute "source ./Scripts/Activate.ps1"
- If you are using Linux/MacOs machine CLI type execute "source ./bin/activate"
- type and execute "cd ../" to go back to the /serverfastapi directory


###### CHECK THAT PYTHON WAS CORRECTLY INSTALLED IN THE VIRTUAL ENVIRONMENT by typing and running "python --version" in your CLI terminal


###### SET UP ENVIRONMENTAL VARIABLES
- locate the file /serverfastapi/app/.env.example then duplicate the file env.example within the same directory. .env.example should now have a duplicate
- rename the duplicate file to ".env"
- open ".env" and fill in/complete the secret variables with your own variables/secrets
- ensure that the PORT variable is provided as 8000


###### FINAL EXECUTIONS : run the below code one after the other in your CLI Terminal
- run "python -m pip install --upgrade pip"
- run "pip install -r requirements.txt" to install dependencies
- run "cd app" to navigate to the app directory contained in /serverfastapi/app
- run "uvicorn main:app --reload" to launch the server in development mode



###### POTENTIAL ISSUES
- Use Python 3.7.9 from [official python 3.7.9](https://www.python.org/downloads/release/python-379/) if you run into issues with Python
- Open your terminal in administrator mode/privileges if you run into permission issue
- Reinstall and Restart the process if you believe there is a corruption or mismatch somewhere
