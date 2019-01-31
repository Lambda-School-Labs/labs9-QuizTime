import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { getStudentToken } from '../../utils/auth';
import { Box, Flex } from '@rebass/emotion';
import {
  Text,
  BoldText,
  UpperCase,
  Container,
  Label,
  Input,
  BoxText,
  BoxHolder,
  ButtonLink,
  Button,
} from '../design-system';
import Meta from '../Meta';
import QuizHeading from './QuizHeading.tsx';
import MajorQuestion from './MajorQuestion';
import MinorQuestion from './MinorQuestion';

const url = 'http://localhost:7000/api/student-proxy';
// const url = '/api/student-proxy';

class StudentQuiz extends Component {
  state = {
    quiz: null,
    majorIndex: 0,
    minorIndex: [0],
    majorCorrect: [], //* determines whether minor question map is rendered or not
    currentMajorQuestion: {
      major_question_id: null,
      student_answer: null,
      correct: false,
    },
    currentMinorQuestion: {
      minor_question_id: null,
      student_answer: null,
      correct: false,
    },
    majorQuestionCount: 0,
    minorQuestionCount: 0,
    majorCorrectAnswers: 0,
    minorCorrectAnswers: 0,
    isAnswered: false,
    isMajor: true,
    score: 0,
    maxScore: 0,
    isDone: false,
  };

  componentDidMount() {
    this.getQuiz();
  }

  componentDidUpdate() {
    document.getElementById('focusMe') && document.getElementById('focusMe').scrollIntoView({ behavior: 'smooth' });
  }

  nextQuestion = (e, q) => {
    this.keepScore();
    this.submitAnswer();
    //* Display next Major Question, or next Minor Question or Done?
    this.majorMinorOrDone();
  };

  render() {
    const {
      isAnswered,
      quiz,
      majorIndex,
      majorCorrect,
      minorIndex,
      isMajor,
      isDone
    } = this.state;
    return (
      <>
        <Meta />
        <Container>
          {quiz ? (
            <>
              <QuizHeading quiz={quiz} />
              <div>
                {quiz.major_questions.slice(0, majorIndex + 1).map((q, idx) => (
                  <Box width={0.93} css={{ margin: '0 24px' }} key={q.id}>
                    <MajorQuestion
                      q={q}
                      idx={idx}
                      majorIndex={majorIndex}
                      handleMajorChange={this.handleMajorChange}
                      isMajor={isMajor}
                    />
                    {!majorCorrect[idx] &&
                      quiz.major_questions[idx].minor_questions
                        .slice(0, minorIndex[idx])
                        .map((q, index) => (
                          <MinorQuestion
                            key={q.id}
                            q={q}
                            idx={idx}
                            majorIndex={majorIndex}
                            minorIndex={minorIndex}
                            index={index}
                            handleMinorChange={this.handleMinorChange}
                          />
                        ))}
                    <Flex justifyContent='flex-end' alignItems='center'>
                      <Button
                        mx={2}
                        css={majorIndex !== idx && { display: 'none' }}
                        variant='primaryNoHover'
                      >
                        Score: {this.state.score}/{this.state.maxScore}
                      </Button>
                      <ButtonLink
                        disabled={!isAnswered}
                        variant={!isAnswered ? 'disabled' : 'success'}
                        css={majorIndex !== idx && { display: 'none' }}
                        my={3}
                        mx={2}
                        onClick={this.nextQuestion}
                        id={majorIndex === idx ? 'focusMe' : null}
                      >
                        {!isDone ? 'Submit' : 'Quiz Completed'}
                      </ButtonLink>
                    </Flex>
                  </Box>
                ))}
              </div>
            </>
          ) : (
            <Flex justifyContent='center' alignItems='center' p={5} m={3}>
              <ReactLoading
                type='spin'
                color='lightgray'
                height='100px'
                width='100px'
              />
            </Flex>
          )}
        </Container>
      </>
    );
  }

