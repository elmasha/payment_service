const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const fs = require('firebase-admin');



///-----Port-----///
const port = process.env.PORT5 || 3004;
const _urlencoded = express.urlencoded({ extended: false })
app.use(cors())
app.use(express.json())


const serviceAccount = require('./serviceAccountKeys/contest_servicekey.js');

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();

//----AllOW ACCESS -----//
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");


    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});






////-----ACCESS_TOKEN-----
app.get('/access_token', access, (req, res) => {

    res.status(200).json({ access_token: req.access_token })

})



let _checkoutRequestId, _UserID, Username;

//----StkPush ----///
app.post('/stk', access, _urlencoded, function(req, res) {

    let _phoneNumber = req.body.phone
    let _Amount = req.body.amount
    _UserID = req.body.user_id
    Username = req.body.User_name
    var credit = req.body.credit

    let endpoint = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer " + req.access_token

    let _shortCode = '4087943';
    let _passKey = 'bb2724f53956f05ca6772b8a79e193c88953048d221b8f4f47d96c9b8f641dbb'


    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password =
        Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');


    request({
            url: endpoint,
            method: "POST",
            headers: {
                "Authorization": auth
            },

            json: {

                "BusinessShortCode": _shortCode,
                "Password": password,
                "Timestamp": timeStamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": _Amount,
                "PartyA": _phoneNumber,
                "PartyB": _shortCode, //Till  No.
                "PhoneNumber": _phoneNumber,
                "CallBackURL": "https://paymentservice-production-75bf.up.railway.app/contest/stk_callback",
                "AccountReference": "INTEC Payment ",
                "TransactionDesc": "Make payment to Mock app of INTEC"

            }

        },
        (error, response, body) => {

            if (error) {
                console.log(error);
                res.status(404).json(error);

            } else {

                res.status(200).json(body);
                console.log(body);
                console.log("USER_ID", _UserID);
                console.log("USER_Name", Username);
                console.log("USER_Credit", credit);
                console.log("USER_Amount", _Amount);
                _checkoutRequestId = body.CheckoutRequestID;
                console.log("CHECKOUT_ID", _checkoutRequestId);

            }


        })




});

///--End-->>>

const middleware = (req, res, next) => {
    req.checkoutID = _checkoutRequestId;
    req.uid = _UserID;
    req.name = Username;
    next();
};


