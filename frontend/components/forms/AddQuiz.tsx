import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Form, Input, Button, Label, Text, TextArea } from "../design-system";
import { Box, Flex } from "@rebass/emotion";

class AddQuiz extends Component {
  state = {
    name: "",
    majorQuestions: [
      {
        id: 1,
        prompt: "",
        answers: [{ response: "", correct: false }],
        minorQuestions: []
      }
    ]
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  addMajorQuestion = e => {
    e.preventDefault();
    this.setState(s => ({
      ...s,
      majorQuestions: [
        ...s.majorQuestions,
        {
          id: s.majorQuestions[s.majorQuestions.length - 1]["id"] + 1,
          prompt: "",
          answers: [{ response: "", correct: false }]
        }
      ]
    }));
  };

  deleteMajorQuestion = id => {
    const { majorQuestions } = this.state;
    const updatedQuestions = majorQuestions.filter(q => {
      if (q.id != id || q.id == 1) return q;
    });
    this.setState(s => ({ ...s, majorQuestions: updatedQuestions }));
  };

  updateMajorQuestion = (id, e) => {
    console.log(`id ${id}:`, e.target.value);
    const { value } = e.target;
    const { majorQuestions } = this.state;
    const updatedQuestions = majorQuestions.map(q => {
      if (q.id == id) q.prompt = value;
      return q;
    });
    this.setState(s => ({ ...s, majorQuestions: updatedQuestions }));
  };

  generateMutation = () => {
    return gql`
      mutation insert_quiz {
          insert_quiz(
          objects:[
                  {
                    name: "${this.state.name}"
                  }
              ]
              ){
              returning{
                  id
              }
          }
      }
  `;
  };

  render() {
    const { majorQuestions } = this.state;
    return (
      <Mutation mutation={this.generateMutation()}>
        {(insert_quiz, { error, loading, data }) => (
          <>
            <Form
              onSubmit={async e => {
                // Stop the form from submitting
                e.preventDefault();
                // call the mutation
                const res = await insert_quiz();
                console.log(res);
              }}
            >
              <Text>Add a Quiz</Text>

              <fieldset>
                <Label htmlFor="name">
                  Quiz Title
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Quiz Title"
                    required
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </Label>
                {majorQuestions.map(q => (
                  <Box key={q.id} my={4}>
                    <Flex justifyContent="space-around">
                      <Label htmlFor={`major-question-${q.id}`}>
                        Major Question {q.id}
                      </Label>
                      <Button
                        variant="error"
                        p={0}
                        fontSize={0}
                        onClick={e => this.deleteMajorQuestion(q.id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                    <TextArea
                      id={`major-question-${q.id}`}
                      onChange={e => this.updateMajorQuestion(q.id, e)}
                    />
                    <Box>
                      <Label>Answer 1</Label>
                      <Flex>
                        <Input my={3} width={1 / 2} />
                        <Input
                          type="radio"
                          name={`major-question-${q.id}-major-answer`}
                          value="1"
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Label>Answer 2</Label>
                      <Flex>
                        <Input my={3} width={1 / 2} />
                        <Input
                          type="radio"
                          name={`major-question-${q.id}-major-answer`}
                          value="2"
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Label>Answer 3</Label>
                      <Flex>
                        <Input my={3} width={1 / 2} />
                        <Input
                          type="radio"
                          name={`major-question-${q.id}-major-answer`}
                          value="3"
                        />
                      </Flex>
                    </Box>
                    <Box>
                      <Label>Answer 4</Label>
                      <Flex>
                        <Input my={3} width={1 / 2} />
                        <Input
                          type="radio"
                          name={`major-question-${q.id}-major-answer`}
                          value="4"
                        />
                      </Flex>
                    </Box>
                  </Box>
                ))}
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="success" onClick={this.addMajorQuestion}>
                  Add Major Question
                </Button>
              </fieldset>
            </Form>
            {/* render errors, loading, or data */}
            {error && <p> {error.message} </p>}
            {loading && <p> ...loading </p>}
            {data && (
              <p>
                {" "}
                successfully created quiz with id of{" "}
                {data.insert_quiz.returning[0].id}
              </p>
            )}
          </>
        )}
      </Mutation>
    );
  }
}

export default AddQuiz;
