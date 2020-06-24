'use strict';

var mongoose = require('mongoose'),
//fcm
FCM = require('fcm-node'),

serverKey = 'AAAAPtcN9yU:APA91bFl66DJFheMN3W5X8l426jQApATz8c6tE4IN3t73DuKnm8IXJ3kC2o8_zTOPoHSXcanf8sTgevLYUTGhuyOZ6w80c0InLl3LERfQMMRIDt4i9Ylimn42EClkWKkGDmGzeL3z-t7',
arraySort = require('array-sort'),
fcm = new FCM(serverKey),
//fcm
errors= ['',null,undefined,'null','undefined',0],
User = mongoose.model('User'),
Match = mongoose.model('Match'),
Joinmatch = mongoose.model('Joinmatch'),
Followers = mongoose.model('Followers'),
paymentToOwner = mongoose.model('paymentToOwner'),
Confirmation = mongoose.model('Confirmation'),
vote = mongoose.model('votes'),
team = mongoose.model('team'),
teamInvitation = mongoose.model('teamInvitation'),
customerId = mongoose.model('customerId'),
Notifications = mongoose.model('Notifications'),
RequestField = mongoose.model('RequestField'),
MatchResults = mongoose.model('MatchResults'),
requestFieldPayments = mongoose.model('requestFieldPayments'),
bookingPayment = mongoose.model('bookingPayment'),
Otp =  mongoose.model('Otp'),
Addfav =  mongoose.model('Addfav'),
Player =  mongoose.model('Player'),
path = require('path'),
Property = mongoose.model('Property'),
NodeGeocoder = require('node-geocoder'),
fs = require('fs');
var sg = require('sendgrid')('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');
//----hashing password
var passwordHash = require('password-hash');
//----
var otpGenerator = require('otp-generator');
var multer  = require('multer');
var stripe = require('stripe')('sk_test_oDnJiczBF5W5NtF4gphJ2YPT00A5wasqym');


var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/p_pics/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

//multer for property
var uploadTeamPic = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/team/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

const cron = require("node-cron");

//chron player location

  cron.schedule("* * * * *", function() {
    console.log('postion chrone=================================================');

var d = new Date(); 
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
 if(date<10){
   date= '0'+date;
 }
 if(month<10){
   month= '0'+month;
 }
 var hours= d.getHours();
 var mins =  d.getMinutes();
 var stime= hours+':'+mins;
var dateStr = year + "-" + month + "-" + date;
              
            Match.find({date:dateStr,status:1, stime:{$gt:String(stime)}, is_near:0}, function(err, match) { 
          
            if(match.length!=0){

              for(let key of match){
               Joinmatch.findOne({match_id:key._id},function(err, joinExists){
                  if(joinExists!=null){

                    var players= joinExists.player_id

                    if(players.length!=0){
                       for(let key1 of players){


                            Property.findOne({owner_id:key.owner_id},function(err, propertyRes){
               

               Player.findOne({_id:key1,cords: {
                                         $near: {
                                           $minDistance: 0,
                                           $maxDistance:5*1.609*1000,
                                           $geometry: {
                                             type: "Point",
                                             coordinates: [Number(propertyRes.lng), Number(propertyRes.lat)]
                                           }
                                        }
                                      }
                                    },function(err, playerExists){

                                      if(playerExists!=null){

                                        User.findOne({_id:key.owner_id},function(err, ownerDetails){

                                                      if(ownerDetails!=null){


                                                           var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                                                    to: ownerDetails.uid, 
                                                                    collapse_key: 'your_collapse_key',
                                                                    
                                                                    notification: {
                                                                        title: 'A Player just to reach', 
                                                                        body: playerExists.fname+' is less than 5 miles away from property'
                                                                    },      
                                                                   
                                                                };
                                                                
                                                                fcm.send(message, function(err, response){
                                                                  console.log(err);
                                                                    if (err) {
                                                                        console.log("Something has gone wrong!");
                                                                    } else {
                                                                        console.log("Successfully sent with response: ", response);
                                                                    }
                                                                });
                                                                                                                     


                                                      }
                                     

                                        })

                     



                                      }
                    



                                    });

               
                
               });



                                     

                       }

                    }
                  }


               });


               Match.update({_id: key._id} , {$set: {is_near:1}}, {new:  true}, function(){


               });


              }          

            }



            })


  });



exports.location_update = function(req, res) {

var data=[];

if(errors.indexOf(req.body.lat)==-1){

              data['cords']= {
              type: "Point",
              coordinates: [req.body.lng,req.body.lat],
              }

            }

          Player.update({_id:req.body._id},{$set:data},{new:true},function(err,result){      
          if(result!=null){
              res.send({
                  msg: 'updated',
                  status: 1,
                  data: result
              });            
          }else{
                 res.send({
                  msg: 'error',
                  status: 0,
                  data: null
              });

          } 

              }); 
    

}


exports.p_signup = function(req, res) {
 
      const data= {
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.pnumber,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      dob: req.body.dob,
      position:req.body.position,
      address:req.body.address,
      status:5

    }

     if(errors.indexOf(req.body.uid)==-1){

              Player.update({uid:req.body.uid},{$set:{uid:0}},{new:true},function(){             

              }); 

              data['uid']= req.body.uid
            }


        if(errors.indexOf(req.body.lat)==-1){
              data['cords']= {
              type: "Point",
              coordinates: [req.body.lng,req.body.lat],
            }
            }

     



          if(errors.indexOf(req.body.lat)==-1){
              data['cords']= {
              type: "Point",
              coordinates: [req.body.lng,req.body.lat],
            }
            }
            

  //check email availability
    Player.findOne({email: req.body.email}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 0,
          data: null
    });
      }else{
        savenewuser();
      }
     
    });    

      function savenewuser(){
        var new_user = new Player(data);
              new_user.save(function(err, user) {
                console.log(err);
              if (user == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              }else{
              
                var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/confirm-email.html', 'utf8');
                let email_content = ''
                readStream.on('data', function(chunk) {
                  email_content += chunk;
                }).on('end', function() {
                  var helper = require('sendgrid').mail;
                  var fromEmail = new helper.Email('noreply@football.com');
                  var toEmail = new helper.Email(req.body.email);
      
                  var subject = 'Confirm your email';
                  email_content = email_content.replace("#OTP#", 'http://13.58.192.202:3002/confirmPlayerEmail/'+user._id);
                  email_content = email_content.replace("#USER#", user.fname[0].toUpperCase()+user.fname.slice(1));
                  var content = new helper.Content('text/html', email_content);
      
                  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                  var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                  });
      
                  sg.API(request, function (error, response) {         
                     if(error==null){
                        
                      res.send({
                            msg: 'Your account has been registered',
                            status: 1
                           
                      });
      
                     }else{
                      res.send({
                      msg: 'Internal Server Error, Try again',
                      status: 2,
                      data: null
                      });
                     }
                     console.log(response);
                       console.log(error);
      
                  });	
              });	 

              /////confirm.//////
              }
              });
            }

};


exports.confirmPlayerEmail= function(req, res){
  console.log(req.params._id);
          Player.update({_id:req.params._id},{$set:{status:1}},{new:true},function(err, user){
       
          if(user!=null){
            
            res.sendFile(path.join(__dirname, '../templates') + '/confirmed.html', 'utf8'); 
          }


          });


          }


//user login

