import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { gql } from "@apollo/client";
import {ApolloProvider,ApolloClient,HttpLink, InMemoryCache} from '@apollo/client';


export default function Home({restaurants}) {

  return (
    <div className={styles.container}>
      
      <div className={styles.grid}>
      {restaurants.map((restaurant) => (
      <div key={restaurant.id} className={styles.card}>
      <h3><a href="#restaurant-name" aria-hidden="true" class="aal_anchor" id="restaurant-name"><svg aria-hidden="true" class="aal_svg" height="16" version="1.1" viewBox="0 0 16 16" width="16"></svg></a>{restaurant.name},{restaurant.description}</h3>
      <p>
        {restaurants.id}
      </p>
    </div>
  ))}
    </div>
    
  </div>
  )
}
export async function getStaticProps() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
    console.log(`URL: ${API_URL}`)
   
    const link = new HttpLink({ uri: `${API_URL}/graphql`})
    const cache = new InMemoryCache()
    const client = new ApolloClient({link,cache});
    const { data } = await client.query({
      query: gql`
        query {
          restaurants {
            id
            name
            description
          }
        }
      `,
    });

    return {
      props: {
        restaurants: data.restaurants.slice(0, 4),
      },
   };
}