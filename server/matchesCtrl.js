'use strict';

var mongoose = require('mongoose'),
  errors = ['', null, undefined, 'null', 'undefined', 0],
  User = mongoose.model('User'),
  //fcm
  FCM = require('fcm-node'),

  serverKey = 'AAAAAatkTPA:APA91bGDlJzOoHyyOrRAEl1DC3-qvxnXU6J8-dGz40RLxCEMCJ7UgEv0vOiF7NJyYbbzkBHBdfH-zjUEcXcJZNyLtppNSis5uG8m3fKcHpmKNm8WkC0dRsUCX36Hh9tPcodkhkXNb80p',

  fcm = new FCM(serverKey),
  //fcm
  team = mongoose.model('team'),
  Match = mongoose.model('Match'),
  Followers = mongoose.model('Followers'),
  MatchResults = mongoose.model('MatchResults'),
  RequestField = mongoose.model('RequestField'),
  Notifications = mongoose.model('Notifications'),
  paymentToOwner = mongoose.model('paymentToOwner'),
  Confirmation = mongoose.model('Confirmation'),
  Player = mongoose.model('Player'),
  Otp = mongoose.model('Otp'),
  Joinmatch = mongoose.model('Joinmatch'),
  path = require('path'),
  Property = mongoose.model('Property'),
  NodeGeocoder = require('node-geocoder'),
  fs = require('fs');
var sg = require('sendgrid')('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');
//----hashing password
var passwordHash = require('password-hash');
//----
var otpGenerator = require('otp-generator');
var multer = require('multer');
var stripe = require('stripe')('sk_test_oDnJiczBF5W5NtF4gphJ2YPT00A5wasqym');
const cron = require("node-cron");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/match/')
  },
  filename: function (req, file, cb) {
    var fileExtn = file.originalname.split('.').pop(-1);
    cb(null, new Date().getTime() + '.' + fileExtn);
  }
});

//multer for property
var uploadproperty = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/property/')
  },
  filename: function (req, file, cb) {
    var fileExtn = file.originalname.split('.').pop(-1);
    cb(null, new Date().getTime() + '.' + fileExtn);
  }
});
 

//this cron runs when match completes
// cron.schedule("50 23 * * *", function() {
cron.schedule("* * * * *", function () {
  //today
  
  var d = new Date();

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

  Match.find({ date: dateStr, status: 1, paid: 0 }, function (err, query_a) {

    if (query_a.length != 0) {
      
      for (let key of query_a) {
        User.findOne({ _id: key.owner_id }, function (err, query_b) {
          if (query_b != null) {
           
                //send push notifications for voting request

                Joinmatch.findOne({match_id: key._id},function(err, allUdis){

                  if(allUdis!=null){
                     for(let key3 of allUdis.player_id){
 
                       var new_notis = new Notifications({
                         fromId: '0',
                         toId: key3,
                         type: 9,
                         data_params: {
                           match_id: key._id
 
                         },
                         isRead: '0',
                       });
 
                       new_notis.save();
 
                       Player.findOne({_id: key3},function(err, player){
                         if(player!=null){
 
                           var to =  player.uid;
                           var title =  'Vote for MOTM';
                           var body =  "Please vote for the player to select as Man of the match";
                           var type = 1; 
 
                           sendpush(to, title, body, type) 
 
                         }
                       });
                     }

                  }
               });

             Match.update({ _id: key._id }, { $set: { paid: 1 } }, { new: true }, function (err, query_a) {


            })

          

          }
        });

      }
    }

  });
});




