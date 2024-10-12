## About Scaffold
It is a node js backend scaffold. Here I use express js, mysql with sequelize ORM. You can see package.json for reference. Here I also use swagger for API tester. Its start with http://localhost:port/api-docs. Here has a example module which has basic crud operation. You can copy and paste module, rename it and add route into routes folder index file. You will get the API route into swagger. Please do necessary action with swagger part like change API route name and other things.

## How to start

- git clone repo
- npm install
- go to config folder (config->config.json)
- change database name from development object
- create database to mysql which is given into development object
- npx sequelize-cli db:migrate --debug
- npx sequelize-cli db:seed:all --debug
- start with "npm run dev"


## How to use this scaffold
- for login authentication here has 2 model (role, user)
- when run migrate and seed, we will get a admin user. (admin@mail.com/admin)
- default register role is user
- if you need to change user criteria for user model, please follow user migration and user model before run the migration
- it is also check user status. default is 1 if 0 can not login with this id
- if need new module, please copy example module and change it for your work criteria
- it has integrated nodemailer setup in global section for send mail

## Sequelize ORM some command

**Step 1:**
```
npx sequelize-cli init
```

**Step 2: creates migration with models**
```
npx sequelize-cli model:generate --name migration-name --attributes name:string
```

**Step 3: do the migrations now (creating tables in database)**
```
npx sequelize-cli db:migrate --debug
```

**step 4 (Optional): drop all tables**
```
npx sequelize-cli db:migrate:undo:all --debug
```

**step 5 (Optional): drop single table**
```
npx sequelize-cli db:migrate:undo --name migration_file_name.js
```

**step 6 (Optional): migrate single table**
```
npx sequelize-cli db:migrate --name migration_file_name.js
```

**step 7: create seeders (initial data for database tables)**
```
npx sequelize-cli seed:generate --name seeder-name
```

**step 8: push seeders data to database**
```
npx sequelize-cli db:seed:all --debug
```

**step 9 (Optional): drop all seeders data**
```
npx sequelize-cli db:seed:undo:all --debug
```