import React, { Component } from "react";
import { StripeProvider } from "react-stripe-elements";
import Checkout from "../components/Billing/Checkout";
import securePage from "../hocs/securePage";
import Layout from "../components/Layout";
import { getUserFromServerCookie, getUserFromLocalCookie } from '../utils/auth.js'

class Stripe extends Component {
  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }
  componentDidMount() {
    //* Create Stripe instance in componentDidMount
    //* (componentDidMount only fires in browser/DOM environment)
    this.setState({
      stripe: window.Stripe("pk_test_rIuPZzF97RGSr9Wcdnn8kkD8")
    });
  }
  render() {
    const { props } = this;
    const { stripe } = this.state
    console.log('\n local', getUserFromLocalCookie())
    // console.log('\n server', getUserFromServerCookie())

    return (
      <Layout>
        <StripeProvider stripe={stripe}>
          <Checkout {...props} />
        </StripeProvider>
      </Layout>
    );
  }
}

export default securePage(Stripe);