////////=====backup function//////
 
  // cron.schedule("* * * * *", function () {
  //   //today
  //   console.log('match chrone=================================================');
  //   var d = new Date();
  
  //   var date = d.getDate();
  //   var month = d.getMonth() + 1;  
  //   var year = d.getFullYear();
  //   if (date < 10) {
  //     date = '0' + date;
  //   }
  //   if (month < 10) {
  //     month = '0' + month;
  //   }
  //   var dateStr = year + "-" + month + "-" + date;
  
  //   Match.find({ date: dateStr, status: 1, paid: 0 }, function (err, query_a) {
  
  //     if (query_a.length != 0) {
  //       console.log('enter');
  //       for (let key of query_a) {
  //         User.findOne({ _id: key.owner_id }, function (err, query_b) {
  //           if (query_b != null) {
  //             console.log('1 ');
  
  //             var multi = 1;
  //             if (key.players != 0) {
  //               multi = key.players;
  //             }
  
  //             stripe.transfers.create(
  //               {
  //                 amount: 9000 * multi,
  //                 currency: 'usd',
  //                 destination: query_b.stripe_id,
  //               },
  //               function (err, transfer) {
  //                 console.log(err);
  
  //                 if (transfer == null) {
  //                   var fcm1 = new FCM('AAAAZp5VeyQ:APA91bH51G2KdemsEY4HLLHRVKTLcWbb2XLqW5mTsxqVZQsMB80N896a7baXDkfR8PmHScvTjFaZZE-1pBAGXYx_OeBbkT2JpfL_nO-oZlMwh-_I-ryYULj-JSiI8EWGZJRddhEP1qND');
  
  //                   if (errors.indexOf(query_b.uid) == -1) {
  //                     console.log('fcm enter');
  
  //                     var message = {  
  //                       to: query_b.uid,
  //                       collapse_key: 'your_collapse_key',
  
  //                       notification: {
  //                         title: 'Got payment',
  //                         body: "You got payment for your today's match"
  //                       },
  
  //                     };
  
  //                     fcm1.send(message, function (err, response) {
  //                       console.log(err);
  //                       if (err) {
  //                         console.log("Something has gone wrong!");
  //                       } else {
  //                         console.log("Successfully sent with response: ", response);
  //                       }
  //                     });
  
                      
  
  //                     Joinmatch.findOne({match_id: key.owner_id},function(err, allUdis){
  
  
  //                        if(allUdis!=null){
  //                           for(let key3 of allUdis.player_id){
  
  //                             var new_notis = new Notifications({
  //                               fromId: '0',
  //                               toId: key3,
  //                               type: 9,
  //                               data_params: {
  //                                 match_id: key._id
  
  //                               },
  //                               isRead: '0',
  //                             });
  
  //                             new_notis.save();
  
  
  //                             Player.findOne({_id: key3},function(err, player){
  //                               if(player!=null){
  
  //                                 var to =  player.uid;
  //                                 var title =  'Vote for MOTM';
  //                                 var body =  "Please vote for the player to select as Man of the match";
  //                                 var type = 1; 
  
  //                                 sendpush(to, title, body, type) 
  
  //                               }
  //                             });
  //                           }
  
  
                        
  //                        }
  //                     });
  
                  
  
  
  //                   }
  
  
  
  
  //                   Match.update({ _id: key._id }, { $set: { paid: 1 } }, { new: true }, function (err, query_a) {
  
  
  //                   })
  
  //                   var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
  //                   var data = {
  //                     payId: OTP,
  //                     transaction_id: transfer.id,
  //                     owner_id: key.owner_id,
  //                     player_id: '',
  //                     amount: 9 * key.players,
  //                     type: 1
  //                   }
  //                   var newpayment = new paymentToOwner(data);
  //                   newpayment.save(function (err, paymentOutput) {
  //                     console.log('1');
  //                     query_b
  //                   });
  
  //                   var toId = key.owner_id;
  //                   var fromId = '';
  //                   var params = { match_id: key._id, amount: 9 * key.players }
  //                   add_notification(fromId, toId, 7, params);
  
  
  
  //                 }
  //               });
  //           }
  //         });
  
  //       }
  //     }
  
  //   });
  // });
  

  ////////=====backup function//////


////send notificatin before two hours of match start

cron.schedule("* * * * *", function () {
   

  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }



  var hours = d.getHours();
  var mins = d.getMinutes();

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (mins < 10) {
    mins = '0' + mins;
  }

  var stime = hours + ':' + mins;
  var dateStr = year + "-" + month + "-" + date;

  

  Match.find({ date: dateStr, stime: { $gt: stime }, alert_sent: 0 }, function (err, match) {
    

    if (match.length != 0) {

      for (let key of match) {

        var current_time = hours * 60 + mins;

        var match_hour = key.stime.slice(0, 2);

        var match_min = key.stime.slice(-2);

        var match_time = Number(match_hour) * 60 + Number(match_min)

        var diff = match_time - current_time;
        

        if (diff <= 60) {

          Joinmatch.findOne({ match_id: key._id }, function (err, player_ids) {
            if (player_ids != null) {

              for (let key1 of player_ids.player_id) {
                Player.findOne({ _id: key1 }, function (err, player_details) {

                  var Confirmationdata = {
                    player_id: key1,
                    match_id: key._id,
                  }
                  var newConfirmation = new Confirmation(Confirmationdata);
                  newConfirmation.save();

                  if (player_details != null) {
                   

                    Match.update({ _id: key._id }, { $set: { alert_sent: 1 } }, { new: true }, function (err, matchUpdate) {

                    });
     
                                var to =  player_details.uid;
                                var title =  'Please confirm your availability';
                                var body =  "Match is going to start in less than 2 hours, please confirm your availability";
                                var type = 1; 
                                sendpush(to, title, body, type) 


                  }

                });

              }


            }


          });


        }



      }

    }

  })


});


