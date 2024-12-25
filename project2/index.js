let express=require("express")
let app=express();
let port=8080;


let path=require("path");
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));

let methodOverride = require('method-override');
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));



let  { faker } = require('@faker-js/faker');

let mysql      = require('mysql2');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Nitin@123',
  database : 'company'
});
let { v4: uuidv4 } = require('uuid');
let createRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ]
}

// let q='insert into user (id,username,email,password) values ?';
// let data=[];
// for(let i=0;i<=99;i++){
//     data.push(createRandomUser())
// };

// try{
//     connection.query(q,(err,res)=>{
//         if(err) throw err;
//         console.log(res)
//     })
// }catch(err){
//     console.log(err)
// }

//                                                 HOME>>>>PAGE

app.get("/user/data",(req,res)=>{

    let q='select count(*) from user';
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let data=result[0]["count(*)"]
            console.log(data)
            res.render("data.ejs",{data})
        })
    }catch(err){
        console.log(err)
        res.send("something went wrong")
    }
    
  })

  //                                                USER>>>>PAGE
  app.get('/user',(req,res)=>{
    let q= 'select * from user';
    try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            console.log(results)
            // res.render("home.ejs",{result})
            res.render("user.ejs",{results})
        })
    }catch(err){
        console.log(err)
        res.send("something went wrong")
    }

  })

  //                                               EDIT>>>>PAGE
    app.get("/user/:id/edit",(req,res)=>{
        let {id}=req.params;
        let q=`select * from user where id ='${id}'`;
        try{
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let data=result[0];
                res.render("edit.ejs",{data})
              
            })
        }catch(err){
            console.log(err)
            res.send("something went wrong")
        }

    })

    //                                               PATCH>>>>PAGE

    app.patch("/user/:id",(req,res)=>{
        let {id}=req.params;
        let{username:newusername,password:newpassword}=req.body;
        let q=`select * from user where id ='${id}'`;
        try{
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let data=result[0]
                if(newpassword!=data.password){
                    res.send("wrong password")
                }else{
                    let q2=`update user set username='${newusername}' where id='${id}'`;
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        res.redirect("/user")
                    })
                }
            })
        }catch(err){
            console.log(err)
            res.send("something went wrong")
        }

    })

    //                                              CREATE>>>>PAGE
    app.get("/user/new",(req,res)=>{
        res.render("create.ejs")
    })


    app.post('/user',(req,res)=>{
        let q='insert into user (id,username,email,password) values ?';
        let data=[];
        let id=uuidv4();
        let {username,email,password}=req.body;
        data.push([id,username,email,password]);
        try{
            connection.query(q,[data],(err,result)=>{
                if(err) throw err;
                res.redirect("/user")
              
            })
        }catch(err){
            console.log(err)
            res.send("something went wrong")
        }

    })



    //                                             DELETE>>>>PAGE
    app.delete("/user/:id",(req,res)=>{
        let {id}=req.params;
        let q=`delete from user where id='${id}'`;
        try{
            connection.query(q,(err,result)=>{
                if(err) throw err;
                res.redirect("/user")
              
            })
        }catch(err){
            console.log(err)
            res.send("something went wrong")
        }

    })
   
 

//                                         SERVER>>>>START

  app.listen(port,()=>{
    console.log(`server is running on ${port}`)
  })

 