import { useRouter } from "next/router";
import Cookie from "js-cookie"; 
import axios from "axios";
import AppContext from "../../../components/context";
import React, { useState, useEffect, useContext } from "react";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

export default function handlGoogle() {
  
    const router = useRouter();
    const Location = router.query.access_token;
    console.log(Location);
    const appContext = useContext(AppContext);
  
    useEffect(() => {
      if(!Location) {
        return;
      }

      axios({
        method: 'get',
        url: `${API_URL}/auth/google/callback`,
        params: {access_token: Location},
    })
      
    .then(function (response) {
        console.log(response.data.user);
        Cookie.set("token", response.data.jwt);
        appContext.setUser(response.data.user);
      router.push("/");
      })
  
    .catch(function(error) {
      //reject the promise and pass the error object back to the form
      console.log("TELL ME THE ERROR", error);
      
  
    });  
    }, [Location])
     
        
    return (
      
        <p>Google token</p>)
      
    
  }
 
  