exports.p_login = (req, res)=> { 


    console.log(req.body.uid);

   
    Player.findOne({email: req.body.email}, function(err, user) {
      if(user==null){
          res.send({
          msg: 'Account does not exist for this email',
          status: 2,
          data: null
    });
      }else{

      if(user.status==2){
             res.send({
                msg: 'You account is deactivated',
                status: 3,
                data: null
             });

      }
      if(user.status==5){
        res.send({
           msg: 'Your email verification is pending',
           status: 3,
           data: null
        });

 }
      else if(user.status==1){

            //check password
      if(passwordHash.verify(req.body.password,user.password)){    

        if(errors.indexOf(req.body.uid)==-1){
        console.log('1');       

             Player.update({uid:String(req.body.uid)},{$set:{uid:0}}, {multi:true},function(err, empty_all){
                 console.log(empty_all); 
                  console.log(err);       

               Player.update({_id:user._id},{$set:{uid:req.body.uid}},{new:true},function(err, settled){
                console.log(settled); 
                console.log(err); 

               }); 

              }); 
            }
                
             res.send({
                msg: 'You are logged in',
                status: 1,
                data: user
             });

      }else{
         res.send({
                msg: 'Wrong credentials provided',
                status: 0,
                data: null
             });
      }

  //check password 

      } else if(user.status==0){
         res.send({
                msg: 'Wrong credentials provided',
                status: 0,
                data: null
             });

      }
      
      }
     
    });     

};

exports.p_updateinfo = function(req, res) { 

      Player.findOne({email: req.params.email,_id: { $not: req.params._id}}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 0,
          data: null
    });
      }else{
        savenewuser();
      }
     
    });    

    
   function savenewuser(){
             var upload = multer({ storage: storage }).single('file');
  upload(req,res,function(err){

        var querydata = {
              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              email: req.body.email,
              state: req.body.state,
              city: req.body.city,
              country: req.body.country,
              zip: req.body.zip,
              address: req.body.address,
              weight: req.body.weight,
              height: req.body.height,
              position: req.body.position,
              dob: req.body.dob,

          }

          if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }

          if(errors.indexOf(req.body.lat)==-1){
              querydata['cords']= {
              type: "Point",
              coordinates: [req.body.lng,req.body.lat],
            }
            }
      
            Player.update({_id: req.body._id},{$set:querydata},{new:true}, function(err, user) {
         if(user==null){
            res.send({
            msg: 'Internal Server Error, Try again',
            status: 0}); 
         }else{

         Player.findOne({_id:req.body._id}, function(err, user) {           

              if(user==null){
              res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
              });
              }else{             
              res.send({
            msg: 'Data has been updated',
            status: 1,
            data:user

            }); 
          
             }

        });

          
              }   
              });
                                   
  });



   }



  }



    exports.p_updatepassword =function(req, res){


        Player.findOne({_id:req.body._id}, function(err, user) {
                      
           if(user==null){
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          }else{             
            
          if(passwordHash.verify(req.body.opassword,user.password)){
                 
           chnagepass();

      }else{
         res.send({
                msg: 'Old password is wrong',
                status: 2,
                data: null
             });
      }



                }

      });


      
      function chnagepass(){  Player.update({_id: req.body._id},{$set:{'password':passwordHash.generate(req.body.npassword)}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Password has been reset',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })}

  }

      exports.p_addfav =function(req, res){

       
        Addfav.findOne({player_id:req.body._id,match_id:req.body.match_id}, function(err, user) {
                      
           if(user==null){
             var data= {player_id:req.body._id,match_id:req.body.match_id,status:1}
              var newAddfav = new Addfav(data);
              newAddfav.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Added to favourite',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })
          }else{             
            
    Addfav.update({player_id:req.body._id,match_id:req.body.match_id},{$set:{'status':req.body.status}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Updated',
                  status: 1,
                  data:user      
                  });        
                 }   
               })

             }
          });
         }

  exports.p_getfav = (req, res)=>{
                 
             Addfav.find({player_id:req.body._id,status:1}, function(err, match) {           
            
              if(match.length==0){
              res.send({
              msg: 'Internal Server Error, Try again',  
              status: 0,
              data: null
              });
              }else{

                  var favlist=[];
                  var cont=0;
      for(let key of match){

            Match.findOne({_id:key.match_id,status:1}, function(err, matchlist){
                 
            	if(matchlist!=null){

          Joinmatch.findOne({match_id:key.match_id}, function(err, result) {
          

                if(result!=null)  matchlist['players']= result.player_id.length
                 else  matchlist['players']= 0;
                  favlist.push(matchlist);
                  cont++;
                 
                    if(match.length==cont){

                 res.send({
              msg: 'fav list',  
              status: 1,
              data:favlist
              }); 
                  }               
                  });

            	}else{
                      cont++;


            	}       
              
            });         

            }                 
          
             }

        });            

}


exports.p_srchfav = function(req, res){

                      Addfav.find({player_id:req.body._id,status:1}, function(err, match) {          
          
              if(match.length==0){
                  res.send({
                  msg: 'no matches',  
                  status: 0,
                  data: null
                  });
              }else{

                  var ids=[];
                  var cont=0;
      for(let key of match){ 
               ids.push(key.match_id);      
          
                cont++;
                    if(match.length==cont){


                        Match.find({ 
                  "name": {'$regex' : req.body.keyword, '$options' : 'i'},
                     "_id": {"$in": ids},
                     status:1

                        }, function(err, matchlist){

                     if(matchlist.length==0){
                      res.send({
                      msg: 'no result found',  
                      status: 0,
                      data: null
                      });
                      }else{   
                          var i =0;
                          var newarray=[];
                      for(let findmatch of matchlist){
                 

                      Joinmatch.findOne({match_id:findmatch._id}, function(err, result) { 
                      if(result!=null) findmatch['players']= result.player_id.length;
                      else   findmatch['players']= 0;
                      newarray.push(findmatch);
                      i++;
                      if(i==matchlist.length){
                    
                      res.send({
                      msg: 'myupcoming messages',
                      status: 1,
                      data:newarray
                      }); 

                      }                
                      });
                     



                      }          
                    //   res.send({
                    // msg: 'match list',
                    // status: 1,
                    // data:matchlist

                    // }); 
                  
                     }
         
                     });
            }  
          

          

            }                
          
             }

        }); ///
            

}


