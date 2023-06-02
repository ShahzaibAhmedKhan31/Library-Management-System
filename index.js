var express=require('express');
var app=express();
var mysql= require('mysql');
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));


app.set('view engine','ejs')
var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mydb'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("connection successfull...")
});

// Globlal variables

var Useremail = new Array();
var Username = new Array();
var Password = new Array();
var type = new Array();
var id_user = new Array();
var CurrentUsername="";
var CurrentUsertype="";
var CurrentUserid=0;

// Login page access

app.get('/', function(req,res){
    var sql=`select * from add_students`;
    conn.query(sql,function(err,results){
        if(err){ throw err;}
        for (let i = 0; i < results.length; i++) {
        Useremail[i]=results[i].email;
        Username[i]=results[i].name;    
        Password[i]=results[i].password;
        id_user[i]=results[i].id;
        type[i]=results[i].type;
    }
        console.log(Useremail);
        console.log(Password);
        console.log(id_user);
        console.log(type);
        res.render('login');
    });
});

app.get('/login',function(req,res){
    res.render('login'); 
   });

// Admin Login

app.post('/admin',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    if(email=="shahzaib_pakistan@hotmail.com" && password=="shahzee321"){
        res.render('admin');
    }
    else{
        res.render('login');
    }
});

app.get('/admin',function(req,res){
    res.render('admin'); 
   });
   app.post('/admin',function(req,res){
    res.render('admin'); 
   });

// User Login
app.post('/user',function(req,res){
    var email=req.body.emailUser;
    var password=req.body.passwordUser;

    for (let i = 0; i < Useremail.length; i++) {
    if(email==Useremail[i] && password==Password[i]){
        CurrentUserid=id_user[i];
        CurrentUsertype=type[i];
        CurrentUsername=Username[i];
        console.log(CurrentUserid);
        res.render('user');
    }
}
});

/*
app.post('/insert',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var sql=`insert into user(fullname,email,password) values('${name}','${email}','${password}')`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.send("<h1>data sent...</h1>")
    });
}); 
*/

// add book

app.get('/addbook',function(req,res){
    res.render('addbook'); 
   });

app.post('/addbook',function(req,res){
    var Bname=req.body.Bname;
    var Book_d=req.body.bookdetail;
    var Book_a=req.body.bookauthor;
    var Book_p=req.body.bookpub;
    var Book_Pr=req.body.bookprice;
    var Book_q=req.body.bookquantity;
    var Book_b=req.body.branch;
    var Book_ava=Book_b;
    
    var sql=`insert into addbook(Book_name,Book_detail,Author,Publication,Price,Quantity,Branch,Book_available) values('${Bname}','${Book_d}','${Book_a}','${Book_p}','${Book_Pr}','${Book_q}','${Book_b}','${Book_ava}')`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('admin');
    });
}); 

// add students

app.get('/addstudents',function(req,res){
    res.render('addstudents'); 
   });   

app.post('/addstudents',function(req,res){
    var name=req.body.name;
    var password=req.body.password;
    var email=req.body.email;
    var type=req.body.type;
    var sql=`insert into add_students(name,password,email,type) values('${name}','${password}','${email}','${type}')`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('admin');
    });
}); 

app.get('/reportbook',function(req,res){
    var sql = "select *  from add_students";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('Bookreport',{add_students:results}); 
    });
});

app.get('/delete/:id',function(req,res){
    var id=req.params.id;
    var sql=`delete from add_students where id='${id}'`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/studentreport'); 
    });
});

/*
app.get('/show',function(req,res){
    var sql = "select *  from user";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('show',{user:results}); 
    });
});
*/

//Student report

app.get('/studentreport',function(req,res){
    var sql = "select *  from add_students";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('studentreport',{add_students:results}); 
    });
});

app.get('/edit/:id', function(req,res){
    var  id =req.params.id;
    var sql=`Select * from add_students where id="${id}"`;

    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('edit',{add_students:results});
    });
});

app.post('/update/:id', function(req,res){
    var  id =req.params.id;
    var name=req.body.name;
    var password=req.body.password;
    var email=req.body.email;
    var type=req.body.type;
    var sql=`update add_students set name = '${name}', password = '${password}', email = '${email}', type = '${type}' where id ='${id}'`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/studentreport');  
    });
});

// request book

app.get('/requestbook',function(req,res){
    var sql = "select *  from addbook";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('requestbook',{addbook:results}); 
    });
});

