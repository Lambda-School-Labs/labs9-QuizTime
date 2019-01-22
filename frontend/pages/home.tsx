import { getUserFromLocalCookie } from "../utils/auth";
import { Text } from "../components/design-system";
import Layout from "../components/Layout";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import StudentsList from "../components/Students/StudentsList";
import StudentBar from "../components/Students/StudentBar";

const ALL_STUDENTS_QUERY = gql`
  query ALL_STUDENTS_QUERY {
    student {
      id
      last_name
      first_name
      email
    }
  }
`;

const Home = () => {
  const user = getUserFromLocalCookie();
  return (
    <Layout>
      <Text>{`Hello ${user.given_name} ${user.family_name}`}</Text>
      <Query query={ALL_STUDENTS_QUERY}>
        {({ loading, error, data }) => {
          if (error) return <p>{error.message}</p>;
          if (loading) return <p>...loading</p>;
          if (data) {
            return (
              <StudentsList>
                {data.student.map(s => (
                  <StudentBar id={s.id} key={s.id} student={s} />
                ))}
              </StudentsList>
            );
          }
        }}
      </Query>
    </Layout>
  );
};

export default Home;
