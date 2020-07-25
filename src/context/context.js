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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  // search
  const searchGithubUser = async (user) => {
    //toggleError
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`)
      .then((res) => {
        // console.log(res.data);
        setGithubUser(res.data);
        const { login, followers_url } = res.data;
        //setting user repos
        axios(`${rootUrl}/users/${login}/repos?per_page=100`)
          .then((res) => {
            setRepos(res.data);
          })
          .catch((err) => console.log(err, "from repos"));
        //setting user followers
        axios(`${followers_url}?per_page=100`)
          .then((res) => {
            setFollowers(res.data);
          })
          .catch((err) => console.log(err, "from followers"));
      })
      .then(() => {
        // request api
        checkRequests();
        // set back loadinf that render the user
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toggleError(true, "there is no user with that username");
      });

    // console.log(response);
    // if (response) {
    //   setGithubUser(response.data);
    // } else {
    //   toggleError(true, "there is no user with that username");
    // }
  };

  // serach for user repos and followers
  // function gitHubUserInfo(data) {
  //   const { login, followers_url } = data;
  //   //repos
  //   axios(`{rootUrl}/users/${login}/repos?per_page=100`).then((res) => {
  //     setRepos(res.data);
  //   });
  //   //followers
  //   axios(`${followers_url}?per_page=100`).then((res) => {
  //     setFollowers(res.data);
  //   });
  // }

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
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
