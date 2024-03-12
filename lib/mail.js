var AWS = require("aws-sdk")

AWS.config.update({ region: 'us-east-2' })

const headerHtml = `
    <div style="display:flex;">
        <a href="https://osu-r6.org"><img src="https://osu-r6.org/images/image6.png" alt="OSU R6 logo" style="width: 100px; height: 100px;"/></a>
        <div style="font-size:4em; font-weight:bold; margin-top:15px; margin-left:10px">Oregon State Rainbow Six</div>
    </div>
    <div style="background-color:#DC4405; padding-top:5px; margin-top:10px"></div>`

function sendPasswordResetEmail (token, email, firstName) {
    const htmlContent = `
        <div style="background-color:black; padding:3em; height:100%; color:white;">
            ${headerHtml}
            <div style="color: white; padding-top:1.5rem;">
                <div style="font-size:2rem; font-weight:bold">Hey ${firstName}, sorry to hear you are having issues logging into your account.<div/>
                <div style="font-size:1.5rem; font-weight:bold; margin-top:1rem;">To reset your OSU-R6.org password, click <a href="https://osu-r6.org/password-recovery/reset/${token}" style="text-decoration:none; color:#DC4405;">here</a>.</div>
                <div style="margin-top:3rem; font-size:1rem;">If you did not request a password reset at OSU-R6.org, disregard this email.</div>
            </div>
        </div>`
    const textContent = `Click here to reset your password: https://osu-r6.org/password-recovery/reset/${token}`
    const subject = "OSU R6 Password Reset Request"  
    const source = "no-reply@osu-r6.org"
    const destination = {
        ToAddresses: [`${email}`],
    }
    sendEmail(destination, htmlContent, textContent, subject, source)
}
exports.sendPasswordResetEmail = sendPasswordResetEmail

function sendEmailVerification (token, email, firstName) {
    const htmlContent = `
        <div style="background-color:black; padding:3em; height:100%; color:white;">
            ${headerHtml}
            <div style="color: white; padding-top:1.5rem;">
                <div style="font-size:2rem; font-weight:bold">Hey ${firstName}, Welcome to Oregon State Rainbow Six!<div/>
                <div style="font-size:1.5rem; font-weight:bold; margin-top:1rem;">Click <a href="https://osu-r6.org/verify/${token}" style="text-decoration:none; color:#DC4405;">here</a> to verify your email.</div>
                <div style="margin-top:3rem; font-size:1rem;">If you did not register at OSU-R6.org, disregard this email.</div>
            </div>
        </div>`
    const textContent = `Click here to verify your email: https://osu-r6.org/verify/${token}`
    const subject = "OSU R6 Email Verification"  
    const source = "no-reply@osu-r6.org"
    const destination = {
        ToAddresses: [`${email}`],
    }
    sendEmail(destination, htmlContent, textContent, subject, source)
}
exports.sendEmailVerification = sendEmailVerification

function sendEmail(destination, htmlContent, textContent, subject, source) {
    var params = {
        Destination: destination,
        Message: {
            Body: {  
                Html: {
                    Charset: "UTF-8",
                    Data: htmlContent,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textContent,
                }
            } ,
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: source,
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
