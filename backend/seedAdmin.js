//backend/seedAdmin.js
require('dotenv').config();
constconnectDB=require('./config/db');
constUser =require('./models/User');
connectDB().then(async()=>{
constexists=awaitUser.findOne({email: 'admin@thefolio.com' });
if(exists){
console.log('Adminaccountalready exists.');
process.exit();
}
awaitUser.create({
name: 'TheFolioAdmin',
email: 'admin@thefolio.com',
password:'Admin@1234',
role: 'admin',
});
console.log('Adminaccountcreatedsuccessfully!');
console.log('Email: admin@thefolio.com');
console.log('Password:Admin@1234');
process.exit();
});