// slot players in team before 5 mins

cron.schedule("* * * * *", function () {
  
  console.log('slot players=================================================');

  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  if (date < 10) {
    date = '0' + date;
  }
  if (month < 10) {
    month = '0' + month;
  }



  var hours = d.getHours();
  var mins = d.getMinutes();

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (mins < 10) {
    mins = '0' + mins;
  }

  var stime = hours + ':' + mins;
  var dateStr = year + "-" + month + "-" + date;

  

  Match.find({ date: dateStr, stime: { $gt: stime }, slotted: 0 }, function (err, match) {
    

    if (match.length != 0) {
     

      for (let key of match) {
        var all_team1_ids = key.team1_player_ids;
        var all_team2_ids = key.team2_player_ids;

        var current_time = hours * 60 + mins;

      
        
        var match_hour = key.stime.slice(0, 2);

        var match_min = key.stime.slice(-2);
        console.log('id',key._id);
        console.log('hours',match_hour);
        console.log('mins',match_min);

        var match_time = Number(match_hour) * 60 + Number(match_min)

        var diff = match_time - current_time;
      
        console.log('ran slot players diff=================================================');
        console.log(diff);
        if (diff <= 5) {
          console.log('cameeeee');
           
          ////////

          var total;

          total = key.team1_player_ids.length + key.team2_player_ids.length + key.team3_player_ids.length;
       

          if(total% 2 ==0){
            var half = total/2

          }else{
           
            var half =  Math.round(total/2);
             
          }

          var i;
          var first_entries = Math.abs(key.team1_player_ids.length - half);
          console.log('first_entries',first_entries);
          
          for (i = 0; i < key.team3_player_ids.length; i++) {

            if(i+1 <= first_entries){
              console.log('if loop')
              all_team1_ids.push(key.team3_player_ids[i]);
            }
            else{
              console.log('else loop')
              all_team2_ids.push(key.team3_player_ids[i]);
            }

            if(key.team3_player_ids.length == i+1){ 
           
            
            Match.update({_id: String(key._id)},{$set:{team1_player_ids : all_team1_ids, team2_player_ids : all_team2_ids, team3_player_ids: [], slotted:1}}, {new:true},function(){
            
            

            });
          }

          }


        }



      }

    }

  })


});

 
exports.addmatch = async function (req, res) {


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


if(dateStr==req.body.date){

  if(req.body.stime < stime ){
    res.send({
      
      status: 6,
      
    });
    
  }else if(req.body.etime < req.body.stime){
    res.send({
       
      status: 7,
     
    });
  
  
  }else{
  
    callMatch();
    
  }
 

}else{

  if(req.body.etime < req.body.stime){
    res.send({
       
      status: 7,
     
    });
  
  
  }else{

    callMatch()
    
  }

 
}


async function callMatch(){
  var matchExists = await Match.find(
    {
      $and: [
        {
          $or: [
            { stime: { $gte: req.body.stime, $lte: req.body.stime } },
            { stime: { $gte: req.body.etime, $lte: req.body.etime } },
            { etime: { $gte: req.body.stime, $lte: req.body.stime } },
            { etime: { $gte: req.body.etime, $lte: req.body.etime } }
          ]
        },
        {
          date: req.body.date,
        }
        , {
          status: 1
        }
      ]
    }
  );

  if (matchExists.length == 0) {
   

    var match = await Property.findOne({ owner_id: req.body._id });

    if (match != null) {


      const data = {
        owner_id: req.body._id,
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        stime: req.body.stime,
        etime: req.body.etime,
        players: req.body.players,
        team1: req.body.team1_name,
        team2: req.body.team2_name,
        team1_player_ids: req.body.team1_player_ids,
        team2_player_ids:req.body.team2_player_ids,
        team1_team_id: req.body.team1_team_id,
        team2_team_id: req.body.team2_team_id,
        team_2_type: req.body.team_2_type,
        team_1_type: req.body.team_1_type,
        gender: req.body.gender,
        request_match: req.body.request_match,
        fullday: req.body.fullday,
        status : req.body.request_match =='1' ? 0 : 1
      }

      if (req.body.request_match == '1') {
        data['paid'] = 1
      }

      var new_match = new Match(data);
      new_match.save(async function (err, match) {
        if (match == null) {
          res.send({
            msg: 'Internal Server Error, Try again',
            status: 0,
            data: null
          });
        } else {
          //

          //push players to join match

          var total_players = req.body.team1_player_ids.concat(req.body.team2_player_ids);
    
          if(errors.indexOf(req.body.team1_team_id)==-1){
           
            var teamRes = await team.findOne({_id: req.body.team1_team_id});
            if(teamRes!=null){
   
              total_players = total_players.concat(teamRes.players);
            }
          }

          if(errors.indexOf(req.body.team2_team_id)==-1){
          
            var teamRes2 = await team.findOne({_id: req.body.team2_team_id});
            if(teamRes2!=null){
            
              total_players = total_players.concat(teamRes2.players);
            }
          }

          var plrids =[]
          
          for(let key of total_players){

            if(plrids.indexOf(key)==-1){
              plrids.push(key);

            }

          }
        
            var data= {
              match_id : match._id ,
              player_id : plrids                           

            }
            var Joinnewmatch = new Joinmatch(data);
            Joinnewmatch.save(function(err, user) {  


            }); 
            
        
          //push players to join match

          Followers.findOne({ owner_id: req.body._id }, function (err, FollowersID) {

            if (FollowersID != null) {
              var toId = FollowersID.player_id;
              var fromId = req.body._id;
              var params = { match_id: String(match._id) }

              add_notification(fromId, toId, 1, params);

            }


          });
          //

          if (req.body.request_match == '1') {

            var toId = req.body.player_id;
            var fromId = req.body._id;
            var params = { match_id: String(match._id) }

              add_notification(fromId, toId, 10, params);
             

            RequestField.update({ _id: req.body.r_id }, { $set: { status: 2 } }, { new: true }, function (err, user) {

            });

          }


          
          var player_ids = [];
          var i = 0;
          Player.find({ status: 1 }, function (err, players) {
           
            if (players.length != 0) {
              for (let key of players) {
                if (errors.indexOf(key.uid) == -1) {
                  player_ids.push(key.uid);
                }

                i++;

                if (i == players.length) {
                  User.findOne({ _id: req.body._id }, function (err, admin_details) {
                    var owner_name = admin_details.fname;

                    if (player_ids.length > 0) {

                          var to =  player_ids;
                          var title =  'New match added';
                          var body = 'A new match has been added by ' + owner_name.charAt(0).toUpperCase() + owner_name.slice(1) ;
                          var type = 2; 

                          sendpush(to, title, body, type) 
                    }


                    if (req.body.request_match == '1') {

                      Player.findOne({ _id: req.body.player_id }, function (err, player_token) {
                       
                        if (player_token != null) {


                          if (errors.indexOf(player_token.uid) == -1) {


                              var to =  player_token.uid;
                              var title =  'Field request is accepted';
                              var body =  'Your field request is accepted by ' + owner_name.charAt(0).toUpperCase() + owner_name.slice(1)
                              var type = 1; 

                              sendpush(to, title, body, type); 


                          }



                        }

                      });


                    }

                  });




                }
              }
            }


          });



          res.send({
            msg: 'Match is added',
            status: 1,
            data: match
          });
        }
      });
     




    } else {
      res.send({
        msg: 'Please update your property details before adding match',
        status: 3,
        data: null
      });


    }



  } else {

    res.send({
      msg: 'This time slot is already taken',
      status: 4,
      data: null
    });

  }


}




}

