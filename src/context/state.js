import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router'

const PortalContext = createContext();

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

  const data = {
    authenticated, profile, isBrowser,
    
    getContent, setContent,

    getShow, setShow,
    getView, setView,
    getCompData, setCompData,

    getBox, setBox,
    getSection, setSection,

    getRecords, setRecords,
    getInteractions, setInteractions
  };

  return (<PortalContext.Provider value={data}> {children} </PortalContext.Provider>);
}

export const PortalStateContext = PortalContext;
export const AppStateContext = PortalContext;


// configuration(app-wide)
export const config = {
  organization: {
    logo: "/heap_logo.png",
    name: "Heap University",
    cover: "/heap_university.png",
    email: "training@heap.io",
    links: {
      help_center: "https://help.heap.io",
      community: "https://community.heap.io",
    }
  },
  portal: {
    title: "Welcome!",
    description: `The courses you find in Heap University are designed to help get you up and running with Heap. With Heap, everything is measurable and a
    ny data point is ready for analysis. Using Heap you can uncover the wealth of insights that your organization has available. Select a course below to get started!`,

    listings_style: "uncategorized", // categorized, uncategorized - categorized, renders by what is in the tags of
  },
  integrations: {
    key: "329936155895136841",
    endpoint: typeof window !== "undefined" && window.location.hostname == "locahost" ? "http://localhost:9060" : "https://api.learnir.co"
  }
}


