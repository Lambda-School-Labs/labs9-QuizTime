import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, FormInput, Button, Label, Text } from "../design-system";
import { ALL_CLASSES_QUERY } from '../../queries'


class AddClass extends Component {
  state = {
    name: ''
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  generateMutation = () => {
      return(
        gql`
        mutation insert_class {
            insert_class(
            objects:[
                    {
                      name: "${this.state.name}"
                    }
                ]
                ){
                returning{
                    id
                    name
                }
            }
        }
    `)
}

  render() {
    return (
      <Mutation
        mutation={this.generateMutation()}
        update={(cache, { data: insert_class }) => {
          //rename during destructure, class reserved keyword
          const { class: classes } = cache.readQuery({ query: ALL_CLASSES_QUERY });
          cache.writeQuery({
            query: ALL_CLASSES_QUERY,
            data: { class: classes.concat(insert_class.insert_class.returning) }
          })
        }}
      >
        {(insert_class, { error, loading, data }) => (
        <>
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await insert_class();
            }}
          >
              <Label htmlFor="name">
                Add a Class
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Class Title"
                  required
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Label>

              <Button variant = "primary" type="submit" p={3}>Submit</Button>
          </Form>
            {/* render errors, loading, or data */}
            {error && (<p> {error.message} </p>) }
            {loading && (<p> ...loading </p>) }
          </>
        )}
      </Mutation>
    );
  }
}

export default AddClass;