exports.todayMatches = async function (req, res) {
   
  var ids = [req.body._id]

  var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

  var match_ids = [];
  if(joinIds.length!=0){
   
    for(let key of joinIds){
      match_ids.push(key.match_id);
    }

  }

  

  var d = new Date();

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

  var owners = await Followers.find({ "player_id": {"$in": ids}});

  var owner_id=[];
 
  if(owners.length!=0){

    for(let key of owners){
      owner_id.push(key.owner_id)

    }

  }
  

  Match.find({$or: [{ "owner_id": {"$in": owner_id}, date: dateStr , status: 1}, {_id: {$in : match_ids}, date: dateStr , status: 1}]},function(err, match){
    console.log(match);
    if (match.length == 0) {
      res.send({
        msg: 'no data',
        status: 0,
        data: []
      });
    } else {

      var i = 0;
      var DataArray=[]

      for (let key of match) {

        Joinmatch.findOne({ match_id: key._id }, function (err, join) {

          var dict= { 

            date: key.date,
            etime:  key.etime,
            fullday: key.fullday,
            gender:  key.gender,
            location:  key.location,
            name:  key.name,
            owner_id:  key.owner_id,
            paid:  key.paid,
            players:  key.players,
            request_match:  key.request_match,
            status:  key.status,
            stime: key.stime,
            team1_name:  key.team1_name,
            team1_player_ids:  key.team1_player_ids,
            team2_name:  key.team2_name,
            team2_player_ids:  key.team2_player_ids,
            team_1_type:  key.team_1_type,
            team_2_type: key.team_2_type,
            _id: key._id
    }

          if(join == null){
            dict['status']= '0'

          }else{
            dict['status']= join.player_id.length;

          }
          DataArray.push(dict);

          i++;
          if (match.length == i) {

            res.send({
              msg: 'match list',
              status: 1,
              data: DataArray
            });
          }
        });


      }
    }
        
  })

}


