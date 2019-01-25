require("dotenv").config();
const { json, send, run } = require("micro");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SECRET = process.env.TOKEN_SECRET;
const CircularJSON = require("circular-json");

const get_quiz_query = (student_id, quiz_id) => {
  return `
    query {
    quiz(where: {id: {_eq: ${parseInt(quiz_id, 10)}}}){
      id
      major_questions{
        student_answers(where: {student_id: {_eq: ${parseInt(
          student_id,
          10
        )}}}){
          id
          correct
          student_answer
        }
        id
        prompt
        answers{
          id
          correct_answer
          response
        }
        minor_questions{
          student_answers(where: {student_id: {_eq: ${parseInt(
            student_id,
            10
          )}}}){
            id
            correct
            student_answer
          }
          id
          prompt
          answers{
            id
            correct_answer
            response
          }
        }
      }
    }
  }
  `;
};

const craftPost = (type, dcToken) => {
  switch (type) {
    case "get_quiz_query":
      return {
        query: `${get_quiz_query(dcToken.student_id, dcToken.quiz_id)}`
      };
      break;
    case "insert_student_major_answer":
      //add function to craft mutation
      break;
    case "insert_student_minor_answer":
      //add function to craft mutation here
      break;
    case "get_quiz_results_query":
      //add query to retrieve all the answers, either precalcing them
      //or collating them for easy calc on front end
      break;
  }
};

const handler = async (req, res) => {
  const { type } = await json(req);
  console.log(type);
  console.log(req.headers);
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, SECRET, async (err, decodedToken) => {
      if (err) {
        //return an error message
        send(res, 400, { message: "Invalid Token" });
      } else {
        //token was verified
        //figure out what needs to be posted to hasura and pass it
        try {
          let dbPost = await craftPost(type, decodedToken);

          let serverRes = await axios.post(
            "https://quiztime-hasura.herokuapp.com/v1alpha1/graphql",
            dbPost,
            {
              headers: {
                "X-Hasura-Access-Key": process.env.X_HASURA_ACCESS_KEY
              }
            }
          );

          send(res, 200, serverRes.data);
        } catch (e) {
          console.log(e.message || e.error);
          send(res, 500, { error: e.message || e.error });
        }
      }
    });
  }
};

module.exports = (req, res) => run(req, res, handler);