exports.p_matchdetails = async function(req, res){    

               var results = await MatchResults.findOne({match_id:req.body.match_id});
                
               Match.findOne({_id:req.body.match_id,status:1}, function(err, match) {                        
               
                if(match==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',  
                    status: 0,
                    data: null
                    });
                }else{

                  

                 User.findOne({_id:match.owner_id}, function(err, owner)   { 

                Property.findOne({owner_id:match.owner_id},function(err, location){

                           res.send({
                        msg: 'match list',
                        status: 1,
                        match:match,
                        owner:owner,
                        location:location,
                        results:results
                    });

                 });                              

                 

                 });    
            
               }

          }); 
}



      exports.Joinmatch = async function(req, res){
         ///
  var d = new Date(); 

  var hours = d.getHours();
  var mins  =  d.getMinutes();

  var match_details= await Match.findOne({_id:req.body.match_id});
  var current_time= hours*60+mins;

  var match_hour= match_details.stime.slice(0,2);

  var match_min= match_details.stime.slice(-2);

  var match_time= Number(match_hour)*60+Number(match_min)

  var diff= match_time-current_time;
////

 
var date = d.getDate();
var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getFullYear();
if (date < 10) {
  date = '0' + date;
}
if (month < 10) {
  month = '0' + month;
}

var dateStr = year + "-" + month + "-" + date;
 
        Joinmatch.findOne({match_id:req.body.match_id}, function(err, match) {
                      
           if(match==null){
             var data= {
                  match_id:req.body.match_id ,
                  player_id: req.body._id,
                                   
              
             }

              var Joinnewmatch = new Joinmatch(data);
              Joinnewmatch.save(function(err, user) {  
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{

                var setdata= {$push:{team3_player_ids:req.body._id}}
                Match.update({_id:req.body.match_id},setdata, {new:true},function(err,matchDetails){})

                 var toId;
                 Match.findOne({_id:req.body.match_id},function(err,matchDetails){

                 if(matchDetails!=null){

                   toId= matchDetails.owner_id;                    
                  var fromId= req.body._id;
                  var params= {match_id:String(req.body.match_id)}
                  add_notification(fromId,toId,2,params);

                   User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                      if(errors.indexOf(owner_uid.uid)==-1){

                                    
                     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: owner_uid.uid, 
                                collapse_key: 'your_collapse_key',
                                
                                notification: {
                                    title: 'A player joined your match', 
                                    body: 'A new player has joined your match'
                                },      
                               
                            };
                            
                            fcm.send(message, function(err, response){
                              console.log(err);
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });

                      }
             


                   });


                 }
                 });
            

                 res.send({
                  msg: 'joined',
                  status: 1,
                  data:user
      
                  }); 

              
                 
                 
                 
       
                    }   
                          })
          }else{   
            
            if(req.body.status==0 && diff<=120 && dateStr==match_details.date){

              res.send({
                msg: 'Your can not leave the match before 2 hours',
            status: 5}); 



            }else{
              if(req.body.status==1){
                var setdata1 = {$push:{team3_player_ids:req.body._id}}
                var setdata= {$push:{player_id:req.body._id}}
                 setquery();
                 var  notification_message = {
                                        title: 'Match joined', 
                                        body: 'A player has joined your match'
                                    }
    
              }else if(req.body.status==0){
                var setdata1 = {$pull:{team3_player_ids:req.body._id}}
                 var setdata= {$pull:{player_id:req.body._id}}
                 setquery();
                         var  notification_message= {
                                        title: 'Match left', 
                                        body: 'A player has left your match'
                                    }
              }
    
           function setquery(){

                 Match.update({_id:req.body.match_id},setdata1, {new:true},function(err,matchDetails){})
                 Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {
    
                
    
    
                   console.log(user);
          
                   if(user==null){
                      res.send({
                      msg: 'Internal Server Error, Try again',
                      status: 3}); 
                   }else{
    
                           var toId;
                     Match.findOne({_id:req.body.match_id},function(err,matchDetails){
    
                     if(matchDetails!=null){
                         var type;
                   if(req.body.status==0){
                      
    
                                  
                   }else if(req.body.status==1){
                      type=2;                 
    
                   }
                       


                     }
    
                                 //fcm 
                       User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                          if(errors.indexOf(owner_uid.uid)==-1){
    
                                        
                         var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                    to: owner_uid.uid, 
                                    collapse_key: 'your_collapse_key',
                                    
                                    notification: notification_message,      
                                   
                                };
                                
                                fcm.send(message, function(err, response){
                                  console.log(err);
                                    if (err) {
                                        console.log("Something has gone wrong!");
                                    } else {
                                        console.log("Successfully sent with response: ", response);
                                    }
                                });
                              }
                            });
                     //fcm
    
    
                   });
                        
                      res.send({
                      msg: 'Match joined successfully',
                      status: 1  ,
                      data:user
          
                          });    
    
    
    
    
                    
    
    
    
                        }   
                              })
           }




            }
            
          

                }

      });
  }


exports.getJoinmatch =function(req, res){
  var ids=[req.body._id];
  Joinmatch.findOne({match_id:req.body.match_id}, function(err, match) {
            console.log(match);
                          
             if(match==null){
                    res.send({
                    msg: 'no data',
                    status: 2,
                    data:null
                    }); 

             }else{

              if(match.player_id.length==0){
                res.send({
                  msg: 'no data',
                  status: 2,
                  data:null
                  }); 

              }else{
                var players = [];
                var cont = 0;
           for(let key of match.player_id){     


              Player.findOne({_id:key}, function(err, player) {
              
                var dict = {
                  address: player.address,
                  points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
                  email: player.email,
                  fname: player.fname,
                  goals: player.goals,
                  lname: player.lname,
                  pic: player.pic,
                  position: player.position,
                  state: player.state,
                  status: player.status,
                  _id: player._id,

                }
            
               players.push(dict);
               cont++;                     
               console.log( match.player_id.length);

                  if(cont == match.player_id.length){
                
                     res.send({
                   msg: 'Updated',
                   status: 1,
                   playersList:players,
                   players: match.player_id              
                   }); 

              }
              });

          

           }


              }
               
 
                 


               
             }                

  });
}


exports.newGetJoinmatch =function(req, res){

  console.log(req.body);
 
  Match.findOne({_id:req.body.match_id}, function(err, match) {
            
                          
             if(match==null){
                    res.send({
                    msg: 'no data',
                    status: 2,
                    data:null
                    }); 

             }else{


var team1_players = [];
var team2_players = [];
var team3_players = []
var player_ids = [];

// ======================================

   if(errors.indexOf(match.team1_team_id)==-1){

    console.log('1111111111');

    team.findOne({_id: match.team1_team_id}, function(err, team1_details){

      if(team1_details!=null){
        if(team1_details.players.length!=0){
          var cont =0;
          for(let key of team1_details.players){
 
             Player.findOne({_id: key}, function(err, player){
 
               var dict = {
                 address: player.address,
                 points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
                 email: player.email,
                 fname: player.fname,
                 goals: player.goals,
                 lname: player.lname,
                 pic: player.pic,
                 position: player.position,
                 state: player.state,
                 status: player.status,
                 _id: player._id,
 
               }
               player_ids.push(key);
               team1_players.push(dict)
               cont++
               if(cont==team1_details.players.length){
 
                 query2()
               }
 
             })
          } 

        }else{

          query2()
        }
      
      }else{
        query2()

      }
    })

   }else{


    query2()



   }


function query2(){
  console.log('22222222');
  if(errors.indexOf(match.team2_team_id)==-1){

    team.findOne({_id: match.team2_team_id}, async function(err, team2_details){

       if(team2_details!=null){

       if(team2_details.players.length!=0){
        var cont = 0;
        for(let key of team2_details.players){

           Player.findOne({_id: key}, function(err, player){

             var dict = {
               address: player.address,
               points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
               email: player.email,
               fname: player.fname,
               goals: player.goals,
               lname: player.lname,
               pic: player.pic,
               position: player.position,
               state: player.state,
               status: player.status,
               _id: player._id,

             }
             player_ids.push(key);
             team2_players.push(dict)
             cont++
             if(cont == team2_details.players.length){
               query3()

             }

           })
        }

       }else{
        query3()

       }

        
      }else{
        query3()

      }

    })
   }else{
    query3()


   }

}

 

function query3(){
  console.log('33333333');
  if(match.team1_player_ids.length!=0){
    var cont = 0;
    for(let key of match.team1_player_ids){

      Player.findOne({_id: key}, function(err, player){

        var dict = {
          address: player.address,
          points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
          email: player.email,
          fname: player.fname,
          goals: player.goals,
          lname: player.lname,
          pic: player.pic,
          position: player.position,
          state: player.state,
          status: player.status,
          _id: player._id,

        }
        player_ids.push(key);
        team1_players.push(dict)
        cont++
        if(cont == match.team1_player_ids.length){
          query4()

        }


      })

    }  
  
}else{
  query4()
}

}


function  query4(){
  console.log('44444444');
  if(match.team3_player_ids.length!=0){
     var cont = 0;
    for(let key of match.team3_player_ids){

      Player.findOne({_id: key}, function(err, player){

        var dict = {
          address: player.address,
          points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
          email: player.email,
          fname: player.fname,
          goals: player.goals,
          lname: player.lname,
          pic: player.pic,
          position: player.position,
          state: player.state,
          status: player.status,
          _id: player._id,

        }
        player_ids.push(key);
        team3_players.push(dict)
        cont++
        if(cont == match.team3_player_ids.length){
          query5()

        }
        
      })

    }  
  
}else{
  query5() 


}

}



      function  query5(){
        console.log('555555555');
        if(match.team2_player_ids.length!=0){
           var cont = 0;
          for(let key of match.team2_player_ids){

            Player.findOne({_id: key}, function(err, player){

              var dict = {
                address: player.address,
                points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
                email: player.email,
                fname: player.fname,
                goals: player.goals,
                lname: player.lname,
                pic: player.pic,
                position: player.position,
                state: player.state,
                status: player.status,
                _id: player._id,

              }
              player_ids.push(key);
              team2_players.push(dict)
              cont++
              if(cont == match.team2_player_ids.length){
                res.send({
                  msg: 'Updated',
                  status: 1,
                  players:player_ids,
                  players1: team1_players,  
                  players2: team2_players,
                  players3: team3_players         
                  }); 
      
              }
              
            })

          }  
        
      }else{
        res.send({
          msg: 'Updated',
          status: 1,
          players:player_ids,
          players1: team1_players,  
          players2: team2_players,
          players3: team3_players             
          }); 


      }

      }
  
             }                

  });
}



