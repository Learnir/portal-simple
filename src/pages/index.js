import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Header from '../components/header'
import Footer from '../components/footer'

import { PortalStateContext } from '../context/state';
import { config } from '../context/state';
import { CaretRightIcon, LightningBoltIcon } from '@radix-ui/react-icons'

const learnir = require("learnir-javascript-sdk");
const learnirClient = new learnir.LearnirApi({ baseOptions: { headers: { "key": config.integrations.key } } });

export async function getStaticProps() {
  let response = await learnirClient.content();
  console.log("response sdk", response);
  return { props: { content: response.data }, revalidate: 60 }
}
export default function Index({ content }) {
  const AppState = useContext(PortalStateContext);
  const [categories, setCategories] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    learnirClient.record({
      event: "main-page-visit",
      consumer: AppState.profile.data?.id,
      context: {}
    });
    learnirClient.record({
      event: "learner.active",
      consumer: AppState.profile.data?.id,
      context: {}
    });

    // get enrolled boxes 
    if (AppState.profile.data?.id) {
      learnirClient.records(AppState.profile.data.id).then(response => {
        // enrolled boxes array
        let enrolled = [];
        let completed = [];
        response.data.events.forEach(event => {
          if (event.event_name == "box.enrolled" && event.event_context.box) {
            enrolled.push(event.event_context.box);
          }
          if (event.event_name == "box.complete" && event.event_context.box) {
            completed.push(event.event_context.box);
          }
        });

        let enrollments = [...new Set(enrolled)];
        let completions = [...new Set(completed)];
        setEnrollments(enrollments);
        setCompletions(completions);
      })
    }
  }, []);

  useEffect(() => {
    // check for listings style
    if (config.portal.listings_style == "categorized") {

      // collect content categories
      let taged = [];
      let untagged = [];
      content.map(box => box.tags && box.tags.map(tag => taged.push(tag)));
      let tags = [...new Set(taged)];
      console.log("tags", tags);

      // categorize the boxes
      let categories = [];
      tags.forEach(tag => {
        let boxes = content.filter(box => box.tags && box.tags.includes(tag));
        categories.push({ tag, boxes });
      });
      console.log("categories", categories);

      // handle untagged boxes
      let boxes = content.filter(box => !box.tags);
      categories.push({ tag: "Others", boxes });

      // push for rendering
      setCategories(categories);
    }
  }, [content]);

  return (
    <div className="container-struc">
      <Head>
        <title>Portal - Online learning experience</title>
        <meta name="description" content="Join us on our learning portal as we take you through beginner to mastery of our products" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />

      <main className="container main-struc">

        <div className="row mx-auto pt-3 p-0 align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12 text-left align-items-center">
            <h2 className="pt-2">{config.portal.title}</h2>
            <p>{config.portal.description}</p>

            <Link href="/#content"><button className="p-2 pe-3 ps-3 border">Help Center</button></Link>
            <Link href="/#content"><button className="p-2 pe-3 ps-3 mr-2 border">Training Team</button></Link>
            <Link href="/#content"><button className="p-2 pe-3 ps-3 mr-2 border">Heap Community</button></Link>

          </div>
          <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-end">
            <img src={config.company.cover} className="rounded-top mb-2" height="80px" width="auto" />
          </div>
        </div>

        {config.portal.listings_style === "uncategorized" ?
          <div className="row pt-5 p-3 justify-content-start align-self-start" id="content">
            {content && content.map((box, index) => {
              return (
                <div key={index} className="col-lg-4 col-md-12 col-sm-12 text-left border p-3">
                  <Link href={`/${box.slug}`}>
                    <div className="w-100 h-100">
                      <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                      <h6 className="mt-3">{box.title}</h6>
                      <p className="mt-2 fw-n line-clamp">{box.description}</p>

                      {completions.includes(box.id) ?
                          <button> Completed! <LightningBoltIcon /></button>
                          :
                          <button>{enrollments.includes(box.id) ? "Registered" : "Start Learning"} <CaretRightIcon className='mb-1' /></button>
                      }

                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
          :
          <div className="row pt-5 p-3 justify-content-start align-self-start" id="content">
            {categories && categories.map((category, index) => {
              return (
                <div key={index} className="row pt-3 justify-content-start align-self-start">
                  <div className="col-lg-12 col-md-12 col-sm-12 text-left p-2">
                    <h6 className="mt-3">{category.tag}</h6>
                  </div>

                  {category.boxes.map((box, index) => {
                    return (
                      <div key={index} className="col-lg-4 col-md-12 col-sm-12 text-left border p-3">
                        <Link href={`/${box.slug}`}>
                          <div className="w-100 h-100">
                            <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                            <h6 className="mt-3">{box.title}</h6>
                            <p className="mt-2 fw-n line-clamp">{box.description}</p>

                            {
                              completions.includes(box.id) ?
                                <button> Completed! <LightningBoltIcon /></button>
                                :
                                <button>{enrollments.includes(box.id) ? "Registered" : "Start Learning"} <CaretRightIcon className='mb-1' /></button>
                            }
                          </div>
                        </Link>
                      </div>
                    )
                  })}

                </div>
              )
            })}
          </div>
        }
      </main>

      <Footer />

    </div >
  )
}
