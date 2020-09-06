const express = require('express');
const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlConnection = require('./mysql/connection');
const sendMessage = require('./sendMessage');
// const accnt_sid = 'AC34364b77470b6dc9dfc89002aa7e6010';
// const auth_token = '4ffa3eaf887aba8947add20186990b64';
// const client = twilio(accnt_sid, auth_token);
const app = express();

const port = process.env.PORT || 3000;
app.use(
  session({
    secret: 'Be-a-beginner-everyday',
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get('/', (req, res) => {
  res.status(200).send('Welocme to Visit app!');
});

app.post('/sms', (req, res) => {
  const resp = new MessagingResponse();
  const userMsg = req.body.Body.trim();
  //   console.log(req.body);
  const userPhoneNum = req.body.From;
  const buzzPhoneNum = req.body.To;

  //   console.log(
  //     `User Number: ${userPhoneNum}\n Business Number: ${buzzPhoneNum}`
  //   );

  let userArr = req.session.info || [];

  userArr.push(userMsg);

  if (userArr.length == 1) {
    //Send a welocme message
    resp.message(
      `Hello!\nनमस्ते 🙏\nWelcome to Doctor on Call service 👩‍⚕️\nडॉक्टर ऑन कॉल सेवा में आपका स्वागत है👨‍⚕️\n- 💬 Type and send 1 for English\n- 💬 हिंदी के लिए 2 लिख कर भेजे`
    );
    req.session.info = userArr;
    res.status(200).send(resp.toString());
  } else {
    //Session has started ask for language
    if (userArr[1] == 1) {
      //English language chosen
      if (!userArr[2]) {
        resp.message(
          `Book Phone Consultation with experienced doctors on WhatsApp in 4 simple steps-\n\n♀️/♂️ Tell us patient Name, Age and Gender\n\n👩‍⚕️Select a Doctor\n\n💸 Click on payment link and complete online payment \n\n📞 📃 Consult Doctor on Phone and receive Prescription on WhatsApp\n\nPlease enter patients name`
        );
        req.session.info = userArr;
        res.status(200).send(resp.toString());
        // sendMessage();
      } else {
        if (!userArr[3]) {
          //Username has been entered
          resp.message(`What is the patient's age, in years? Ex. 25`);
          req.session.info = userArr;
          res.status(200).send(resp.toString());
        } else {
          if (parseInt(userArr[3]) > 0 && parseInt(userArr[3]) < 150) {
            //Age in range
            if (!userArr[4]) {
              //Ask for gender
              resp.message(
                `Tell us patient's gender as well\n\n💬 1 for Male 👨‍🦰\n💬 2 for Female 👩‍🦰\n💬 3 for Other 🧑`
              );
              req.session.info = userArr;
              res.status(200).send(resp.toString());
            } else {
              if (parseInt(userArr[4]) >= 1 && parseInt(userArr[4]) <= 3) {
                //Gender choice is correct
                //fetch records from database
                let query = 'select * from doctors';
                mysqlConnection.query(query, (err, rows, fields) => {
                  if (!err) {
                    // console.log(rows);
                    resp.message(`Fetching your doctors...`);
                    for (doctor of rows) {
                      sendMessage(
                        userPhoneNum,
                        buzzPhoneNum,
                        `Name: ${doctor.name}\nSpeciality:${doctor.field}\nExperience:${doctor.exp}`,
                        doctor.imageurl
                      );
                    }
                    res.status(200).send(resp.toString());
                  } else {
                    console.log(err);
                    resp.message(`Failed to load doctors. Please try again!`);
                    res.status(500).send(resp.toString());
                  }
                });
                req.session.info = [];
                // res.status(200).send(resp.toString());
              } else {
                //Gender choice is wrong
                resp.message(
                  `That does not seem like a valid option.\n Select 1,2 or 3.\n\nTell us patient's gender as well\n1 for Male 👨‍🦰\n2 for Female 👩‍🦰\n3 for Other 🧑`
                );
                req.session.info.pop();
                res.status(200).send(resp.toString());
              }
            }
          } else {
            //Age not in range
            resp.message(
              `🙅‍♀️ That does not seem like a valid age.\n\nWhat is the patient's age, in years?Ex. 25`
            );
            req.session.info.pop();
            res.status(200).send(resp.toString());
          }
        }
      }
    } else if (userArr[1] == 2) {
      //Hindi has been chosen
      if (!userArr[2]) {
        resp.message(
          `4 सरल चरणों में व्हाट्सएप पर अनुभवी डॉक्टरों से परामर्श करें -\n\n♀️/‍♂️ हमें पेशंट का नाम, आयु और लिंग बताएं\n\n👩‍⚕️ डॉक्टर का चयन करें\n\n💸 भुगतान लिंक पर क्लिक करें और ऑनलाइन भुगतान पूरा करें\n\n📞 📃 डॉक्टर से फोन पर सलाह लें और व्हाट्सएप पर प्रिस्क्रिप्शन प्राप्त करें\n\n  कृपया पेशंट का पूरा नाम बताएं? उदाहरण: आशीष यादव`
        );
        req.session.info = userArr;
        res.status(200).send(resp.toString());
        // sendMessage();
      } else {
        if (!userArr[3]) {
          //Username has been entered
          resp.message(`पेशंट की उम्र, वर्षों में क्या है? उदाहरण - 25`);
          req.session.info = userArr;
          res.status(200).send(resp.toString());
        } else {
          if (parseInt(userArr[3]) > 0 && parseInt(userArr[3]) < 150) {
            if (!userArr[4]) {
              //Ask for gender
              resp.message(
                `कृपया हमें पेशंट का लिंग बताएं\n\n💬 पुरुष के लिए 1 👨‍🦰\n💬 महिला के लिए 2\n💬 अन्य के लिए 3 🧑`
              );
              req.session.info = userArr;
              res.status(200).send(resp.toString());
            } else {
              if (parseInt(userArr[4]) >= 1 && parseInt(userArr[4]) <= 3) {
                //fetch records from database
                resp.message(`डॉक्टरों की सूची का इंतजार करें`);
                req.session.info = [];
                res.status(200).send(resp.toString());
              } else {
                //Invalid gender selection code here
                resp.message(
                  `यह एक वैध विकल्प की तरह नहीं लगता है। 1,2 या 3 भेजें।\n\nकृपया हमें पेशंट का लिंग बताएं\nपुरुष के लिए 1 👨‍🦰\nमहिला के लिए 2 👩‍🦰\nअन्य के लिए 3 🧑`
                );
                req.session.info.pop();
                res.status(200).send(resp.toString());
              }
            }
          } else {
            //Invalid age code here
            resp.message(
              `🙅‍♀️ यह एक वैध उम्र की तरह नहीं लगता है।\nपेशंट की उम्र, वर्षों में क्या है?\nउदाहरण- 25`
            );
            req.session.info.pop();
            res.status(200).send(resp.toString());
          }
        }
      }
    } else {
      //Check for valid language choice
      resp.message(
        `You did not select a valid number\n\nHello!\nनमस्ते 🙏\nWelcome to Doctor on Call service 👩‍⚕️\nडॉक्टर ऑन कॉल सेवा में आपका स्वागत है👨‍⚕️\n- 💬 Type and send 1 for English\n- 💬 हिंदी के लिए 2 लिख कर भेजे`
      );
      req.session.info = [];
      res.status(200).send(resp.toString());
    }
  }

  //   console.log(req.body);
  //   let email = req.body.Body;
  //   mysqlConnection.query(
  //     'select * from employees where email = ?',
  //     [email],
  //     (err, rows, fields) => {
  //       if (!err) {
  //         // console.log(rows);
  //         if (rows.length > 0) {
  //           let message = twiml.message();
  //           message.body(
  //             `Employee found!\nName - ${rows[0].name}\nEmail - ${rows[0].email}\nSalary - ${rows[0].salary}`
  //           );
  //           message.media(rows[0].image);
  //           //   console.log(twiml.toString());
  //           res.status(200).send(twiml.toString());
  //         } else {
  //           twiml.message(`Employee with email: ${email} not found!`);
  //           res.send(twiml.toString());
  //           console.log('No such employee!');
  //         }
  //       } else {
  //         twiml.message(`There was a problem in fetching the database!`);
  //         res.status(500).send(twiml.toString());
  //         console.log(err);
  //       }
  //     }
  //   );

  //   res.status(200).send(twiml.toString());
});

app.listen(port, () => console.log('Listening on port 3000...'));