exports.ownerdetail = function(req, res){      
                
               User.findOne({_id:req.body.owner_id}, function(err, match) {                        
               
                if(match==null){
                    res.send({
                    msg: 'no data',  
                    status: 0,
                    data: []
                    });
                }else{
                   
                    res.send({
                    msg: 'owner',  
                    status: 1,
                    data: match
                    });            
               }
          }); 

}




exports.followOwnerw =function(req, res){

       
        Followers.findOne({player_id:req.body._id, owner_id:req.body.owner_id,status:1}, function(err, user) {
                      
           if(user==null){
             var data= {player_id:req.body._id, owner_id:req.body.owner_id,status:1}
              var newAddfollower = new Followers(data);
              newAddfollower.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{


                  res.send({
                  msg: 'followed',
                  status: 1,
                  data:user      
                  });

                  fcm();

   
  
       
                    }   
                          })
          }else{             
            
    Followers.update({player_id:req.body._id, owner_id:req.body.owner_id},{$set:{'status':req.body.status}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{

                 if(req.body.status==1){
                  fcm();

                 }
                  res.send({
                  msg: 'Updated',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })

                }

      });



  }

     exports.followOwner =function(req, res){
       
        Followers.findOne({ owner_id:req.body.owner_id}, function(err, match) {
                      
           if(match==null){
             var data= {player_id:req.body._id, owner_id:req.body.owner_id,status:1}

              var newAddfollower = new Followers(data);
              newAddfollower.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0}); 
               }else{

                 
             User.findOne({_id:req.body.owner_id},function(err,admin_details){
              if(errors.indexOf(admin_details.uid)==-1){

                              //fcm
                  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: admin_details.uid, 
                                collapse_key: 'your_collapse_key',
                                
                                notification: {
                                    title: 'New follower', 
                                    body: 'A player has started following you '
                                },   
                               
                            };
                            
                            fcm.send(message, function(err, response){
                              console.log(err);
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });

                 //fcm


              }
               
 
                });

                  res.send({
                  msg: 'follwed',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })
          }else{             
            
          if(req.body.status==1){

            
            var setdata= {$push:{player_id:req.body._id}}

             setquery();

          }else if(req.body.status==0){
            console.log('pulling');

           var setdata= {$pull:{player_id:req.body._id}}

             setquery();
          }

       function setquery(){
             Followers.update({owner_id : req.body.owner_id},setdata,{new:true}, function(err, user) {
               console.log(user);
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0}); 
               }else{

                    if(req.body.status==1){
                     
             User.findOne({_id:req.body.owner_id},function(err,admin_details){

               if(errors.indexOf(admin_details.uid)==-1){
                     //fcm
                  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: admin_details.uid, 
                                collapse_key: 'your_collapse_key',
                                
                                notification: {
                                    title: 'New follower', 
                                    body: 'A player has started following you '
                                },   
                               
                            };
                            
                            fcm.send(message, function(err, response){
                              console.log(err);
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);
                                }
                            });

                 //fcm

               }
               
               
 
                });
                      }

                  res.send({
                  msg: 'Updated  ',
                  status: 1  ,
                  data:user
      
                  }); 
       
                    }   
                          })
                        }

                }

      });    


  }

  exports.getfollowOwner = function(req, res){  


              
    var ids=[req.body._id]  
   Followers.find({player_id: { $in: ids}}, function(err, match) {  
                 
     
      if(match.length==0){
          res.send({
          msg: 'no data',  
          status: 0,
          data: []
          });
      }else{
              var owners=[];
              var cont= 0;
              for(let key of match)  {

                User.findOne({_id:key.owner_id}, function(err, owner)   { 

               if(owner!=null){
                  owners.push(owner);

               }                             
                         
                      cont++; 
                      if(cont==match.length){
                              res.send({
                              msg: 'owner',  
                              status: owners.length!=0 ? 1 : 0,
                              data: owners
                              }); 
                              
                      }
                 });
               }             
            }
         }); 
  }

  exports.getAllOwners = async function(req, res){  

   var ids=[req.body._id]  
   var owners  = await Followers.find({player_id: { $in: ids}}); 

        if(owners.length!=0){

          var ownerIds = [];
          var cont = 0;
          for(let key of owners){
            console.log('owner idsssss')
            ownerIds.push(key.owner_id);
            cont++;
            if(cont==owners.length){
            
              getowners(ownerIds);
            }
          
          }

        }else{
          getowners([]);

        }

function getowners(ids){
  console.log('owner idsssss')
  console.log(ids)
  User.find({_id: { $nin: ids}}, function(err, owners)   { 

    if(owners.length!=0){
      res.send({
        msg: 'owner',  
        status:1,
        data: owners
        }); 

    }else{
      res.send({
        msg: 'no owners',  
        status: 0,
       
        }); 

    }                             


})
}
  


  }

    exports.searchfollowOwner = function(req, res){      
              
    var ids=[req.body._id]  
    Followers.find({player_id: { $in: ids}}, function(err, match) {
    console.log(match);                     
     
      if(match.length==0){
          res.send({
          msg: 'no data',  
          status: 0,
          data: []
          });
      }else{
              var owners=[];
              var cont =0;
            
              for(let key of match)  {

                User.findOne({_id:key.owner_id,  $or: [ {"fname" : { '$regex': req.body.keyword, $options: 'i' }}, { "lname": { '$regex': req.body.keyword, $options: 'i' } } ] }, function(err, owner)   {    
                   if(owner!=null)  owners.push(owner);                           
                       cont++;
                      if(cont== match.length){
                        console.log('entered');
                       
                            res.send({
                              msg: 'owner',  
                              status: 1,
                              data: owners
                              }); 

                                                 
                              
                      }
                 });
              
               }             
            }

         }); 
  }


  exports.searchNonfollowOwner =async  function(req, res){      
              
    var ids=[req.body._id]  
    var owners  = await Followers.find({player_id: { $in: ids}}); 
 
         if(owners.length!=0){
           var ownerIds = [];
           var cont = 0;
           for(let key of owners){
 
             ownerIds.push(key.owner_id);
             cont++;
             if(cont==owners.length){
             
               getowners(ownerIds);
             }
           
           }
 
         }else{
           getowners([]);
 
         }
 
 function getowners(ownerIds){
 
 
   User.find({_id: { $nin: ownerIds},$or: [ {"fname" : { '$regex': req.body.keyword, $options: 'i' }}, { "lname": { '$regex': req.body.keyword, $options: 'i' } } ] }, function(err, owners)   { 
 
     if(owners.length!=0){
       res.send({
         msg: 'owner',  
         status:1,
         data: owners
         }); 
 
     }else{
       res.send({
         msg: 'no owners',  
         status: 0,
        
         }); 
 
     }                             
 
 
 })
 } 
  }

  exports.playerUpMatches = function(req, res){

                var d = new Date();
                var date = d.getDate();
                var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                var year = d.getFullYear();
                if(date<10){
                date= '0'+date;
                }
                if(month<10){
                month= '0'+month;
                }
                var dateStr = year + "-" + month + "-" + date;


            var ids=[req.body._id]
            Joinmatch.find( {"player_id": {"$in": ids}}, function(err, user) {
             
      
               if(user.length==0){
                  res.send({
                  msg: 'no data found',
                  status: 0}); 
               }else{
                    

                  var myupmatches=[];
                  var cont=0;
               for(let key of user){
                 
                Match.findOne({_id:key.match_id,date:{$gt:dateStr},status:1}, function(err, match) {           

                if(match!=null){
                     
                   Joinmatch.findOne({match_id:match._id}, function(err, result) { 
                      console.log('conme');
                match['players']= result.player_id.length
                myupmatches.push(match);

                       cont++;
                  console.log(user.length);
                  console.log(cont);
                if(cont==user.length){
                  console.log('come');
                   console.log(myupmatches);
                  res.send({
                  msg: 'myupcoming messages',
                  status: 1,
                  data:myupmatches
                 }); 

                }                
                   });
               
                }else{
                    cont++;
                         if(cont==user.length){
                  console.log('come');
                   console.log(myupmatches);
                  res.send({
                  msg: 'myupcoming messages',
                  status: 1,
                  data:myupmatches
                 }); 

                }


                }
           

                });  

               }       
                    }   
                  })                     

}



