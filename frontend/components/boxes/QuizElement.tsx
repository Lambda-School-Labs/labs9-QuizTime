import { Mutation } from "react-apollo";
import { INSERT_CLASS_QUIZ } from "../../mutations";
import { ALL_STUDENTS_QUERY } from "../../queries";

import { QuizBar, Text } from "../design-system/primitives";
import { Button, Box } from "@rebass/emotion";

export default ({ quiz, class_id }) => (
  <Box>
    <Text>{quiz.name}</Text>
    <Mutation
      mutation={INSERT_CLASS_QUIZ}
      update={(cache, { data: insert_class_quiz }) => {
        const c = cache.readQuery({
          query: ALL_STUDENTS_QUERY,
          variables: { class_id }
        });

        const newClass = c.class;
        newClass[0].quizzes = newClass[0].quizzes.concat(
          insert_class_quiz.insert_class_quiz.returning
        );

        cache.writeQuery({
          query: ALL_STUDENTS_QUERY,
          data: {
            quizz: c.quiz,
            class: newClass
          }
        });
      }}
    >
      {(insert_class_quiz, { error, loading, data }) => (
        <Button
          onClick={() =>
            insert_class_quiz({ variables: { quiz_id: quiz.id, class_id } })
          }
          disabled={loading}
        >
          {loading && "loading..."}
          {error && "Try again"}
          {loading || error || "Add"}
        </Button>
      )}
    </Mutation>
  </Box>
);
