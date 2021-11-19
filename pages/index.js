/* /pages/index.js */
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { gql, useQuery } from "@apollo/client";
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';
import ClientOnly from "../components/clientOnly";
import RestaurantList from "../components/restaurantList";
import React from 'react';
import { useState } from 'react';
import { InputGroup,Input, Button} from "reactstrap";



export default function Home({restaurants}) {
  const [query, setQuery] = useState("");

  return (
    <ApolloProvider>
    <div className="search">
    
      <h1 className={styles.title}>Food-App</h1>
      <h2 className="text-center">Find restaurants in your area</h2>
    <div>
    <br/>  
      <InputGroup>
              <Button>Search</Button>
        <Input
          onChange={(e) => setQuery(e.target.value)}
          type="string"
          value={query}
        />
       </InputGroup>  
      </div>
      <br/>
       <ClientOnly>
        <RestaurantList search={query}/>
      </ClientOnly>
    
      </div>
   
  </ApolloProvider>
  )
};