//---STk CalBack ---///
app.post('/stk_callback', _urlencoded, middleware, function(req, res, next) {
    var transID = '';
    var amount;
    var transdate = '';
    var transNo = '';

    let _checkout_ID = req.checkoutID;
    let _Name = req.name;
    let _UID = req.uid;

    console.log('.......... STK Callback ..................');
    if (res.status(200)) {

        console.log("CheckOutId", _checkout_ID)

        res.json((req.body.Body.stkCallback.CallbackMetadata))
        console.log(req.body.Body.stkCallback.CallbackMetadata)

        if (Balance = req.body.Body.stkCallback.CallbackMetadata.Item[2].Name == 'Balance') {

            amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
            transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
            transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
            transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;

            db.collection("Payments_backup").doc(transID).set({
                mpesaReceipt: transID,
                paidAmount: amount,
                transNo: transNo,
                Doc_ID: _UID,
                checkOutReqID: _checkout_ID,
                user_Name: _Name,
                timestamp: transdate,
            }).then((ref) => {
                console.log("Added doc with ID: ", transID);




                var sfDocRef2 = db.collection("Admin").doc("Total_amount");

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef2).then((sfDoc2) => {
                        if (!sfDoc2.exists) {
                            throw "Document does not exist!";
                        }
                        var newAmount = sfDoc2.data().Total_income;
                        var total_amount = newAmount + amount;
                        transaction.update(sfDocRef2, { Total_income: total_amount });
                        return total_amount;

                    });
                }).then((total_amount) => {
                    console.log("Total_Amount increased to ", total_amount);

                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });






                db.collection("Mock_Candidate").doc(_UID)
                    .collection("Notifications").doc(_checkout_ID).set({
                        title: "Credit payment",
                        desc: "You have successfully deposited amount Ksh " + amount + " to your Mock credit account",
                        type: "Credit paid " + amount,
                        to: _UID,
                        from: _UID,
                        status: 1,
                        timestamp: new Date(),
                    }).then((ref) => {
                        console.log("Notification sent", _UID);

                    }).catch((err) => {
                        console.error(err);
                    });

                ///-----Admin section -----//


                // Create a reference to the SF doc.



                var sfDocRef = db.collection("Mock_Candidate").doc(_UID);

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newCredit = sfDoc.data().Credit;
                        var total_credit = newCredit + amount;
                        transaction.update(sfDocRef, { Credit: total_credit });
                        return total_credit;

                    });
                }).then((total_credit) => {
                    console.log("Credit increased to ", total_credit);

                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });


                ////------Close Admin -----////

            });






        } else {

            amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
            transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
            transNo = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
            transdate = req.body.Body.stkCallback.CallbackMetadata.Item[2].Value;

            db.collection("Payments_backup").doc(transID).set({
                mpesaReceipt: transID,
                paidAmount: amount,
                transNo: transNo,
                Doc_ID: _UID,
                checkOutReqID: _checkout_ID,
                user_Name: _Name,
                timestamp: transdate,
                User_id: _UID,
            }).then((ref) => {
                console.log("Added doc with ID: ", transID);


                db.collection("Mock_Candidate").doc(_UID)
                    .collection("Notifications").doc(_checkout_ID).set({
                        title: "Credit payment",
                        desc: "You have successfully deposited amount Ksh " + amount + " to your Mock credit account",
                        type: "Credit paid " + amount,
                        to: _UID,
                        from: _UID,
                        status: 1,
                        timestamp: new Date(),
                    }).then((ref) => {
                        console.log("Notification sent", _UID);

                    }).catch((err) => {
                        console.error(err);
                    });




                ///-----Admin section -----//



                var sfDocRef = db.collection("Admin").doc("Total_amount");

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newAmount = sfDoc.data().Total_income;
                        var total_amount = newAmount + amount;
                        transaction.update(sfDocRef, { Total_income: total_amount });
                        return total_amount;

                    });
                }).then((total_credit) => {
                    console.log("Total_Amount increased to ", total_amount);

                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });



                // Create a reference to the SF doc.
                var sfDocRef = db.collection("Mock_Candidate").doc(_UID);

                db.runTransaction((transaction) => {
                    return transaction.get(sfDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        var newCredit = sfDoc.data().Credit;
                        var total_credit = newCredit + amount;
                        transaction.update(sfDocRef, { Credit: total_credit });
                        return total_credit;

                    });
                }).then((total_credit) => {
                    console.log("Credit increased to ", total_credit);
                }).catch((err) => {
                    // This will be an "population is too big" error.
                    console.error(err);
                });
                ////------Close Admin -----////

            });







        }

    } else if (res.status(404)) {
        res.json((req.body))
        console.log(req.body.Body);
    }

})

//----End Callback -->>>>



///----STK QUERY ---
app.post('/stk/query', access, _urlencoded, middleware, function(req, res, next) {

    let _checkoutRequestId = req.body.checkoutRequestId
    let _Name = req.name;
    let _UID = req.uid;

    auth = "Bearer " + req.access_token

    let endpoint = 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    let _shortCode = '4087943';
    let _passKey = 'bb2724f53956f05ca6772b8a79e193c88953048d221b8f4f47d96c9b8f641dbb'
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')


    request({
            url: endpoint,
            method: "POST",
            headers: {
                "Authorization": auth
            },

            json: {

                'BusinessShortCode': _shortCode,
                'Password': password,
                'Timestamp': timeStamp,
                'CheckoutRequestID': _checkoutRequestId

            }

        },
        function(error, response, body) {

            if (error) {

                console.log(error);
                res.status(404).json(body);

            } else {
                var resDesc = body.ResponseDescription;

                if (res.status(200)) {
                    res.status(200).json(body)
                    var resDesc = body.ResponseDescription;
                    var resultDesc = body.ResultDesc;


                    console.log("Query Body", body)
                }

                next()
            }

        })

})



function access(res, req, next) {

    let endpoint = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("zvvGuwDPUGvG7EPKlD0x0eA4Isq7CP5p:5xCnqwluYEFlWOLG").toString('base64');

    request({
            url: endpoint,
            headers: {
                "Authorization": "Basic " + auth
            }

        },
        (error, response, body) => {

            if (error) {
                console.log(error);
            } else {

                res.access_token = JSON.parse(body).access_token
                console.log(body)
                next()

            }

        }
    )


}
///----END ACCESS_TOKEN--- 




/////-----Home ------/////
app.get('/', (req, res, next) => {
    res.status(200).send("Hello welcome to Mock Mpesa API")

})





//-- listen
app.listen(port, (error) => {

    if (error) {



    } else {

        console.log(`Server running on port http://localhost:${port}`)

    }


});