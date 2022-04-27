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
  return { props: { content: response.data }, revalidate: 60 }
}
export default function Home({ content }) {
  const AppState = useContext(PortalStateContext);

  useEffect(() => {
    learnirClient.record({
      event: "page-visit",
      consumer: AppState.profile?.id,
      context: {}
    });
    learnirClient.record({
      event: "consumer.active",
      consumer: AppState.profile?.id,
      context: {}
    });
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

        <div className="row pt-5 justify-content-start align-self-start" id="content">
          {content.map((box, index) => {
            return (
              <div key={index} className="col-lg-4 col-md-12 col-sm-12 text-left border p-3">
                <Link href={`/box/${box.slug}`}>
                  <div className="w-100 h-100">

                    <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                    <h6 className="mt-3">{box.title}</h6>
                    <p className="mt-2 fw-n">{box.description}</p>

                  </div>
                </Link>
              </div>
            )
          })}
        </div>

      </main>

      <Footer />

    </div >
  )
}
