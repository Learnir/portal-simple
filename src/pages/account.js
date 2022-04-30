import React, { useState, useEffect, useContext } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Header from '../components/header'
import Footer from '../components/footer'

import { PortalStateContext } from '../context/state';
import { config } from '../context/state';
import { ArrowTopRightIcon, AvatarIcon } from '@radix-ui/react-icons'

const learnir = require("learnir-javascript-sdk");
const learnirClient = new learnir.LearnirApi({ baseOptions: { headers: { "key": config.integrations.key } } });

export default function Account() {
  const AppState = useContext(PortalStateContext);

  const [enrollments, setEnrollments] = useState([]);
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
  }, []);

  useEffect(() => {
    AppState.setShow(false);

    // get enrolled boxes 
    if (AppState.profile.data?.id) {
      learnirClient.content(AppState.profile.data.id).then(response => {
        let content = response.data;
        AppState.setContent(content);

        learnirClient.records(AppState.profile.data.id).then(response => {
          // enrolled boxes array
          let enrolled = [];
          let completed = [];

          let enrolled_meta = [];
          let completed_meta = [];

          // find when 
          response.data.events.forEach(event => {
            if (event.event_name == "box.enrolled" && event.event_context.box) {
              enrolled.push(event.event_context.box);
              enrolled_meta.push(event);
            }
            if (event.event_name == "box.complete" && event.event_context.box) {
              completed.push(event.event_context.box);
              completed_meta.push(event);
            }
          });


          let enrollments_ids = [...new Set(enrolled)];
          let completions_ids = [...new Set(completed)];

          // find enrollment of class 
          let enrollments = [];
          content.forEach((box, index) => {
            if (enrollments_ids.includes(box.id)) {

              let enrollment_events = enrolled_meta.filter(event => event.event_name == "box.enrolled" && event.event_context.box);

              enrollments.push({
                ...box,
                title: box.title,
                enrolled: enrollment_events[0] ? new Date(enrollment_events[0].created_at).toLocaleDateString() : "Enrolled event not present",
                completed: "Not yet!",
              });
              if (completions_ids.includes(box.id)) {
                let completion_events = completed_meta.filter(event => event.event_name == "box.completed" && event.event_context.box);
                enrollments[index].completed = completion_events[0] ? new Date(completion_events[0].created_at).toLocaleDateString() : "Not Yet!"
              }
            }
          });

          setEnrollments(enrollments);
        });
      });
    }
  }, []);

  return (
    <div className="container-struc">
      <Head>
        <title>Portal - Online learning experience</title>
        <meta name="description" content="Join us on our learning portal as we take you through beginner to mastery of our products" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />

      <main className="container main-struc">
        <div className="row mx-auto pt-3">
          <div className="col-lg-4 col-md-12 col-sm-12 text-left pt-3">
            <AvatarIcon style={{ height: 60, width: "auto", fontWeight: 900, marginBottom: "3px" }} />
            <h2>{AppState.profile.data?.name}</h2>
            <p>{AppState.profile.data?.email}</p>
          </div>

          <div className="col-lg-4 col-md-12 col-sm-12 text-left">
            <h3 className=""> Enrollments </h3>

            <div className="row align-items-center">
              {enrollments.map((box, index) => {
                return (
                  <div key={index} className="col-lg-12 col-md-12 col-sm-12 text-left mt-2">
                    <div className="w-100 h-auto border rounded p-3 pb-0">
                      <h5 className="text-">
                        {box.title}
                        <Link href={`/${box.slug}`} target="_blank" className="ml-2 text-brand" rol="button"><ArrowTopRightIcon className="text-brand" role={"button"} /></Link>
                      </h5>
                      <p className="">Enrollment: {box.enrolled}</p>
                      <p className="">Completion: {box.completed}</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>

          <div className="col-lg-4 col-md-12 col-sm-12 text-left">
            <h3 className=""> Interactions </h3>

          </div>

        </div>
      </main>

      <Footer />

    </div >
  )
}
