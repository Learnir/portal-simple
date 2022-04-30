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
    logo: "/heap_logo.png",
    name: "Heap University",
    cover: "/heap_university.png",
  },
  portal: {
    title: "Welcome!",
    description: "The courses you find in Heap University are designed to help get you up and running with Heap. With Heap, everything is measurable and any data point is ready for analysis. Using Heap you can uncover the wealth of insights that your organization has available. Select a course below to get started!"
  },
  integrations: {
    key: "329936155895136841",
    endpoint: typeof window !== "undefined" && window.location.hostname == "locahost" ? "http://localhost:9060" : "https://api.learnir.co"
  }
}