  keepScore = () => {
    const { currentMajorQuestion, currentMinorQuestion, isMajor } = this.state;
    if (isMajor) {
      this.setState(s => ({ majorQuestionCount: s.majorQuestionCount + 1 }));
    } else {
      this.setState(s => ({ minorQuestionCount: s.minorQuestionCount + 1 }));
    }
    if (currentMajorQuestion.correct) {
      this.setState(s => ({ majorCorrectAnswers: s.majorCorrectAnswers + 1 }));
    } else {
      if (currentMinorQuestion.correct) {
        this.setState(s => ({
          minorCorrectAnswers: s.minorCorrectAnswers + 1,
        }));
      }
    }
    this.setState(s => ({
      score: s.majorCorrectAnswers * 10 + s.minorCorrectAnswers * 2,
      maxScore: s.majorQuestionCount * 10,
    }));
  };

  submitAnswer = () => {
    this.setState({ isAnswered: false });
    const { isMajor, majorCorrect, currentMajorQuestion } = this.state;
    if (isMajor) {
      this.submitMajorAnswer();
      majorCorrect.push(currentMajorQuestion.correct);
      this.setState({ majorCorrect });
    } else {
      this.submitMinorAnswer();
    }
  };

  majorMinorOrDone = () => {
    const { currentMajorQuestion, majorIndex, quiz, minorIndex } = this.state;
    //* Did the student get the current Major Question correct?
    //* Yes => next major question (if exist)
    //* No => next minor question (if exist)
    if (currentMajorQuestion.correct) {
      //* Is the current Major Question the last Major Question?
      //* Yes => calculate score.
      if (majorIndex === quiz.major_questions.length - 1) {
        this.setState({isDone: true})
        return;
      }
      //* Current Major Question was correct, so don't render Minor Questions
      minorIndex.push(0);

      //* Advance majorIndex to display next Major Question
      this.setState(s => ({
        majorIndex: s.majorIndex + 1,
        isMajor: true,
        minorIndex,
      }));
      //* MajorQuestion answer was wrong. Must be displaying Minor Questions ...
      //* Did we reach the end of Minor Questions for current Major Question?
    } else if (
      minorIndex[majorIndex] ===
      quiz.major_questions[majorIndex].minor_questions.length
    ) {
      //* If yes, move on to next Major Question and reset minorIndex (if there is one. otherwise display score).
      minorIndex.push(0);
      if (majorIndex === quiz.major_questions.length - 1) {
        this.setState({isDone: true})
        return;
      } else {
        this.setState(s => ({
          majorIndex: s.majorIndex + 1,
          isMajor: true,
          minorIndex,
        }));
      }
      //* Display next Minor Question for current wrong Major Question.
    } else {
      minorIndex[majorIndex] = minorIndex[majorIndex] + 1;
      this.setState({
        minorIndex,
        isMajor: false,
      });
    }
  };

  getQuiz = () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        type: 'get_quiz_query',
        token: getStudentToken(),
      }),
    };

    fetch(url, options)
      .then(res => res.json())
      .then(({ data }) => this.setState({ quiz: data.quiz[0] }))
      .catch(error => console.log(error));
  };

  submitMajorAnswer = () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        type: 'insert_student_major_answer',
        token: getStudentToken(),
        ...this.state.currentMajorQuestion,
      }),
    };
    fetch(url, options)
      .then(res => res.json())
      .then(({ data }) => data)
      .catch(error => console.log(error));
  };

  submitMinorAnswer = () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        type: 'insert_student_minor_answer',
        token: getStudentToken(),
        ...this.state.currentMinorQuestion,
      }),
    };
    fetch(url, options)
      .then(res => res.json())
      .then(({ data }) => data)
      .catch(error => console.log(error));
  };

  handleMajorChange = (e, q, a) => {
    this.setState(() => ({
      currentMajorQuestion: {
        major_question_id: q.id,
        student_answer: a.id,
        correct: a.correct_answer,
      },
      isAnswered: true,
    }));
  };

  handleMinorChange = (e, q, a) => {
    this.setState(() => ({
      currentMinorQuestion: {
        minor_question_id: q.id,
        student_answer: a.id,
        correct: a.correct_answer,
      },
      isAnswered: true,
    }));
  };

  calculateScore = () => {
    const { majorCorrectAnswers, minorCorrectAnswers } = this.state;
    const score = majorCorrectAnswers * 10 + minorCorrectAnswers * 2;
    this.setState({ score });
    return score;
  };
}

export default StudentQuiz;