///owner's match//
exports.ownerTodayMatches = async function (req, res) {



  var d = new Date();

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
  console.log(dateStr);

  Match.find({ "owner_id": req.body._id, date: { $eq: dateStr }, status: 1},function(err, match){
    console.log(match);
    if (match.length == 0) {
      res.send({
        msg: 'no data',
        status: 0,
        data: []
      });
    } else {

      var i = 0;
      var DataArray=[]

      for (let key of match) {

        Joinmatch.findOne({ match_id: key._id }, function (err, join) {

          var dict= { 

            date: key.date,
            etime:  key.etime,
            fullday: key.fullday,
            gender:  key.gender,
            location:  key.location,
            name:  key.name,
            owner_id:  key.owner_id,
            paid:  key.paid,
            players:  key.players,
            request_match:  key.request_match,
            status:  key.status,
            stime: key.stime,
            team1_name:  key.team1_name,
            team1_player_ids:  key.team1_player_ids,
            team2_name:  key.team2_name,
            team2_player_ids:  key.team2_player_ids,
            team_1_type:  key.team_1_type,
            team_2_type: key.team_2_type,
            _id: key._id
    }

          if(join == null){
            dict['status']= '0'

          }else{
            dict['status']= join.player_id.length;

          }
          DataArray.push(dict);

          i++;
          if (match.length == i) {

            res.send({
              msg: 'match list',
              status: 1,
              data: DataArray
            });
          }
        });


      }
    }
        





  })

}



///owner's match//
exports.ownerUpcomingMatches = async function (req, res) {

  var d = new Date();

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
  console.log(dateStr);

  Match.find({ "owner_id": req.body._id, date: { $gt: dateStr }, status: 1},function(err, match){
    console.log(match);
    if (match.length == 0) {
      res.send({
        msg: 'no data',
        status: 0,
        data: []
      });
    } else {

      var i = 0;
      var DataArray=[]

      for (let key of match) {

        Joinmatch.findOne({ match_id: key._id }, function (err, join) {

          var dict= { 

            date: key.date,
            etime:  key.etime,
            fullday: key.fullday,
            gender:  key.gender,
            location:  key.location,
            name:  key.name,
            owner_id:  key.owner_id,
            paid:  key.paid,
            players:  key.players,
            request_match:  key.request_match,
            status:  key.status,
            stime: key.stime,
            team1_name:  key.team1_name,
            team1_player_ids:  key.team1_player_ids,
            team2_name:  key.team2_name,
            team2_player_ids:  key.team2_player_ids,
            team_1_type:  key.team_1_type,
            team_2_type: key.team_2_type,
            _id: key._id
    }

          if(join == null){
            dict['status']= '0'

          }else{
            dict['status']= join.player_id.length;

          }
          DataArray.push(dict);

          i++;
          if (match.length == i) {

            res.send({
              msg: 'match list',
              status: 1,
              data: DataArray
            });
          }
        });


      }
    }
        
  })

}


