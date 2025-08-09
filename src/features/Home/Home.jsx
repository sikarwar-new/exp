import React from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";

import Hero from "./Hero";
import ChooseUs from "./ChooseUs";
import Rest from "./Rest";
import FAQList from "./FAQList";
import HomePostLogIn from "../misc/HomePostLogIn";

function Home() {
  const { loggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      {loggedIn ? (
        <HomePostLogIn />
      ) : (
        <>
          <Hero />
          <Rest />
          <ChooseUs />
          <FAQList />
        </>
      )}
    </>
  );
}

export default Home;
