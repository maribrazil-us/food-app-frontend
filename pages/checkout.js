/* pages/checkout.js */

import React, { useContext } from "react";
import { Row, Col, Button } from "reactstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import InjectedCheckoutForm from "../components/checkoutForm"
import AppContext from "../components/context";
import Cart from "../components/cart";
import { getDisplayName } from "next/dist/shared/lib/utils";

function Checkout() {
  // get app context
  const appContext = useContext(AppContext);
  // isAuthenticated is passed to the cart component to display order button
  const { isAuthenticated } = appContext;

  // load stripe to inject into elements components
  const stripePromise = loadStripe("pk_test_51JuQv1APyuacFpNR4lqTmNzkZOTPJ2d2FL43XS9GiIZF5jIe8SJ6raUKS9D7nl8Fla8CQGnJ0eLsWC8JneEKm35F00PEHA4lsi");

  return (
    <Row>
      <Col style={{ paddingRight: 0 }} sm={{ size: 3, order: 1, offset: 2 }}>
        <h1 style={{ margin: 20 }}>Checkout</h1>
        <Cart isAuthenticated={false}/>
      </Col>
      <Col style={{ paddingLeft: 5 }} sm={{ size: 6, order: 2 }}>
        <Elements stripe={stripePromise}>
          <InjectedCheckoutForm />
        </Elements>
      </Col>
    </Row>
  );
  // }
}
export default Checkout;