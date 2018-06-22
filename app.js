var express=require("express");
var app=express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true}));
const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  database : 'shop',
  user: 'aa',
  password: 'divyansh2428@'
});
 
connection.query(
  `create database if not exists shop`,
    function(err, results, fields) {
        if(err)
        console.log(err);
      else{
          console.log("Query Executed");
      console.log(results); // results contains rows returned by server // fields contains extra meta data about results, if available
      }
    }
  );
connection.query(
    `create table if not exists users (id integer primary key auto_increment,name varchar(40),email varchar(40),password varchar(40))`,
      function(err, results, fields) {
          if(err)
          console.log(err);
        else{
            console.log("Query Executed");
        console.log(results); // results contains rows returned by server // fields contains extra meta data about results, if available
        }
      }
    );

    connection.query(
        `create table if not exists items (id integer primary key auto_increment,name varchar(250),price integer,description varchar(250),url varchar(250))`,
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
                console.log("table created");
            console.log(results); // results contains rows returned by server // fields contains extra meta data about results, if available
            }
          }
        );
        connection.query(
            `create table if not exists cart (id integer auto_increment,user_id int,product_id int,primary key(id,user_id,product_id))`,
              function(err, results, fields) {
                  if(err)
                  console.log(err);
                else{
                    console.log("table created for cart");
                console.log(results); // results contains rows returned by server // fields contains extra meta data about results, if available
                }
              }
            );


app.use(express.static("public"));

app.post("/increase",function(req,res){
    console.log("Hello js");
    var user_id=parseInt(req.body.userid);
    var product_id=parseInt(req.body.productid);
    var freq=parseInt(req.body.freq);
    freq++;
    console.log(user_id);
    console.log("product id is " + product_id);
    console.log("Frequency is " + freq);
    connection.query(
        "update cart set frequency='"+freq+"' where user_id='"+user_id+"' and product_id='"+product_id+"'",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             
                //res.redirect("/viewcart");
            }
          }
        );

})
app.get("/placeorder",function(req,res){
    res.render("placeorder.ejs",{})
})
app.post("/decrease",function(req,res){
    console.log("Hello js");
    var user_id=parseInt(req.body.userid);
    var product_id=parseInt(req.body.productid);
    var freq=parseInt(req.body.freq);
    freq--;
    console.log(user_id);
    console.log("product id is " + product_id);
    console.log("Frequency is " + freq);
    if(freq>0){
    connection.query(
        "update cart set frequency='"+freq+"' where user_id='"+user_id+"' and product_id='"+product_id+"'",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             
                //res.redirect("/viewcart");
            }
          }
        );}

        else{

          connection.query(
            "delete from cart where user_id='"+user_id+"' and product_id='"+product_id+"'",
              function(err, results, fields) {
                  if(err)
                  console.log(err);
                else{
                
                 // results contains rows returned by server // fields contains extra meta data about results, if available
                 
                    //res.redirect("/viewcart");
                    console.log("Deleted");
                }
              }
            );
        }

})

app.get("/viewcart",function(req,res){

    var user_id=1;
    connection.query(
        "select * from cart where user_id='"+ user_id +"'",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             console.log("rendering");
             res.render("cart.ejs",{items: results});
            }
          }
        );

})

app.get("/addtocart/:id",function(req,res){

    var user_id=1;
    var product_id=req.params.id;

    connection.query(
        "select * from items where id='"+product_id+"'",
          function(err, result, fields) {
              if(err)
              console.log(err);
            else{
                connection.query(
                    "insert into cart(user_id,product_id,name,price,url,frequency) values('"+user_id+"','"+product_id+"','"+result[0].name+"','"+result[0].price+"','"+result[0].url+"','"+ 1 +"')",
                      function(err, results, fields) {
                          if(err)
                          console.log(err);
                        else{
                        
                        }
                      }
                    );
            }
          }
        );

                
        res.redirect("/viewcart");

})

/*app.get("/addtocart/:id",function(req,res){

    var user_id=1;
    var product_id=req.params.id;

    connection.query(
      "select * from cart where user_id='"+user_id+"' and product_id='"+product_id+"' ",
        function(err, results, fields) {
            if(err)
            console.log(err);
          else{
          
           // results contains rows returned by server // fields contains extra meta data about results, if available
           if(results.length>0){

              var f=results[0].frequency;
              f++;
              connection.query(
                "update cart set frequency='"+f+"' where user_id='"+user_id+"' and product_id='"+product_id+"'",
                  function(err, results, fields) {
                      if(err)
                      console.log(err);
                    else{
                    
                     // results contains rows returned by server // fields contains extra meta data about results, if available
                     
                      res.redirect("/viewcart");
                    }
                  }
                );              


           }
           else
           {
            connection.query(
              "select * from items where id='"+product_id+"'",
                function(err, result, fields) {
                    if(err)
                    console.log(err);
                  else{
                      connection.query(
                          "insert into cart(user_id,product_id,name,price,url,frequency) values('"+user_id+"','"+product_id+"','"+result[0].name+"','"+result[0].price+"','"+result[0].url+"','"+ 1 +"')",
                            function(err, results, fields) {
                                if(err)
                                console.log(err);
                              else{
                                res.redirect('/viewcart');
                              }
                            }
                          );
                  }
                }
              );
           }
           
           
            
          }
        }
      );

   

                
        res.redirect("/viewcart");

})*/

app.post("/search",function(req,res){

    var value=req.body.search;
    connection.query(
        "select * from items where name like '%"+value+"%' ",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             
             res.render("search.ejs",{
                 item:results,
                 value: value
                });
            }
          }
        );

})
app.get("/description/:id",function(req,res){

    var id=req.params.id;
    connection.query(
        "select * from items where id='"+ id +"' ",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             
             res.render("description.ejs",{item:results});
            }
          }
        );
    

})
app.get("/",function(req,res){
    
    connection.query(
        "select * from items",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
            
             // results contains rows returned by server // fields contains extra meta data about results, if available
             
             res.render("index.ejs",{items: results});
            }
          }
        );
    

})

app.get("/admin",function(req,res){
    res.render("admin.ejs",{});

})
app.post("/additem",function(req,res){
    connection.query(
        "insert into items(name,price,description,url) values('"+ req.body.name+"','"+ req.body.price+"','"+req.body.description+"','"+req.body.url+"')",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
                alert("Inserted item in db");
             // results contains rows returned by server // fields contains extra meta data about results, if available

             res.redirect("/admin");
            }
          }
        );

})
app.post("/sign",function(req,res){
    
    connection.query(
        "insert into users(name,email,password) values('"+ req.body.name+"','"+ req.body.email+"','"+req.body.password+"')",
          function(err, results, fields) {
              if(err)
              console.log(err);
            else{
                console.log("Inserted User in db");
             // results contains rows returned by server // fields contains extra meta data about results, if available
             res.send("Inserted");
            }
          }
        );

})


app.post("/loginkaro",function(req,res){

    var email=req.body.email;
    var password=req.body.password;
    if(email=='admin@gmail.com' && password=='admin')
        res.redirect("/admin");

})

app.get("/signup",function(req,res){
    res.render("signup.ejs",{});

})
app.get("/login",function(req,res){
    res.render("login.ejs",{});

})

app.listen(3000,function(req,res){
    console.log("Server started");
})

