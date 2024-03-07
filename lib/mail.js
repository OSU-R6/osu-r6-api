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
                    <div style="background-color:black color:white">
                    <img src="https://osu-r6.org/images/image6.png" alt="OSU R6 logo" style="width: 100px; height: 100px;"/>
                    <h1>Hey ${firstName}, Welcome to Oregon State Rainbow Six!<h1/>
                    <h2>Click <a href="https://osu-r6.org/verify/${token}">here</a> to verify your email</h2>
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
        console.log(data.MessageId)
    })
    .catch(function (err) {
        console.error(err, err.stack)
    })
}

exports.sendEmailVerification = sendEmailVerification