exports.fieldRequest = async function(req, res) {

  if(req.body.fullday==false){

    var matchExists = await Match.find(
          {$and : [
          {
            $or : [
            {stime: { $gte: req.body.stime, $lte: req.body.stime } },
            {stime: { $gte: req.body.etime, $lte: req.body.etime } },
            {etime: { $gte: req.body.stime, $lte: req.body.stime } },
            {etime: { $gte: req.body.etime, $lte: req.body.etime } }
            ]
          },
          {
             date : req.body.date,
          }
          ,{
    status:1
          },
          {
             owner_id:req.body.owner_id
          }
          ]}
              );



}else{

     var matchExists = await Match.find(
                          {$and : [                              
                          {
                          date : req.body.date,
                          }
                          ,{
                    status:1
                          },
                          {
                            owner_id:req.body.owner_id
                          }
                          ]}
                              );


}

if(matchExists.length!=0){
  res.send({
    msg: 'match already exists',
    status: 2,
});



}else{
  const data= {
    player_id:req.body._id,
    owner_id:req.body.owner_id,
    fullday:req.body.fullday,
    date:req.body.date,
    time:req.body.time,
    comment:req.body.comment,
    stime:req.body.stime,
    etime:req.body.etime,
    players_ids: req.body.selected_player_id,
    team_id: req.body.team_id
  }

var newRequest= new RequestField(data);

newRequest.save(function(err, user) {
if(user!=null){

   User.findOne({_id:req.body.owner_id},function(err, ownerUid){

        if(errors.indexOf(ownerUid.uid)==-1){
        console.log(ownerUid);


                var message = { 
                  to: ownerUid.uid, 
                  collapse_key: 'your_collapse_key',
                  
                  notification: {
                      title: 'Got field request', 
                      body: 'You got a field request by a player'
                  },      
                 
              };
              
              fcm.send(message, function(err, response){
                console.log(err);
                  if (err) {
                      console.log("Something has gone wrong!");
                  } else {
                      console.log("Successfully sent with response: ", response);
                  }
              });

        }

   });

         



  res.send({
        msg: 'request sent',
        status: 1,
        data: user
    });
}else{
  res.send({
        msg: 'failed',
        status: 0,
        data: null
    });

}
 

}); 



}

     
}

exports.playerGetOtp = (req, res)=>{
      Player.findOne({email: req.body.email,status:1}, function(err, user) {
      if(user==null){
          res.send({
          msg: 'Account does not exist',
          status: 0,
          data: null
    });
      }else{
         generateOtp(req.body.email);        
      }
     
    });
  


        function generateOtp(email){
    var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
        var new_otp = new Otp({email:email,otp:OTP,type:2});
       new_otp.save(function(err, otp) {
              if (otp == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3,
                  data: null
                });
              }else{
                  sendotp(otp);              
              }
              }); 
           }

      function sendotp(otp){

          var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forget.html', 'utf8');
          let email_content = ''
          readStream.on('data', function(chunk) {
            email_content += chunk;
          }).on('end', function() {
            var helper = require('sendgrid').mail;
            var fromEmail = new helper.Email('noreply@match.com');
            var toEmail = new helper.Email(req.body.email);

            var subject = 'Password Reset';
            email_content = email_content.replace("#OTP#", otp.otp);
            var content = new helper.Content('text/html', email_content);

            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON()
            });

            sg.API(request, function (error, response) {         
               if(error==null){
                  
                res.send({
                msg: 'An OTP is sent to your email, Please check your inbox',
                status: 1,
                data: otp
                });

               }else{
                res.send({
                msg: 'Internal Server Error, Try again',
                status: 2,
                data: null
                });
               }
               console.log(response);
                 console.log(error);

            });  
        });   
}

 

}

exports.playerResetPassword =function(req, res){
        console.log(req.body.npassword);
      Otp.findOne({email:req.body.email,type:2}, null, {sort:{'_id': -1}}, function(err, user) {
          console.log('otp'+user);
              
           if(user==null){
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          }else{             
             confirmOtp(req.body.otp,user.otp);          }

      });

      function confirmOtp(frontOtp,backOtp){
        if(frontOtp==backOtp){
           changePassword();

        }else{
              res.send({
              msg: 'Provided OTP is wrong',
              status: 2,
              data: null
            });
        }

      }

      function changePassword(){
            
         Player.update({ email: req.body.email}, { $set: { password : passwordHash.generate(req.body.npassword) }}, {new: true}, function(err, user) {
             console.log('coming');
             console.log(user);
             if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3,
                  data: user
                  });
          
             }else{
              res.send({
              msg: 'password changed successfully',
              status: 1,
              data: user
              });
            }

         });
      }
}


