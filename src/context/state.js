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
  const isBrowser = () => typeof window !== "undefined"
  const authenticated = () => !true ? false : true;

  // configuration(app-wide)
  const config = {
    company: {
      logo: "/logo.png",
      name: "TheCompany",
    },
    portal:{
      title: "Portal Simple",
      description: "Welcome to your learning experience. A free and hands on collection of courses to help you build your learning experiences with Learnir."
    }
  }

  const data = {
    config,
    authenticated, isBrowser,
    getShow, setShow,
    getBox, setBox,
    getSection, setSection,
  };

  return (<PortalContext.Provider value={data}> {children} </PortalContext.Provider>);
}

export const PortalStateContext = PortalContext;

