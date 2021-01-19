const connection = require("../configs/db")

exports.cekUser = (email) =>{
    return new Promise((resolve,reject) => {
        connection.query('select * from users where email = ?', email,(error,results)=> {
            if(!error){
                resolve(results)
            }else{
                reject(error)
            }
        } )
    })
}