exports.bookMatchPayment = (req, res)=>{

  (async () => {
    // Create a Customer:
    const customer = await stripe.customers.create({
      source: req.body.token,
      email: 'paying.user@example.com',
    });

    if(errors.indexOf(customer.id)==-1){

           customerId.update({player_id:req.body.player_id,
            match_id:req.body.match_id},{$set:{status:2}},{new:true},function(){
              
              var data= {
                id:customer.id,
                player_id:req.body.player_id,
                match_id:req.body.match_id
              }
              var newcustomerId= new customerId(data);
              newcustomerId.save(function(err, savedId){
                if(savedId!=null){
                 res.send({
                   msg: 'Payment successfull',
                   status: 1,
                 
               });
   
                }
            
   
   
              });


            });
         
        
    }else{
            res.send({
                  msg: 'Payment failed',
                  status: 0,
                    
              });

    }
    console.log(customer);
  
  
  })();



    
// stripe.charges.create(
//   {
//     amount:1000,
//     currency: 'usd',
//     source: req.body.token,
//     description: 'Payment for match booking',
//   },
//   function(err, charge) {

//     console.log(err);

//      if(charge!=null){

//         var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });

//          var data= {
//             payId:OTP,
//             transaction_id:charge.id,
//             owner_id:req.body.owner_id,
//             match_id:req.body.match_id,
//             player_id:req.body.player_id,
//             amount:10,
//          }

//          var newpayment= new bookingPayment(data);

//          newpayment.save(function(err, paymentOutput){
//            console.log(paymentOutput);
//           if(paymentOutput!=null){

//               res.send({
//                   msg: 'Payment successfull',
//                   status: 1,
//                   data: paymentOutput         
//               });

//           }else{
//             console.log(err);
//             res.send({
//                   msg: 'Internal server error, Try again',
//                   status: 0            
//               });


//           }





//          });



//      }else{
//         res.send({
//               msg: 'Internal server error, Try again',
//               status: 0            
//               });



//      }
    

//   }
// );


   }


   exports.transaction_details = async (req, res)=>{


     var paymentOutput = await bookingPayment.find({player_id:req.body._id},null,{sort:{createdAt:-1}});

     var fieldRequestPayents= await requestFieldPayments.find({player_id:req.body._id},null,{sort:{createdAt:-1}});

   var final=  paymentOutput.concat(fieldRequestPayents);
   console.log(final);

   if(final.length!=0){
   	const sortedActivities = await final.sort((a, b) => b.createdAt - a.createdAt);
   	makeArray();

   }else{
     res.send({
              msg: 'Internal server error, Try again',
              status: 0            
              });
   }
     

   
    

          async function makeArray(){

                var cont=0;
		   var all_data= [];
            for(let key of final){

            var owner_details= await  User.findOne({_id:key.owner_id});

            var match_name= await  Match.findOne({_id:key.match_id});

            var dist= await{
              id: key.payId,
              name: match_name !=null ?  match_name.name : '',
              date: key.createdAt,
              ownerfname: owner_details !=null ? owner_details.fname : '',
              ownerlname: owner_details !=null ? owner_details.lname : '',
              amount: key.amount,
              type: key.type
            }
            all_data.push(dist);

            cont++;

              if(cont==final.length){
              	console.log(all_data);

                  res.send({
                    msg: 'Payment details',
                    status: 1,
                    data: all_data            
              });



            }

            }

          }

   }



 exports.requestFieldPaymentFun = async (req, res)=>{   


    if(req.body.amount==10){

     	 var matchExists = await Match.find(
              {$and : [
              {
	              $or : [
	              {stime: { $gte: req.body.stime, $lte: req.body.stime } },
	              {stime: { $gte: req.body.etime, $lte: req.body.etime } },
	              {etime: { $gte: req.body.stime, $lte: req.body.stime } },
	              {etime: { $gte: req.body.etime, $lte: req.body.etime } }
	              ]
              },
              {
                 date : req.body.date,
              }
              ,{
        status:1
              },
              {
                 owner_id:req.body.owner_id
              }
              ]}
                  );



    }else{

    		 var matchExists = await Match.find(
                              {$and : [                              
                              {
                              date : req.body.date,
                              }
                              ,{
                        status:1
                              },
                              {
                              	owner_id:req.body.owner_id
                              }
                              ]}
                                  );


    }


 	if(matchExists.length==0){


    (async () => {
      // Create a Customer:
      const customer = await stripe.customers.create({
        source: req.body.token,
        email: 'paying.user@example.com',
      });
  
      if(errors.indexOf(customer.id)==-1){
  
        var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });

        var data = {

             payId:OTP,
             transaction_id:customer.id,
             owner_id:req.body.owner_id,
             player_id:req.body.player_id,
             amount:req.body.amount,
             type:1
        }

        var newpayment= new requestFieldPayments(data);

        newpayment.save(function(err, paymentOutput){
          console.log(paymentOutput);
         if(paymentOutput!=null){

             res.send({
                 msg: 'Payment successfull',
                 status: 1,
                 data: {transaction_id:customer.id}         
             });

         }else{
           res.send({
                 msg: 'Internal server error, Try again',
                 status: 0            
             });


         }





        });

                

              
           
          
      }else{
              res.send({
                    msg: 'Payment failed',
                    status: 0,
                      
                });
  
      }
      console.log(customer);
    
    
    })();
    ////

 



 	}else{

             res.send({
                  msg: 'This time slot is already taken',
                  status: 4,
                  data: null
                });

       }


   }



        exports.get_player_notifications = async function(req, res) {

var ids=[req.body._id];

  const notifQuery=  await Notifications.find({toId : { $in: ids}, isRead:0});
  console.log(notifQuery);


 if(notifQuery.length==0){			

                res.send({
                status:0,
                msg: 'No notifications',
                });

   }else{

    var notifications_array=[];
  
    var i=0;
     for(let key of notifQuery){

      if(key.type==1){ 

       var joinedplayersQuery= await User.findOne({_id :key.fromId});
     
         var joinmatchDist= await {
       noti_id: String(key._id),  
       fname: joinedplayersQuery.fname,
       lname:joinedplayersQuery.lname,
       pic:joinedplayersQuery.pic,
       _id:key.data_params.match_id,
       type: 1,
       createdAt : key.createdAt
       }

       notifications_array.push(joinmatchDist);

      }


      if(key.type==10){ 

       var joinedplayersQuery = await User.findOne({_id :key.fromId});
       var matchdetails = await Match.findOne({_id :key.data_params.match_id});
      
       var joinmatchDist= await {
        noti_id: String(key._id),  
        fname: joinedplayersQuery.fname,
        lname:joinedplayersQuery.lname,
        pic:joinedplayersQuery.pic,
        _id:key.data_params.match_id,
        type: 10,
        match_name: matchdetails.name,
        fullday: matchdetails.fullday,
        owner_id :  matchdetails.owner_id,
        createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }

      if(key.type==9){ 

        var joinedplayersQuery= await Match.findOne({_id : key.data_params.match_id});
      
          var votingReq= await {
              noti_id: String(key._id),  
              fname:'',
              lname: '',
              gender: joinedplayersQuery.gender,
              name: joinedplayersQuery.name,
              _id : key.data_params.match_id,
              type: 9,
              createdAt : key.createdAt
        }
 
        notifications_array.push(votingReq);
 
       }


      //     if(key.type==4){      
      //  var field_requestsQuery= await User.findOne({_id :key.fromId});
     
      //    var field_requestsDist= await {
      //       noti_id: String(key._id),  
      //  fname: field_requestsQuery.fname,
      //  lname:field_requestsQuery.lname,
      //  pic:field_requestsQuery.pic,
      //  _id:key.data_params.field_id,
      //  type: 3
      //  }

      //  notifications_array.push(field_requestsDist);

      // }



              if(key.type==6){      
       var leave_matchQyery= await User.findOne({_id :key.fromId});
       console.log(key);
       console.log(leave_matchQyery);
     
         var leave_matchDist= await {
            noti_id: String(key._id),  
       fname: leave_matchQyery.fname,
       lname:leave_matchQyery.lname,
       pic:leave_matchQyery.pic,
       _id:key.data_params.match_id,
        type: 6,
        createdAt : key.createdAt
       }

       notifications_array.push(leave_matchDist);

      }

      i++;
      if(i==notifQuery.length){

                  res.send({
                    status:1,
                    msg: 'Owner notifications',
                    data:   arraySort(notifications_array, 'createdAt', {reverse: true})
                    });
                  }
                }      
             }
            }


  exports.clear_player_notifications = async function(req, res) {
    
    
      Notifications.update({_id:req.body._id},{$set:{isRead:1}},{new: true},function(err, match) {



                   if(match!=null){

                  res.send({
                    status:1,
                    msg: 'Cleared'                  

                    });

                  }else{

                   res.send({
                      status:0,
                       msg: 'Internal Server Error, Try again',
                         });

                  }
 
       });

      }   
      
      
    exports.getConfirmations = async function(req, res) {

      var confirmationsData = await Confirmation.find({player_id:req.body._id,status:0});

      if(confirmationsData.length!=0){

      var data=[];
      var cont =0; 
      for(let key of confirmationsData){

      Match.findOne({_id:key.match_id},function(err, matchdetails){
        if(matchdetails!=null){
          var dist=  {
            _id:key._id,
            match_id:key.match_id,
            match_name:matchdetails.name,
            match_pic:matchdetails.cover,
            location:matchdetails.location,
            date:matchdetails.date,
            stime:matchdetails.stime,
            owner_id : matchdetails.owner_id,
    
           }
           data.push(dist);
           cont++;
           if(cont==confirmationsData.length){
            res.send({
              status:1,
              msg: '',
              data:data
                });
           }

        }
  


      });


      }




       

      }else{

        res.send({
          status:0,
           msg: 'no record',
             });
      }
      }


      //confirm

      exports.ConfirmAvailabilty = async function(req, res) {

        var ownerid = await Match.findOne({_id:req.body.match_id});
        var owner=  await User.findOne({_id:ownerid.owner_id}); 


        Confirmation.update({_id:req.body.confirm_id},{$set:{status:2}},{new:true},function(err, confirmed){

          if(confirmed!=null){

            var setdata= {$pull:{player_id:req.body._id}}
            Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {

                      //fcm 
                    
                        if(errors.indexOf(owner.uid)==-1){
  
                                      
                       var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                  to: owner.uid, 
                                  collapse_key: 'your_collapse_key',
                                  
                                  notification: {
                                    title: 'Match left', 
                                    body: 'A player has left your match'
                                  },      
                                 
                              };
                              
                              fcm.send(message, function(err, response){
                                console.log(err);
                                  if (err) {
                                      console.log("Something has gone wrong!");
                                  } else {
                                      console.log("Successfully sent with response: ", response);
                                  }
                              });
                            }
                        
                   //fcm


            })



           res.send({
             status:1,
              msg: 'Declined',
                });

          }else{
            res.send({
              status:0,
               msg: 'error',
                 });


          }

         });

      

        
        }


        //get all players

              
    exports.getPlayersForMatch = async function(req, res) {
 
    Player.find({status:1, _id: { $ne: req.body._id  }},function(err,players){

      if(players.length!=0){
        res.send({
          status:1,
           data: players,
             });
   
      }else{
        res.send({
          status:0,
           msg: 'no record',
             });

            }
         })        
      }

  //make a team
    exports.createTeam = async function(req, res) {


 
      var upload = multer({ storage: uploadTeamPic }).single('file');


      upload(req, res, function (err) {

        console.log(req.body);

      var data= {
            player_id: req.body._id,
            name: req.body.name,
            cover: req.file.filename
                                 }
      var newTeam= new team(data);

      newTeam.save(function(err, teamCreated){
        if(teamCreated!=null){
 
            var cont=0;

            for(let key of JSON.parse(req.body.ids)){

              var invitationData = {
                team_id: teamCreated._id,
                team_owner_id: req.body._id,
                player_id: key,
                status: key==	req.body._id ? 1 : 0
              }

              var newteamInvitation= new teamInvitation(invitationData);
              newteamInvitation.save();

              Player.findOne({_id: key},function(err, player){
                if(errors.indexOf(player)==-1){
                  
                  if(errors.indexOf(player.uid)==-1){

                    var message1 = { 
                      to: player.uid,
                      collapse_key: 'your_collapse_key',
  
                      notification: {
                        title: 'Got team invitation',
                        body: "You got an invitation to become a team member"
                      },
                     };
  
                    fcm.send(message1, function (err, response) {
                      console.log(err);
                      if (err) {
                        console.log("Something has gone wrong!");
                      } else {
                        console.log("Successfully sent with response: ", response);
                      }
                    });
                   }

                }
               
              });
              cont++;
              if(cont==JSON.parse(req.body.ids).length){


                res.send({
                  status:1
                     });


              }
             }

    

        }else{

          res.send({
            status:0,
             msg: 'error',
               });
             }
           });
         });        
        }

  exports.getAllInvitations = function(req, res){

    teamInvitation.find({player_id:req.body._id, status:0},function(err, invitations){

       if(invitations.length!=0){



           var resData = [];
           var cont = 0;
          for(let key of invitations){
            team.findOne({_id: key.team_id}, function(err, teamOutput){

            
             
              if(teamOutput!=null){

                Player.findOne({_id: key.player_id}, function(err, PlayerDetails){

                  Player.findOne({_id: key.team_owner_id}, function(err, captain){
                    if(captain!=null){

                      var dist= {
                        _id: key._id,
                        team_id: teamOutput._id,
                        player_id: key.player_id,
                        cover: teamOutput.cover,
                        name: teamOutput.name,
                        player_fname: captain.fname,
                        player_lname: captain.lname
                       }
      
                       resData.push(dist);
                       cont++;
                       if(cont==invitations.length){
                        res.send({
                                status:1,
                                data: resData,
                                });
                              }
     
                    }else{
                      res.send({
                        status:0,
                         msg: 'Something went wrong',
                           });
      
                    }


                  })

                 
   
                 })

             
              }else{
                res.send({
                  status:0,
                   msg: 'Something went wrong',
                     });

              }

                  
                           });

            
          }

    

       }else{

        res.send({
          status:0,
           msg: 'no data',
             });
            }
        });
      }