///owner's match//
exports.ownersearchMatches = async function (req, res) {

  console.log(req.body);
  
  var d = new Date();

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
  console.log(dateStr);

  Match.find(
  
  {  $and: [
      { $or: [{ date: { $regex: req.body.keyword, $options: 'i' } },{ name: { $regex: req.body.keyword, $options: 'i' } }, { etime: { $regex: req.body.keyword, $options: 'i' } }, { stime: { $regex: req.body.keyword, $options: 'i' } }, { location: { $regex: req.body.keyword, $options: 'i' } }] },
      { date: { $gte: dateStr } },
      { status: 1 },
      { "owner_id": req.body._id, date: { $gte: dateStr }}
    ]
  }
    
    ,function(err, match){
    
    if (match.length == 0) {
      res.send({
        msg: 'no data',
        status: 0,
        data: []
      });
    } else {

      var i = 0;
      var DataArray=[]

      for (let key of match) {

        Joinmatch.findOne({ match_id: key._id }, function (err, join) {

          var dict= { 

            date: key.date,
            etime:  key.etime,
            fullday: key.fullday,
            gender:  key.gender,
            location:  key.location,
            name:  key.name,
            owner_id:  key.owner_id,
            paid:  key.paid,
            players:  key.players,
            request_match:  key.request_match,
            status:  key.status,
            stime: key.stime,
            team1_name:  key.team1_name,
            team1_player_ids:  key.team1_player_ids,
            team2_name:  key.team2_name,
            team2_player_ids:  key.team2_player_ids,
            team_1_type:  key.team_1_type,
            team_2_type: key.team_2_type,
            _id: key._id
    }

          if(join == null){
            dict['status']= '0'

          }else{
            dict['status']= join.player_id.length;

          }
          DataArray.push(dict);

          i++;
          if (match.length == i) {

            res.send({
              msg: 'match list',
              status: 1,
              data: DataArray
            });
          }
        });


      }
    }
        
  })

}

exports.upcomingMatches = async function (req, res) {

  var ids = [req.body._id]

  var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

  var match_ids = [];
  if(joinIds.length!=0){
   
    for(let key of joinIds){
      match_ids.push(key.match_id);
    }

  }

  var d = new Date();
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


  var ids=[req.body._id];


  var owners = await Followers.find({ "player_id": {"$in": ids}});
  var owner_id=[];
 
  if(owners.length!=0){

    for(let key of owners){
      owner_id.push(key.owner_id)

    }

  }


  Match.find({$or: [{ "owner_id": {"$in": owner_id}, date: { $gt: dateStr } , status: 1}, {_id: {$in : match_ids}, date: { $gt: dateStr } , status: 1}]},function(err, match){

    if(match.length!=0){
      var i = 0;
      var totalArray = [];
      for (let key of match) {

        Joinmatch.findOne({ match_id: key._id }, function (err, join) {

          var dic = {
            _id: key._id,
            updatedAt: key.updatedAt,
            createdAt: key.createdAt,
            owner_id: key.owner_id,
            name: key.name,
            location: key.location,
            date: key.date,
            stime: key.stime,
            etime: key.etime,
            players: key.players,
            cover: key.cover,
            team1: key.team1,
            team2: key.team2,
            gender:  key.gender,

          }
          if (join == null) dic["status"] = '0';
          else dic["status"] = join.player_id.length;

          totalArray.push(dic);
          i++;
          if (match.length == i) {

            res.send({
              msg: 'match list',
              status: 1,
              data: totalArray
            });
          }
        });
      }

    }else{
      res.send({
        msg: 'No match',
        status: 0,
        data: []
      });


    }

  });

}