app.post('/Bookrequest/:Book_name', function(req,res){
    var Bookname= req.params.Book_name;
    var sql=`INSERT into request_book (User_id,User_name,Book_name,User_type) VALUES('${CurrentUserid}','${CurrentUsername}','${Bookname}','${CurrentUsertype}')`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/user');
    });
});

app.get('/bookrequest', function(req,res){
    var  id =req.params.Book_id;
    var sql=`Select * from request_book`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('bookrequest',{request_book:results});
    });
});


app.get('/deleterequest/:id',function(req,res){
    var id=req.params.id;
    var sql=`delete from request_book where id='${id}'`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/admin'); 
    });
});

// My account

app.get('/Myaccount',function(req,res){
    var sql = `select *  from add_students where id="${CurrentUserid}"`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('Myaccount',{add_students:results}); 
    });
});

// Book report

app.get('/Bookreport',function(req,res){
    var sql = "select *  from addbook";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('Bookreport',{addbook:results}); 
    });
});

app.get('/Bookedit/:Book_id', function(req,res){
    var  id =req.params.Book_id;
    var sql=`Select * from addbook where Book_id="${id}"`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('Bookedit',{addbook:results});
    });
});


app.get('/deletebook/:Book_id',function(req,res){
    var id=req.params.Book_id;
    var sql=`delete from addbook where Book_id='${id}'`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/Bookreport'); 
    });
});

app.post('/Bookupdate/:Book_id', function(req,res){
    var  id =req.params.Book_id;
    var Bname=req.body.Bname;
    var Book_d=req.body.bookdetail;
    var Book_a=req.body.bookauthor;
    var Book_p=req.body.bookpub;
    var Book_Pr=req.body.bookprice;
    var Book_q=req.body.bookquantity;
    var Book_b=req.body.branch;
    var Book_ava=req.body.bookava;
    var Book_rent=req.body.bookrent;
    var sql=`update addbook set Book_name = '${Bname}', Book_detail = '${Book_d}', Author = '${Book_a}', Publication = '${Book_p}' , Price = '${Book_Pr}', Quantity = '${Book_q}', Branch = '${Book_b}' , Book_available = '${Book_ava}', Book_rent = '${Book_rent}' where Book_id ='${id}'`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/admin');  
    });
});

// User Book records

app.get('/Userbookreport',function(req,res){
    var sql = `select *  from issuebookrecord where user_id="${CurrentUserid}"`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('Userbookreport',{issuebookrecord:results}); 
    });
});

app.get('/bookrequestUser/:Book_name', function(req,res){
    var  Book_name =req.params.Book_name;
    var sql=`Select * from addbook where Book_name="${Book_name}"`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('bookrequestUser',{addbook:results});
    });
});

// Issue Book To the User

app.get('/issuebook', function (request, response) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    console.log(year + "-" + month + "-" + date);
    conn.query('SELECT * FROM addbook', function(err, result1) {
        if (err) {
            throw err;
        } else {
            conn.query('SELECT * FROM add_students', function(err, result2) {
                if (err) {
                    throw err;
                } else { 
                    response.render('issuebook', {
                        results1: result1,
                        results2: result2
                    }); 
                }
            });
        }
    });
});

app.post('/issuebook',function(req,res){
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    var Bname=req.body.type;
    var user=req.body.user;
    let user_id = user.substring(0, 1);
    console.log(user);

    var days=req.body.days;

    let issue_date = (year + "-" + month + "-" + day);
    var issue_return = (year + "-" + month + "-" + (parseInt(day) + parseInt(days)));
   var sql=`insert into issuebookrecord(user_id,issuebook_name,issue_days,issue_date,issue_return) values('${user}','${Bname}','${days}','${issue_date}','${issue_return}')`; 
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/Bookreport');
    });
});

// Issue Book records

app.get('/issuebookrecord',function(req,res){
    var sql = "select *  from issuebookrecord";
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.render('issuebookrecord',{issuebookrecord:results}); 
    });
});

app.get('/deleteissuerecord/:id',function(req,res){
    var id=req.params.id;
    var sql=`delete from issuebookrecord where id='${id}'`;
    conn.query(sql,function(err,results){
        if(err) throw err;
        res.redirect('/issuebookrecord'); 
    });
});



   app.get('/user',function(req,res){
    res.render('user');
   });
   
var server= app.listen(4000,function(){
    console.log("App running on 4000...")
});
