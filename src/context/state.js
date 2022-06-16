import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router'
const learnir = require("learnir-javascript-sdk");

const AppContext = createContext();

export const config = {
  organization: {
    logo: "https://learnir.co/logo.svg",
    name: "Product Training",
    cover: "/banner.svg",
    email: "training@learnir.co",
    links: {
      help_center: "#",
      community: "#",
    }
  },
  portal: {
    title: "Welcome!",
    description: `The courses you find in Learnir Academy are designed to help get you up and running with Learnir. With Learnir, everything is measurable and any data point is ready for analysis. 
    Using Learnir you can uncover the wealth of insights that your organization has available. Select a course below to get started!`,
    listings_style: "uncategorized", // categorized, uncategorized - categorized, renders by what is in the tags of
  },
  learnir: {
    port_key: "329936155895136841", // config from console product
    endpoint: false ? "http://localhost:9060" : "https://api.learnir.co",
    get client() { return new learnir.LearnirApi({ basePath: this.endpoint + "/v1", baseOptions: { headers: { "key": this.port_key } } }) },
  }
}

export function AppStateProvider({ children }) {
  const router = useRouter()

  // data
  const [getContent, setContent] = useState([]);
  const [getBox, setBox] = useState(null);
  const [getSection, setSection] = useState();
  const [getShow, setShow] = useState(false);
  const [getView, setView] = useState(false);

  const [getCompData, setCompData] = useState();
  const [getRecords, setRecords] = useState([]);
  const [getInteractions, setInteractions] = useState([]);

  // functions
  const isBrowser = () => typeof window !== "undefined";
  const authenticated = () => isBrowser() && localStorage.getItem("token") ? true : false;
  const profile = {
    get data() {
      let user = {};
      const token = isBrowser() && localStorage.getItem("token");
      if (token) {
        let tokenProfile = token.split('.')[1];
        if (isBrowser() && window.atob(tokenProfile)) {
          let payload = isBrowser() && window.atob(tokenProfile);
          user = JSON.parse(payload);
        } else {
          typeof window !== 'undefined' && localStorage.clear();
          return null;
        }
      } else {
        return null;
      }
      return user;
    }
  }

  // export
  const data = {
    authenticated, profile, isBrowser, config,

    getContent, setContent,

    getShow, setShow,
    getView, setView,
    getCompData, setCompData,

    getBox, setBox,
    getSection, setSection,

    getRecords, setRecords,
    getInteractions, setInteractions
  };

  return (<AppContext.Provider value={data}> {children} </AppContext.Provider>);
}

export const AppStateContext = AppContext;

