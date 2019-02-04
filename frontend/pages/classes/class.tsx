import { Query } from "react-apollo";
import gql from "graphql-tag";
import StudentBar from "../../components/Students/StudentBar";
import securePage from "../../hocs/securePage";
import Layout from "../../components/Layout";
import AddStudent from "../../components/forms/AddStudent";
import QuizElement from "../../components/boxes/QuizElement";
import StudentBox from "../../components/boxes/studentBox/studentBox";
import ClassQuizzes from "../../components/boxes/ClassQuizzes";
import { ALL_STUDENTS_QUERY } from "../../queries";
import styled from "@emotion/styled";
import { Box, Flex } from "@rebass/emotion";
import AddBox from '../../components/boxes/addBox/addBox';

import {
  StudentHolder,
  SectionContainer,
  Text,
  QuizBox,
  QuizzesAvaliable,
  UpperCase,
  Label
} from "../../components/design-system/primitives";

const ATag = styled.a`
  text-decoration: none;
`;

const ClassPage = ({ query: { id } }) => {
  return (
    <Layout>
      <Query query={ALL_STUDENTS_QUERY} variables={{ class_id: id }}>
        {({ loading, error, data }) => {
          if (error) return <p>{error.message}</p>;
          if (loading) return <p>...loading</p>;
          if (data) {
            return (
              // page content containers
              <Box p={3} m={3} >
                <Flex>
                  <Box py={3} my={3} width={[1, 1, 1/4]}>
                  <Label my={2} >Quiz Management</Label>
                    <Flex
                      flexDirection="column"
                    >
                      {/*quizzes you can use*/}
                      <Box p={3} my={3} 
                        css={{ background: "white", boxShadow: "0px 3px 15px rgba(0,0,0,0.1)" }}>
                        <UpperCase fontSize={2} fontWeight={4}>Add Quiz to Class</UpperCase>
                        {data.quiz
                          .filter(
                            qz =>
                              !data.class[0].quizzes.find(qzz => qzz.quiz.id === qz.id)
                          )
                          .map(q => (
                            <QuizElement
                              key={q.id}
                              quiz={q}
                              class_id={id}
                            />
                          ))}
                      </Box>
                      {/* quizzes added */}
                      <Box p={3} my={3}
                        css={{ background: "white", boxShadow: "0px 3px 15px rgba(0,0,0,0.1)" }}>
                        <UpperCase fontSize={2} fontWeight={4}>Quizzes in class</UpperCase>
                        <Box py={3}>
                          {data.class[0].quizzes.map(q => (
                            <ClassQuizzes key={q.id} quiz={q.quiz} />
                          ))}
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                  {/* container for right side */}
                  <Box p={2} m={3} width={[1, 1, 3/4]} css={{ boxShadow: "0px 3px 15px rgba(0,0,0,0.1)" }}>
                    <Flex
                      flexDirection="column"
                    >
                      {/* <Box p={3} m={3}>
                        <AddStudent class_id={id} />
                      </Box> */}
                      <Box p={2}>
                        <Label m={2} >Class Management</Label>
                        <Flex flexWrap="wrap">
                          <ATag>
                            <AddBox />
                          </ATag>
                          {data.class[0].students.map(student => (
                            <StudentBox 
                              id={student.id}
                              key={student.id}
                              student={student}
                            />
                          ))}
                        </Flex>
                      </Box>
                      {/* container for quiz information */}

                    </Flex>
                  </Box>
                </Flex>
              </Box>
            );
          }
        }}
      </Query>
    </Layout>
  );
};

export default securePage(ClassPage);
