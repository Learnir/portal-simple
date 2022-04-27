import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router'

const PortalContext = createContext();

export function PortalStateProvider({ children }) {

  const router = useRouter()

  // data
  const [getPort, setPort] = useState(null);
  const [getBox, setBox] = useState(null);
  const [getSection, setSection] = useState();
  const [getShow, setShow] = useState(false);

  // functions
  const isBrowser = () => typeof window !== "undefined";
  const authenticated = () => isBrowser() && localStorage.getItem("token") ? true : false;
  const profile = () => {
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

  const data = {
    authenticated, profile, isBrowser,

    getShow, setShow,
    getBox, setBox,
    getSection, setSection,
  };

  return (<PortalContext.Provider value={data}> {children} </PortalContext.Provider>);
}

export const PortalStateContext = PortalContext;
export const AppStateContext = PortalContext;


// configuration(app-wide)
export const config = {
  company: {
    logo: "https://learnir.co/logo.svg",
    name: "Company",
  },
  portal: {
    title: "Product Training",
    description: "Welcome to your learning experience. A free and hands on collection of courses to help you build your learning experiences with Learnir."
  },
  integrations: {
    key: "325649396932805193",
    endpoint: typeof window !== "undefined" && window.location.hostname == "locahost" ? "http://localhost:9060" : "https://api.learnir.co"
  }
}


