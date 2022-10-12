/*
smtp_username
smtp_password
ssl_port
smtp_host_name

sender_email
sender_name
reply_to
subject
email_list

send_message (button)
*/

var smtp_username = document.getElementById('smtp_username')
var smtp_password = document.getElementById('smtp_password')
var ssl_port = document.getElementById('ssl_port')
var smtp_host_name = document.getElementById('smtp_host_name')

var sender_email = document.getElementById('sender_email')
var sender_name = document.getElementById('sender_name')
var reply_to = document.getElementById('reply_to')
var subjectDOM = document.getElementById('subject')
var email_list = document.getElementById('email_list')
var messageDOM = document.getElementById('message')

var send_message = document.getElementById('send_message')

var error = document.getElementById('error')
var loading = document.getElementById('loading')
var success = document.getElementById('success')

var host = ''
var port = 0
var user = ''
var pass = ''

var senderEmail = ''
var senderName = ''
var replyTo = ''
var subject = ''
var to = ''
var message = ''

smtp_username.addEventListener('input', event => {
    user = event.target.value
})

smtp_password.addEventListener('input', event => {
    pass= event.target.value
})

ssl_port.addEventListener('input', event => {
    port = event.target.value
})

smtp_host_name.addEventListener('input', event => {
    host = event.target.value
})

sender_email.addEventListener('input', event => {
    senderEmail = event.target.value
})

sender_name.addEventListener('input', event => {
    senderName = event.target.value
})

reply_to.addEventListener('input', event => {
    replyTo = event.target.value
})

subjectDOM.addEventListener('input', event => {
    subject = event.target.value
})

email_list.addEventListener('input', event => {
    to = event.target.value
})

messageDOM.addEventListener('input', event => {
    message = event.target.value
})

send_message.addEventListener('click', event => {
    console.log('sending...')
    event.preventDefault()

    error.style.display = 'none'
    success.style.display = 'none'
    loading.style.display = 'block'

    var payload = {
        smtpData: {
            host,
            port,
            user,
            pass,
        },
        emailData: {
            from: `${senderName} <${senderEmail}>`,
            to,
            replyTo,
            subject,
            html: message
        }
    }

    let options = {
        headers: {
            "content-type":"application/json; charset=UTF-8"
        },
        body: JSON.stringify(payload),
        method: 'POST'
    }

    fetch('http://localhost:3000/blast', options)
        .then(res => res.json())
        .then(data => {
            loading.style.display = 'none'
            console.log(data)

            if(data.status === 'success'){
                success.style.display = 'block'
            }
            else {
                error.style.display = 'block'
            }
        })
})