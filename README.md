## Setup a .env file
For this to work, you need a .env file. Make a new file in the base directory after cloning, create a .env file which contains the following

```
#mongodb details
mongooseUri=LINK_TO_YOUR_MONGODB_URI

# email connection details
contactEmail=EMAIL_ACCOUNT
contactPassword=PASSWORD_FOR_EMAIL
contactHost=SMTP_HOST.com
```

You will need to setup a webmail account on a server. You can do this easily through services like Plesk (if you have that installed on your server). There are other methods too. Read up on [Node Mailer](https://nodemailer.com/about/) for more details.

# Installing Modules
Don't forget to run `npm install` after cloning so that all node_modules will be added to your project.

# Running the server
You will have to run both files for this to work. You can start up both files with the pm2 node package.
- `./index.js` will have the two routes for subscriptions and unsubscribing, Letting us control the data in the database
- `./daemons/subscription.daemon.js` will send emails at regular intervals to users

To start up both, run the following two commands:
```
pm2 start ./daemons/subscription.daemon.js
pm2 start index.js
```
