import React, { useState, useEffect, useContext } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Header from '../components/header'
import Footer from '../components/footer'

import { PortalStateContext } from '../context/state';
import { config } from '../context/state';

const learnir = require("learnir-javascript-sdk");
const learnirClient = new learnir.LearnirApi({ baseOptions: { headers: { "key": config.integrations.key } } });

export async function getStaticProps() {
  let response = await learnirClient.content();
  console.log("response sdk", response);
  return { props: { content: response.data } }
}
export default function Home({ content }) {
  const PortalState = useContext(PortalStateContext);

  useEffect(() => {
    learnirClient.record({ event: "page-visit" }); 
    learnirClient.record({ event: "active", consumer: "" }); 
}, []);

  return (
    <div className="container-struc">
      <Head>
        <title>Portal - Online learning experience</title>
        <meta name="description" content="Join us on our learning portal as we take you through beginner to mastery of our products" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />

      <main className={`container main-struc mt-5}`}>
        <div className="hero row mx-auto pt-5">
          <div className="col-lg-6 col-md-12 col-sm-12 text-center mx-auto">
            <h2>{config.portal.title}</h2>
            <p>{config.portal.description}</p>
          </div>
          <div className="col-12 text-center">
            <Link href="/#content">
              <button className="p-2 pe-3 ps-3">Explore Courses</button>
            </Link>
          </div>
        </div>

        <div className="content row mx-auto justify-content-start pt-5" id="content">
          {content.map((box, index) => {
            return (
              <Link key={index} href={`/box/${box.slug}`}>
                <div className="col-lg-4 col-md-12 col-sm-12 text-left mx-auto border p-3">
                  <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                  <h6 className="mt-3">{box.title}</h6>
                  <p className="mt-2 fw-n">{box.description}</p>
                </div>
              </Link>
            )
          })}
        </div>

      </main>

      <Footer />

    </div >
  )
}
