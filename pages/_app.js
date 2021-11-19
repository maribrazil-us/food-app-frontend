import '../styles/globals.css'
import { useContext, useState } from "react";
import Head from "next/head";
import Home from "./index";
import Layout from "../components/layout";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import AppContext from "../components/context";
import { ApolloProvider, HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import React, { Component } from "react";
import App from "next/app";
import { Router, Link, Route, Switch } from 'next/router';



const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
console.log(`URL: ${API_URL}`);
const link = new HttpLink({ uri: `${API_URL}/graphql`});
const cache = new InMemoryCache();
const client = new ApolloClient({link,cache});

export default class MyApp extends App {
  state = {
    user: null,
    cart: { items: [], total: 0 },
  };

  componentDidMount() {
    const token = Cookie.get("token");
  // restore cart from cookie, this could also be tracked in a db
    const cart = Cookie.get("cart");
    //if items in cart, set items and total from cookie
  //  console.log(cart);

    if (typeof cart === "string" && cart !== "undefined") {
  //    console.log("foyd");
      JSON.parse(cart).forEach((item) => {
        this.setState({
          cart: { items: JSON.parse(cart), total: item.price * item.quantity },
        });
      });
    }
    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          this.setState({ user: null });
          return null;
        }
        const user = await res.json();
        this.setUser(user);
      });
    }
 }

  setUser = (user) => {
    this.setState({ user });
  };
   

  addItem = (item) => {
    let { items } = this.state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
   
    const newItem = items.find((i) => i.id === item.id);
    // if item is not new, add to cart, set quantity to 1
    if (!newItem) {
      //set quantity property to 1
      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      
      console.log(this.state.cart.total, item.price);
      const newCart = 
         {
            items: [...items, temp],
            total: this.state.cart.total + item.price,
          };
      this.setState({cart: newCart})
      
    } else {
      // we already have it so just increase quantity ++
      console.log(`Total so far:  ${this.state.cart.total}`)
      newCart= {
          items: items.map((item) =>{
            if(item.id === newItem.id){
              return Object.assign({}, item, { quantity: item.quantity + 1 })
             } else {
            return item;
             }}),
          total: this.state.cart.total + item.price,
        }
    }
    this.setState({cart: newCart});  // problem is this is not updated yet
    console.log(`state reset to cart:${JSON.stringify(this.state)}`)
  } 
                  
  removeItem = (item) => {
    let { items } = this.state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    const newItem = items.find((i) => i.id === item.id);
    if (newItem.quantity > 1) {
      this.setState(
        {
          cart: {
            items: this.state.cart.items.map((item) =>
              item.id === newItem.id
                ? Object.assign({}, item, { quantity: item.quantity - 1 })
                : item
            ),
            total: this.state.cart.total - item.price,
          },
        },
        () => Cookie.set("cart", this.state.items)
      );
    } else {
      const items = [...this.state.cart.items];
      const index = items.findIndex((i) => i.id === newItem.id);

      items.splice(index, 1);
      this.setState(
        { cart: { items: items, total: this.state.cart.total - item.price } },
        () => Cookie.set("cart", this.state.items)
      );
    }
  };
  render() {
    const { Component, pageProps } = this.props;

  
    return (
    <AppContext.Provider value={{
      user: this.state.user,
      isAuthenticated: !!this.state.user,
      setUser: this.setUser,
      cart: this.state.cart,
      addItem: this.addItem,
      removeItem: this.removeItem
     
    }}>

    <Head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous"
          />
      </Head>

      
    <ApolloProvider client={client}>
    
    
      <Layout>
          <Component {...pageProps} />
      </Layout>

    </ApolloProvider>
    </AppContext.Provider>
  );

  }
  
  
}