exports.actionOnTeaminvitation = async (req, res)=>{

  if(req.body.status==1){

   
    teamInvitation.update({_id:req.body.i_id},{$set:{status:1}},{new:true},function(err, invitations){
      console.log('1');
      if(invitations!=null){
        console.log('2');
        var setdata= {$push:{players:req.body._id}};
        team.update({_id: req.body.t_id},setdata,{new:true}, function(err, teamOutput){
          console.log('3');
          console.log(teamOutput);
          if(teamOutput!=null){
                
                  res.send({
                    status:1,
                    msg: 'Invitation has been declined',
                      });


          }else{
            res.send({
              status:0,
              msg: 'Something went wrong',
                 });

          }



        });
 
 
      }else{
 
       res.send({
         status:0,
         msg: 'Something went wrong',
            });
      }
 
 
     });



  }else{
    teamInvitation.update({_id:req.body.i_id},{$set:{status:2}},{new:true},function(err, invitations){

     if(invitations!=null){
      res.send({
        status:1,
         msg: 'Invitation has been declined',
           });


     }else{

      res.send({
        status:0,
        msg: 'Something went wrong',
           });
     }


    });


  }

}


exports.getPlayerInfo = async (req, res)=>{

  var player  = await Player.findOne({_id: req.body._id})

  team.find({player_id: req.body._id}, function(err, teamOutput){

    if(teamOutput.length!=0){
      res.send({
        status:1,
        msg: 'has team',
        points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5))
           });

    }else{
      
      res.send({
        status:0,
        msg: 'has no team',
        points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5))
           });


    }



  })

}

//get players for vote//

exports.getJoinedPlayers = async (req, res)=>{

  var joinedPlayers = await Joinmatch.findOne({match_id: req.body.match_id});

  if(joinedPlayers!=null){
      var players = [];
      var cont = 0;
     for(let key of joinedPlayers.player_id){
         Player.findOne({_id: key}, function(err, player){
            if(player!=null){
              players.push(player);
              cont++;
       
            }else{

              cont++;

            }
        
          if(cont== joinedPlayers.player_id.length){
            res.send({
              status:1,
              msg: 'joined players',
              data: players
                 });
          }



         });

     }




  }else{
    res.send({
      status:0,
      msg: 'No player found',
     
         });
    


  }


}


//get players for vote//

exports.voteForMOTM = async (req, res)=>{

  var recordExists = await vote.findOne({match_id : req.body.match_id, fromId : req.body.fromId });
  
  if(recordExists==null){ 
    var voteData = {
      match_id : req.body.match_id,	
      toId : req.body.toId,
      fromId : req.body.fromId,
      comment : req.body.comment,
     }
  
    var newVote= new vote(voteData);
    newVote.save(function(err, voteRes){
  
      if(voteRes!=null){
  
            Player.update({ _id: req.body.toId }, { $inc: { points: 1 } }, {new: true },function(err, response) {
  
              if(response!=null){
                res.send({
                  status:1,
                  msg: 'Voted successfully',
                  });
  
  
              }else{
  
                res.send({
                  status:0,
                  msg: 'error',
                  });
              }
  
  
            })
  
      }else{
  
        res.send({
          status:0,
          msg: 'error',
          });
  
      }
  
    });


  }else{
    res.send({
      status:2,
      msg: 'already voted',
      });


  }

}

    
//get my votes//

