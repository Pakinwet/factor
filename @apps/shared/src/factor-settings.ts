export default {
  googleTagManager: {
    googleTagManagerId: "GTM-THQBLTN"
  },
  bugsnag: {
    clientApiKey: "be2b4a0c651443122cb08f2b5e6afb55"
  },
  emailList: {
    alphaProgram: {
      emails: {
        confirm: {
          successMessage: "Your email is confirmed.",
          subject: "Factor JS: Email Confirmation",
          text: `Just one more step, please confirm your email.`
        },
        complete: {
          subject: "Success!",
          text: `<p>Great work.</p>
            <p>You've successfully signed up. we'll be in touch soon.</p>`
        },
        notify: {
          subject: "New Confirmed Email",
          text: "A new email was added to a list.",
          to: "Andrew Powers <andrew@fiction.com>"
        }
      },
      form: {
        buttonText: "Join Developer Program &rarr;"
      }
    }
  },

  contactForm: {
    email: "support@fiction.com",
    confirm: {
      title: "Got your message.",
      subTitle: "We'll take a look and be in touch as soon as possible."
    }
  }
}
