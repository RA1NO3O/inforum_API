# inforum_API :shipit:
This is a WebAPI service for [Inforum](https://github.com/RA1NO3O/Inforum) application which is based on the Microsoft SQL Server database.
# Getting start
- execute `npm install`.
- attach database file in your SQL server.
- Create a db.js file at /config, insert following code:
```
module.exports = {
    user: '',
    password: '',
    server: '',
    database: '',
    options: {
        encrypt: true
    }
};
```
> Compare your API server address to your project.
- execute `npm run dev` or `pm2 start .\server.js --watch -i max` to launch.
