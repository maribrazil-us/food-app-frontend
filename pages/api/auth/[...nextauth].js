import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Cookie from "js-cookie";
import AppContext from "../../../components/context";
import Router from "next/router";

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
      session.jwt = user.jwt;
      session.id = user.id;
      console.log('google', user);
      return Promise.resolve(session);
      
    },
    jwt: async (token, user, account) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        );
        const data = await response.json();
        token.jwt = data.jwt;
        token.id = data.user.id;
        //AppContext.setUser(data.user);
        console.log('google',data.user);
      }
      return Promise.resolve(token);
      
      
      
    },
    
  },
  
};



const Auth = (req, res) =>
  NextAuth(req, res, options);
  

export default Auth;