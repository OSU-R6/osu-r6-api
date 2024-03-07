var AWS = require("aws-sdk")

AWS.config.update({ region: 'us-east-2' })

function sendEmailVerification (token, email, firstName) {
    var params = {
        Destination: {
            ToAddresses: [`${email}`],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <div style="background-color:black; padding:3em; height:100%; color:white;">
                        <div style="display:flex;">
                            <a href="https://osu-r6.org"><img src="https://osu-r6.org/images/image6.png" alt="OSU R6 logo" style="width: 100px; height: 100px;"/></a>
                            <div style="font-size:4em; font-weight:bold; margin-top:15px; margin-left:10px">Oregon State Rainbow Six</div>
                        </div>
                        <div style="background-color:#DC4405; padding-top:5px; margin-top:10px"></div>
                        <div style="color: white; padding-top:1.5rem;">
                            <div style="font-size:2rem; font-weight:bold">Hey ${firstName}, Welcome to Oregon State Rainbow Six!<div/>
                            <div style="font-size:1.5rem; font-weight:bold; margin-top:1rem;">Click <a href="https://osu-r6.org/verify/${token}" style="text-decoration:none; color:#DC4405;">here</a> to verify your email.</div>
                            <div style="margin-top:3rem; font-size:1rem;" >If you did not register at OSU-R6.org, disregard this email.</div>
                        </div>
                    </div>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Click here to verify your email: https://osu-r6.org/verify/${token}`,
                },
            },
            Subject: {
            Charset: "UTF-8",
            Data: "OSU R6 Email Verification",
            },
        },
        Source: "no-reply@osu-r6.org"
    }

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
    .then(function (data) {
        //console.log(data.MessageId);
    })
    .catch(function (err) {
        console.error(err, err.stack)
    })
}

exports.sendEmailVerification = sendEmailVerification
