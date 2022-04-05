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


  // configuration(app-wide)
  const config = {
    company: {
      logo: "/logo.png",
      name: "TheCompany",
    },
    portal: {
      title: "Portal Simple",
      description: "Welcome to your learning experience. A free and hands on collection of courses to help you build your learning experiences with Learnir."
    }
  }

  const data = {
    config,
    authenticated, profile, isBrowser,

    getShow, setShow,
    getBox, setBox,
    getSection, setSection,
  };

  return (<PortalContext.Provider value={data}> {children} </PortalContext.Provider>);
}

export const PortalStateContext = PortalContext;

