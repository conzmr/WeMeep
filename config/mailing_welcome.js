var helper = require('sendgrid').mail
const sendgrid = require('sendgrid')('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')

var sendMail = function(req, user, callback) {

        // Set email information
        var from_email = new helper.Email('l@wetopia.co', 'Wetopia'); //email, fromname
        var to_email = new helper.Email(user.email)
        var subject = 'Invitation Request';
        var content = new helper.Content('text/html', 'Welcome to Wetopia'); //This is literally the content; expressed in html if template is needed
        var mail = new helper.Mail(from_email, subject, to_email, content);

        // Set template id
        //TODO: Manage multiple languages
        mail.setTemplateId('8e523446-ee22-43be-9d98-fe872989fc47');

        // Replace user's name in template. Depends on template
        mail.personalizations[0].addSubstitution(new helper.Substitution('-name-', user.name));

        // Requests to SendGrid API
        // Send mail request
        var send_request = sendgrid.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON(),
        })

        console.log("EMAIL: " + user.email);
        // Add recipient request
        var recipient_request = sendgrid.emptyRequest({
          method: 'POST',
          path: '/v3/contactdb/recipients',
          body: [{"email": user.email, "first_name": user.name}]
        })


        // create recipient - add it to list - send email
        // Create recipient
        sendgrid.API(recipient_request, function (error, response) {
          if (error){
            response.message = "Error"
            response.error = error
            response.success = false
          } else {
            response.success = true
            //Get recipient id
            var recipient_id = response.body.persisted_recipients[0];

            // Add to contact list
            var list_request = sendgrid.emptyRequest({
              method: 'POST',
              path: '/v3/contactdb/lists/730625/recipients/' + recipient_id,
            })

            sendgrid.API(list_request, function (error, response) {
              // Send mail
              sendgrid.API(send_request, function (error, response) {
                    console.log(response.statusCode)
                    console.log(response.body)
                    console.log(response.headers)
              })
            })
          }
          callback(response)
        })

}

module.exports = {
  sendMail
}
