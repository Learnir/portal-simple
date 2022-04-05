import React, { useState, useEffect, useContext } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { FaceIcon, ImageIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'

export async function getStaticProps() {
  const learnir = require("learnir-javascript-sdk");
  const client = new learnir.LearnirApi({ baseOptions: { headers: { "key": "325649396932805193" } } });
  let response = await client.content();
  console.log("response sdk", response);
  return { props: { content: response.data } }
}


export default function Home({ content }) {

  let [menu, setMenu] = useState(false);

  let links = [
    { label: "Home", path: "/" },
    { label: "Content", path: "/#content" },
  ];

  return (
    <div className="container-struc">
      <Head>
        <title>Portal - Online learning experience</title>
        <meta name="description" content="Join us on our learning portal as we take you through beginner to mastery of our products" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="border-bottom bg-white mb-5 fixed-top">
        <div className="container p-2">
          <div className="navbar">
            <div className="col-lg-6 col-md-12 col-sm-12 text-left d-flex align-items-center">
              <img src={"/logo.png"} className="rounded" height="30px" width="30px" />
              <h6 className="pointed ms-3 mt-1">Product learning</h6>
            </div>

            <div className="col d-none d-lg-flex d-xl-flex align-items-center pr-0 justify-content-end" >
              {
                links.map((route, index) => {
                  return (
                    <span className="me-5 align-items-center" key={index}>
                      <Link href={route.path}><h6 size={300} className="pointed cursor mt-2"><a>{route.label}</a></h6></Link>
                    </span>
                  )
                })
              }
              {
                typeof window != "undefined" && localStorage.getItem("token") ?
                  <button className="bg-red" onClick={() => { localStorage.removeItem("token"); }}> AuthOut </button>
                  :
                  <button className="bg-brand text-white"> AuthIn </button>
              }
            </div>

            <div className="col d-lg-none d-sm-flex d-md-flex align-items-end text-end text-right" >
              {
                menu ?
                  <Cross1Icon onClick={() => setMenu(false)} style={{ height: 25, width: "auto", fontWeight: 900 }} />
                  :
                  <HamburgerMenuIcon onClick={() => setMenu(true)} style={{ height: 25, width: "auto", fontWeight: 900 }} />
              }
            </div>

          </div>
        </div>
      </div>

      {menu && <div className="ontainer mt-5 border-bottom pb-2">
        <div className="bg-white d-flex justify-content-end">
          {
            links.map((route, index) => {
              return (
                <span className="me-5 align-items-center" key={index}>
                  <Link href={route.path}><h6 size={300} className="pointed cursor mt-2"><a>{route.label}</a></h6></Link>
                </span>
              )
            })
          }
          {
            typeof window != "undefined" && localStorage.getItem("token") ?
              <button className="bg-red" onClick={() => { localStorage.removeItem("token"); }}> AuthOut </button>
              :
              <button className="bg-white text-brand border-0 p-0"> AuthIn </button>
          }
        </div>
      </div>}

      <main className={`container main-struc ${menu ? '' : 'mt-5'}`}>
        <div className="hero row mx-auto pt-5">
          <div className="col-lg-6 col-md-12 col-sm-12 text-center mx-auto">
            <h2>Portal Simple</h2>
            <p>Welcome to your learning experience. A free and hands on collection of courses to help you build your learning experiences with Learnir.</p>
          </div>
          <div className="col-12 text-center">
            <button className="p-2 pe-3 ps-3">Explore Courses</button>
          </div>
        </div>

        <div className="content row mx-auto justify-content-start pt-5">
          {content.map((box, index) => {
            return (
              <Link key={index} href={`/box/${box.slug}`}>
                <div  className="col-lg-4 col-md-12 col-sm-12 text-left mx-auto border p-3">
                  <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                  <h6 className="mt-3">{box.title}</h6>
                  <p className="mt-2 fw-n">{box.description}</p>
                </div>
              </Link>
            )
          })}
        </div>

      </main>

      <footer className="pt-3 pb-3 mt-5 container footer-struc">

        <div className="hero row mx-auto pt-5 border-top">
          <div className="col-8 text-center mx-auto">
            <p>&copy;	A Portal Simple learning experience</p>
          </div>
        </div>

      </footer>
    </div >
  )
}