exports.getMyVotes = async (req, res)=>{

  var recordExists = await vote.find({toId : req.body.toId});
  
  if(recordExists.length!=0){
      var cont = 0;
      var resData= [];
      for(let key of recordExists){
          Player.findOne({_id: key.fromId}, function(err, playerDetails){

            if(playerDetails!=null){

             Match.findById(key.match_id,function(err, matchDetails){

              if(matchDetails!=null){
                  var dist = {
                  fromFName : playerDetails.fname,
                  fromLName : playerDetails.lname,
                  matchName : matchDetails.name,
                  _id : key._id,
                  pic: playerDetails.pic,
                  comment:  key.comment

                  }

                  resData.push(dist);
                  cont++;
                  if(cont==recordExists.length){
                    res.send({
                      status:1,
                      msg: 'votes',
                      data:  resData
                      });

                  }

              }else{
                res.send({
                  status:2,
                  msg: 'Internal server error',
                  });
              }


             })


            }else{

              res.send({
                status:2,
                msg: 'Internal server error',
                });

            }


          });


      }
   
  

  }else{
    res.send({
      status:0,
      msg: 'No votes',
      });


  }

}

//get my votes//

exports.getHoursOfPlay = async (req, res)=>{
  var ids = [req.body._id];
  var recordExists = await Joinmatch.find({"player_id": {"$in": ids}, status:1});
  console.log('recordExists',recordExists.length)
 
  if(recordExists.length!=0){
    var counter = 0, total_hours = 0;
    for(let key of recordExists){
      Match.findOne({_id : key.match_id},'stime etime', function(err, match){
        console.log(match)
          if(match!=null){
            var timeStart = new Date("01/01/2007 " + match.stime);
            var timeEnd = new Date("01/01/2007 " + match.etime);
            total_hours+= timeEnd - timeStart;   
            counter = counter + 1;
            console.log(counter)
            if(counter == recordExists.length){
              total_hours = total_hours / 60 / 60 / 1000;
              res.send({
                hours : total_hours
              })
            }
          }
          else{
            counter = counter + 1;
             console.log(counter)
            if(counter == recordExists.length){
              res.send({
                hours : total_hours
              })
            }
          }
      });
    }
  }
  else{
    res.send({
      hours : 0
    })
  }
};


// get players for request match

exports.getPlayersForRequestField = async function(req, res){

  team.findOne({player_id: req.body._id}, function(err, teamOutput){

    console.log(teamOutput);

    if(teamOutput!=null){
      var resData= [];
      var cont = 0; 
      if(teamOutput.players.length!=0){
        for(let key of teamOutput.players){
          console.log('11111');
  
          Player.findOne({_id: key}, function(err, playerDetails){
             if(playerDetails!=null){
               resData.push(playerDetails);
             }
             cont++;
             console.log('22222');
             if(cont==teamOutput.players.length){
              console.log(resData);
              res.send({
                status:1,
                msg: 'Players',
                data : resData,
                team_id: teamOutput._id
                });
  
             }
  
          });
  
  
        }

      }else{
        res.send({
          status : 3,
          msg : 'No players'
          });

      }
    



    }else{

      res.send({
        status : 0,
        msg : 'No team'
        });

    }



  })



   
}


exports.getTeamInfo = async (req, res)=>{

  team.findOne({player_id: req.body._id}, function(err, teamOutput){

    if(teamOutput!=null){

     teamInvitation.find({team_id: teamOutput._id}, function(err, invitedPlayers){

      if(invitedPlayers.length!=0){
        var resData= [];
        var cont = 0;
         for(let key of invitedPlayers){
            Player.findOne({_id : key.player_id}, function(err, playerRes){
              if(playerRes!=null){
                 var dict = {
                   fname: playerRes.fname,
                   lname: playerRes.lname,
                   pic: playerRes.pic,
                   status : key.status
                 }
                 resData.push(dict)
 
                 cont++
                 if(cont==invitedPlayers.length){
                   res.send({
                     status:1,
                     msg: 'Team',
                     data: resData,
                     team_name: teamOutput.name
                        });
 
 
                 }
 
 
              }
 
 
            })
 
 
         }

      }else{
        res.send({
          status:0,
          msg: 'error',
             });


      }
      



     })
     

    }else{
      
      res.send({
        status:0,
        msg: 'has no team',
           });


    }



  })

}

exports.confirmPayment = function (req, res) {
 
  User.findOne({_id: req.body.owner_id}, async function(err, userStrieId){

    if(userStrieId!=null){
       if(errors.indexOf(userStrieId.stripe_id) == -1){


stripe.customers.create(
  {
      'email' : 'ifootballmatch@gmail.com', // customer email id
      'source' : req.body.token, // stripe token generated by stripe.js
      'name' : 'harinder singh',
      'address' : {"city" :'khamano', "country" : "+1", "line1" : "khamano , rattom", "line2" : "khamano , ratton", "postal_code" :"12345", "state" : "fategarh sahib"}
  },
  function(err, customer) {
   
     

      if(errors.indexOf(customer)==-1){

          stripe.charges.create(
              {
                  'currency' :'USD',
                  'amount' :  Number(req.body.amount)*100,
                  'description' : 'Match commison to admin',
                  'customer' : customer.id,
                  
              },
              function(err, charge) {
                  if(errors.indexOf(charge)==-1){

                      stripe.charges.create(
                          {
                              "amount" : Number(req.body.commission)*100,
                              "currency" : 'USD',
                              "description" : "Trip amount to user",
                              "source" : charge.source.id,
                              "customer" : charge.source.customer,
                              "application_fee" : 0,
                              transfer_data: {
                                destination: userStrieId.stripe_id,
                              },
                           
                              'capture' :  true
                          },
                          function(err, charge) {

                            if(errors.indexOf(charge)==-1){
                                 
                    var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                    var type = Number(req.body.type)
                    var data = {
                              payId: OTP,
                              transaction_id: charge.id,
                              owner_id: req.body.owner_id,
                              player_id: req.body._id,
                              amount: req.body.commission,
                               type: type==1 ? 3 : 1
                            }
                            var newpayment = new paymentToOwner(data);

                            newpayment.save(function (err, paymentOutput) {
                              console.log(paymentOutput);
                              
                            });
            
                            var data= {
                                payId: OTP,
                                transaction_id: charge.id,
                                owner_id: req.body.owner_id,
                                match_id: req.body.match_id,
                                player_id: req.body._id,
                                amount: req.body.amount,
                            }

                            var newpayment= new bookingPayment(data);

                            newpayment.save();
                            
                                Match.update({_id: String(req.body.match_id)},{$set:{status:1}},{new:true}, function(){
                                  });

                                if(type==1){
                                   
                                  Notifications.update({_id:req.body.confirmation_id},{$set:{isRead:1}},{new:true},function(){
                                  });

                                }else{

                                  var toId = req.body.owner_id;
                                  var fromId = req.body._id;
                                  var params = {match_id:req.body.match_id, coming_status: Number(req.body.coming_status)}
              
                                  add_notification(fromId,toId,13,params);

                                  Confirmation.update({_id:req.body.confirmation_id},{$set:{status:1}}, {new:true}, function(err, output){
                                    
                                    console.log(output);
                                    console.log(err);

                                  });
                                }

                    
                            res.send({
                              msg: 'Payment successfull',
                              status: 1,
                              data: null
                            });



                            }else{

                              console.log('333333')
                              console.log(err)


                            }

                            
                           
                              
          
          
          
                              
                          }
                        );
          
                  }else{
                    console.log('2222222')
                    console.log(err)
          
          
          
                  }
                  




              }
            );

      }else{
        console.log('111111111')
       console.log(err)


      }

  }
);



       }
       else{
          res.send({
            msg: 'Owner has not connected with stripe.',
            status: 0,
            data: null
          });
       }

    }
  })

}

exports.playerAllInfo = function (req, res) {


  Player.findOne({_id: req.body._id}, function(err, player){

if(player!=null){

  res.send({
  
    status: 1,
    data: player,
    points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
  });

}else{
  res.send({
    
    status: 0,
    
  });


}


  });
}

/////////////////////////////common///////////
    function add_notification(fromId,toId,type,data_params){
  var new_notis = new Notifications({
    fromId : fromId,
    toId : toId,
    type : type,
    data_params : data_params,
    isRead : '0', 
  });
  new_notis.save();
} 