exports.searchmatch = async function (req, res) {
 

var ids = [req.body._id]

var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

var match_ids = [];
if(joinIds.length!=0){
 
  for(let key of joinIds){
    match_ids.push(key.match_id);
  }

}

var d = new Date();
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


var ids=[req.body._id];


var owners = await Followers.find({ "player_id": {"$in": ids}});
var owner_id=[];

if(owners.length!=0){

  for(let key of owners){
    owner_id.push(key.owner_id)

  }

}

var condition1 = {"owner_id": {"$in": owner_id}, date: { $gte: dateStr } , status: 1};
var condition2 = {_id: {$in : match_ids}, date: { $gte: dateStr } , status: 1};
if(errors.indexOf(req.body.keyword) == -1){
  condition1['$or'] = [ 
    {name : { '$regex' : req.body.keyword, '$options' : 'i' }},
    {etime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
    {stime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
    {location : { '$regex' : req.body.keyword, '$options' : 'i' }} 
  ]
  condition2['$or'] = [ 
    {name : { '$regex' : req.body.keyword, '$options' : 'i' }},
    {etime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
    {stime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
    {location : { '$regex' : req.body.keyword, '$options' : 'i' }} 
  ]
}


Match.find({$or: [
  condition1, condition2
]
},function(err, match){

  if(match.length!=0){
    var i = 0;
    var totalArray = [];
    for (let key of match) {

      Joinmatch.findOne({ match_id: key._id }, function (err, join) {

        var dic = {
          _id: key._id,
          updatedAt: key.updatedAt,
          createdAt: key.createdAt,
          owner_id: key.owner_id,
          name: key.name,
          location: key.location,
          date: key.date,
          stime: key.stime,
          etime: key.etime,
          players: key.players,
          cover: key.cover,
          team1: key.team1,
          team2: key.team2,
          gender:  key.gender,

        }
        if (join == null) dic["status"] = '0';
        else dic["status"] = join.player_id.length;

        totalArray.push(dic);
        i++;
        if (match.length == i) {

          res.send({
            msg: 'match list',
            status: 1,
            data: totalArray
          });
        }
      });
    }

  }else{
    res.send({
      msg: 'No match',
      status: 0,
      data: []
    });


  }

});


////////

}


exports.myupcomingMatches = function (req, res) {

  var d = new Date();

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


  Match.find({ owner_id: req.body._id, date: { $gt: dateStr }, status: 1 }, async function (err, match) {

    if (match.length == 0) {
      res.send({
        msg: 'Internal Server Error, Try again',
        status: 0,
        data: null
      });
    } else {

    

      var i = 0;
      var  resData =[]
      for (let key of match) {


      var Joined = await Joinmatch.findOne({match_id : key._id});
        
      var dict = await {
        alert_sent: key.alert_sent,
        createdAt: key.createdAt,
        date: key.date,
        etime: key.etime,
        fullday: key.fullday,
        gender: key.gender,
        location: key.location,
        name: key.name,
        owner_id: key.owner_id,
        paid: key.paid,
        players: key.players,
        request_match: key.request_match,
        status: Joined!=null ? Joined.player_id.length : 0,
        stime: key.stime,
        team1: key.team1,
        team1_player_ids: key.team1_player_ids,
        team2: key.team2,
        team2_player_ids: key.team2_player_ids,
        team2_team_id: key.team2_team_id,
        team_1_type: key.team_1_type,
        team_2_type: key.team_2_type,
        updatedAt: key.updatedAt,
        _id: key._id,
      }

      resData.push(dict);
        i++;
        if (i == match.length) {
          res.send({
            msg: 'requests',
            status: 1,
            data: resData
          });

        }

      }

    }

  });

}

////owner prevous matches////
exports.ownerMyPreviousMatches = function (req, res) {

  var d = new Date();

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


  Match.find({ owner_id: req.body._id, date: { $lt: dateStr }, status: 1 }, async function (err, match) {

    if (match.length == 0) {
      res.send({
        msg: 'Internal Server Error, Try again',
        status: 0,
        data: null
      });
    } else {

    

      var i = 0;
      var  resData =[]
      for (let key of match) {


      var Joined = await Joinmatch.findOne({match_id : key._id});
        
      var dict = await {
        alert_sent: key.alert_sent,
        createdAt: key.createdAt,
        date: key.date,
        etime: key.etime,
        fullday: key.fullday,
        gender: key.gender,
        location: key.location,
        name: key.name,
        owner_id: key.owner_id,
        paid: key.paid,
        players: key.players,
        request_match: key.request_match,
        status: Joined!=null ? Joined.player_id.length : 0,
        stime: key.stime,
        team1: key.team1,
        team1_player_ids: key.team1_player_ids,
        team2: key.team2,
        team2_player_ids: key.team2_player_ids,
        team2_team_id: key.team2_team_id,
        team_1_type: key.team_1_type,
        team_2_type: key.team_2_type,
        updatedAt: key.updatedAt,
        _id: key._id,
      }

      resData.push(dict);
        i++;
        if (i == match.length) {
          res.send({
            msg: 'requests',
            status: 1,
            data: resData
          });

        }

      }

    }

  });

}


////owner pre matches///////

exports.mypreviousMatches = async (req, res) => {


  var ids =[req.body._id]

  var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

  console.log(joinIds)

  var match_ids = [];
  if(joinIds.length!=0){
   
    for(let key of joinIds){
      match_ids.push(key.match_id);
    }

  }

  
  var d = new Date();

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
  
////////////////////

var ids=[req.body._id];
var owners = await Followers.find({ "player_id": {"$in": ids}});

if(owners.length!=0){
  var owner_id=[];
  var cont= 0;
  for(let key of owners){
    owner_id.push(key.owner_id);
    cont++;
    
        if(cont==owners.length){

          Match.find( {$or: [{ owner_id: req.body._id, date: { $lt: dateStr }, status: 1 }, {_id: {$in : match_ids}, date: { $lt: dateStr } , status: 1} ]}, function (err, match) {

            if (match.length == 0) {
              res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: null
              });
            } else {
        
              var i = 0;
        
              match.forEach(function (key) {
        
                Player.findOne({ match_id: key._id }, function (err, player) {
        
                  MatchResults.findOne({ match_id: key._id }, function (err, results) {
        
                    if (player != null) { match[i]['status'] = player.player_id.length; }
                    else { match[i]['status'] = 0; }
        
                    if (results != null) { match[i]['team1'] = '1'; }
                    else { match[i]['team1'] = '0'; }
        
                    if (match[i]['team1'] == '0' || match[i]['team1'] == '1') {
        
                      i++;
                    }
        
                    if (i == match.length) {
                      res.send({
                        msg: 'requests',
                        status: 1,
                        data: match
                      });
                    }
                  });
                });
              });
            }
          });
 

        }
          
          }
        
        
        
        }else{

          res.send({
                  msg: 'No match',
                  status: 0,
                  data: []
                });

}



////////////////////

}

exports.updateProperty = (req, res) => {

  var upload = multer({ storage: uploadproperty }).single('file');
  upload(req, res, function (err) {

    User.findOne({ email: req.body.email }, function (err, owner) {
      if (owner == null) {
        res.send({
          msg: 'No owner exists for this email',
          status: 2,
          data: null
        });
      } else {
        var id = owner._id;
        Property.findOne({ owner_id: id }, function (err, match) {
          var data = {
            owner_id: id,
            name: req.body.name,
            area: req.body.area,
            state: req.body.state,
            city: req.body.city,
            zip: req.body.zip,
            address: req.body.address,
            descr: req.body.descr,
            lat: req.body.lat,
            lng: req.body.lng,

          }
          if (errors.indexOf(req.file) == -1) {
            data['cover'] = req.file.filename;

          }

          if (match == null) {
            var addProperty = new Property(data);
            addProperty.save(function (err, match) {
              console.log(err);

              if (match == null) {
                res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              } else {
                res.send({
                  msg: 'Propery has been added',
                  status: 1,
                  data: match

                });

              }

            });

          } else {

            Property.update({ owner_id: id }, { $set: data }, { new: true }, function (err, match) {
              console.log(match);
              if (match == null) {
                res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              } else {
                res.send({
                  msg: 'Propery has been updated',
                  status: 1,
                  data: match

                });
              }
            });
          }
        });
      }
    });
  });

}


exports.getProperty = function (req, res) {

  Property.findOne({ owner_id: req.body._id }, function (err, match) {

    if (match == null) {
      res.send({
        msg: 'Internal Server Error, Try again',
        status: 0,
        data: null
      });
    } else {
      res.send({
        msg: 'property details',
        status: 1,
        data: match

      });

    }

  });

}



exports.updatePropertyByOwner = (req, res) => {

  var upload = multer({ storage: uploadproperty }).single('file');
  upload(req, res, function (err) {

    var id = req.body._id;
    Property.findOne({ owner_id: id }, function (err, match) {
      var data = {
        owner_id: id,
        name: req.body.name,
        area: req.body.area,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,
        address: req.body.address,
        descr: req.body.descr,
        lat: req.body.lat,
        lng: req.body.lng,

      }
      if (errors.indexOf(req.file) == -1) {
        data['cover'] = req.file.filename;

      }

      if (match == null) {
        var addProperty = new Property(data);
        addProperty.save(function (err, match) {
          console.log(err);

          if (match == null) {
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          } else {
            res.send({
              msg: 'Propery has been added',
              status: 1,
              data: match

            });

          }

        });

      } else {

        Property.update({ owner_id: id }, { $set: data }, { new: true }, function (err, match) {
          console.log(match);
          if (match == null) {
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          } else {
            res.send({
              msg: 'Propery has been updated',
              status: 1,
              data: match

            });
          }
        });
      }
    });

  });

}

function add_notification(fromId, toId, type, data_params) {
  var new_notis = new Notifications({
    fromId: fromId,
    toId: toId,
    type: type,
    data_params: data_params,
    isRead: '0',
  });
  new_notis.save();
}




//common function for push notifications
function sendpush(to, title, body, type) {

  var c_k='your_collapse_key';

  if(type==1){
 

                var msg = { 

                          to: to,
                          collapse_key: c_k,

                          notification: {
                            title: title,
                            body:body
                          },

                        };
                          console.log('11111111111111111111111111111')

                         console.log(msg)

                push_noti(msg);




  }else{
             var msg = { 

                          registration_ids: to,
                          collapse_key: c_k,

                          notification: {
                            title: title,
                            body:body
                          },

                        };
                        console.log('222222222222222222222222')
                         console.log(msg)

              push_noti(msg);


  }

    function push_noti(audience, msg){

                  fcm.send(msg, function (err, response) {
                      console.log(err);
                      if (err) {
                        console.log("Something has gone wrong!");
                      } else {
                        console.log("Successfully sent with response: ", response);
                      }
                    });

                   }

               
}