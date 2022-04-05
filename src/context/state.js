import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router'

const PortalContext = createContext();

export function PortalStateProvider({ children }) {

  const router = useRouter()

  // data
  const [getPort, setPort] = useState(null);
  const [getBox, setBox] = useState(null);
  const [getSection, setSection] = useState();

  // modal
  const [getShow, setShow] = useState(false);

  // functions
  function authenticated() {
    return !true ? false : true;
  }

  function SetupStuff() {

    let content = [
      {
        "title": "Engineering in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "100",
            "title": "Introduction to Learnir",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "Regulators, including the U.S. Securities and Exchange Commission, have regulations emphasizing the obligations of financial institutions to protect the privacy of nonpublic personal information of individuals.  Tiger Global Management, LLC (“Tiger Global” or the “Firm”) takes our clients’ and investors’ privacy seriously.  Please read this notice carefully to understand how we collect, share, and protect your personal information.",
            "files": {
              "video": "/videos/accord.mp4",
              "others": [
                { id: "1", name: "guide.pdf", url: "https://learnir.co" },
                { id: "2", name: "project.zip", url: "https://learnir.co" },
                { id: "3", name: "map.png", url: "https://learnir.co" },
                { id: "4", name: "voice.mp4", url: "https://learnir.co" },
              ]
            },
            "meta": {
              "hide": false
            }
          },
          {
            "id": "200",
            "title": "Building on Learnir",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "/videos/cohere.mp4",
              "others": []
            },
            "meta": {
              "hide": false
            }
          },
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
      {
        "title": "Product Development in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "c492b619-c9e0-43a9-b4c7-c89fe756a665",
            "title": "Welcome",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "",
              "others": []
            },
            "meta": {
              "hide": false
            }
          }
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
      {
        "title": "Product Development in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "c492b619-c9e0-43a9-b4c7-c89fe756a665",
            "title": "Welcome",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "",
              "others": []
            },
            "meta": {
              "hide": false
            }
          }
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
      {
        "title": "Engineering in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "c492b619-c9e0-43a9-b4c7-c89fe756a665",
            "title": "Welcome",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "",
              "others": []
            },
            "meta": {
              "hide": false
            }
          }
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
      {
        "title": "Product Development in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "c492b619-c9e0-43a9-b4c7-c89fe756a665",
            "title": "Welcome",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "",
              "others": []
            },
            "meta": {
              "hide": false
            }
          }
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
      {
        "title": "Product Development in the wild",
        "description": "Introduction to UE5 engine, the world has never seen this before.",
        "image": "/images/back.jpg",
        "sections": [
          {
            "id": "c492b619-c9e0-43a9-b4c7-c89fe756a665",
            "title": "Welcome",
            "summary": "Summary of the video and the doing of something else in the world of programming.",
            "content": "",
            "files": {
              "video": "",
              "others": []
            },
            "meta": {
              "hide": false
            }
          }
        ],
        "access": "open",
        "price": 0,
        "meta": {},
        "organization": "325472037290115657",
        "id": "325530498865562188"
      },
    ];

    let port = {
      content,
      details: {
        logo: '/images/slack.png',
        label: "Slack",
        title: "Slack Community Content Portal",
        description: "Below we give you access to a variety of Learnir education content to learn more."
      }
    }

    setPort({ ...port });
  }

  const isBrowser = () => typeof window !== "undefined"

  const data = {
    authenticated, isBrowser, SetupStuff,
    getShow, setShow,
    getBox, setBox,
    getSection, setSection,
  };

  return (<PortalContext.Provider value={data}> {children} </PortalContext.Provider>);
}

export const PortalStateContext = PortalContext;

