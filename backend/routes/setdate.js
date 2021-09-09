var express = require('express');
var router = express.Router();
var db = require('../config/db');

router.get("/",(req,res)=>{
    db.query("SELECT * FROM datestudy",(err,result)=>{
       if(err) throw(err);
       else{
           res.send(result)
       } 
    });
})

router.get("/getNow",(req,res)=>{
    

    db.query("SELECT * FROM datestudy WHERE status = 1",null,(err,result)=>{
        if (err) throw(err); 
        if (!result[0]){
            res.send("result = null")
        }
        else{
            res.send(result);
            console.log(result[0].status)
        }
    })
})




router.get('/year',(req, res) => {
    db.query("SELECT DISTINCT year FROM datestudy ORDER BY year", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

router.get('/term',(req, res) => {
    db.query("SELECT DISTINCT term FROM datestudy", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

router.post("/setDateStudy",(req,res)=>{
    let year = req.body.year;
    let term = req.body.term;
    let openDate = req.body.openDate;
    let closeDate = req.body.closeDate;
    let status = 0;
    let NewOpenDate = new Date(new Date(openDate).getTime() + 1000 * 60 * 60 * 7)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
    let NewCloseDate = new Date(new Date(closeDate).getTime() + 1000 * 60 * 60 * 7)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

    console.log(NewOpenDate,NewCloseDate)

    let sqlcommand = `INSERT INTO datestudy (year,term,opendate,closedate,status) VALUE (?,?,?,?,?)`;
    let dateItems = [year,term,NewOpenDate,NewCloseDate,status];
    console.log("date item: ",dateItems);
    db.query(sqlcommand,dateItems,(err,result)=>{
        if (err) throw(err); 
        else{
            res.send("set date study success!!!")
        }
    })
})

router.post("/setDateStop",(req,res)=>{
    let title = req.body.title;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;


    let NewStartDate = new Date(new Date(startDate).getTime() + 1000 * 60 * 60 * 7)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
    let NewEndDate = new Date(new Date(endDate).getTime() + 1000 * 60 * 60 * 7)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
    let sqlcommand = `INSERT INTO datestop (title,startDate,endDate) VALUE (?,?,?)`;
    let dateItems = [title,NewStartDate,NewEndDate];
    db.query(sqlcommand,dateItems,(err,result)=>{
        if (err) throw(err); 
        else{
            res.send("set date stop success!!!")
        }
    })
})

router.post("/setNow",(req,res)=>{
    let year = req.body.year;
    let term = req.body.term;
    let sqlcommand = `UPDATE datestudy SET status=1 WHERE year = ? AND term = ?`;
    let dateItems = [year,term];

    db.query("SELECT * FROM datestudy WHERE status = 1",(err,result)=>{
        if (err) throw(err); 
        else if (!result[0]){
            
            db.query(sqlcommand,dateItems,(err,result)=>{
                if (err) throw(err); 
                else{
                    res.send("ตั้งค่าปีการศึกษาและภาคเรียนปัจจุบันสำเร็จ");
                    console.log("ตั้งค่าปีการศึกษาและภาคเรียนปัจจุบันสำเร็จ")
                }
            })
        }
        else{
            db.query(`UPDATE datestudy SET status=0 WHERE id = ?`,result[0].id,(err,result)=>{
                if (err) throw(err); 
                else{
                    db.query(sqlcommand,dateItems,(err,result)=>{
                        if (err) throw(err); 
                        else{
                            res.send("ตั้งค่าปีการศึกษาและภาคเรียนปัจจุบันสำเร็จ");
                            console.log("ตั้งค่าปีการศึกษาและภาคเรียนปัจจุบันสำเร็จ")
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;