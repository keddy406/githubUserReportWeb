import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

// Provider, Consumer - Githubcontext.Provider

const GithubProvider = ({ children }) => {
  //default value for githubUser from muckUser
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  //request loading
  const [requests, setRequests] = useState(0);
  const [loading, setIsLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: "" });

  // search
  const searchGithubUser = async (user) => {
    //toggleError
    //setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`)
      .then((data) => {
        setGithubUser(data);
        console.log(data);
      })
      .catch((err) => toggleError(true, "there is no user with that username"));
    // console.log(response);
    // if (response) {
    //   setGithubUser(response.data);
    // } else {
    //   toggleError(true, "there is no user with that username");
    // }
  };

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      // destruct data of response
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          //throw an error
          toggleError(true, "you are exceed your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  //error
  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
