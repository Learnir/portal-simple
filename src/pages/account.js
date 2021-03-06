import React, { useState, useEffect, useContext } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Header from '../components/header'
import Footer from '../components/footer'

import { AppStateContext, config } from '../context/state';

import { ArrowTopRightIcon, AvatarIcon } from '@radix-ui/react-icons'
import * as Dialog from '@radix-ui/react-dialog';
import { styled } from '@stitches/react';

const Overlay = styled(Dialog.Overlay, {
  background: 'rgba(0 0 0 / 0.5)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'grid',
  placeItems: 'center',
  overflowY: 'auto',
});

const Content = styled(Dialog.Content, {
  width: 'auto',
  background: 'white',
  height: "80vh",
  padding: 30,
  borderRadius: 4,
  overflowY: "scroll"
});


export default function Account() {
  const AppState = useContext(AppStateContext);

  const [enrollments, setEnrollments] = useState([]);

  function GeneratePageData() {
    // get enrolled boxes
    if (AppState.profile.data?.id) {

      // get content boxes
      config.learnir.client.content(AppState.profile.data.id).then(response => {
        let content = response.data;
        AppState.setContent(content);

        // get learning events (unqique)
        config.learnir.client.records(AppState.profile.data.id).then(response => {
          // enrolled boxes array
          let enrolled = [];
          let completed = [];

          let enrolled_meta = [];
          let completed_meta = [];

          // find when
          response.data.events.forEach(event => {
            if (event.name == "box.enrolled" && event.context.box) {
              enrolled.push(event.context.box);
              enrolled_meta.push(event);
            }
            if (event.name == "box.complete" && event.context.box) {
              completed.push(event.context.box);
              completed_meta.push(event);
            }
          });

          let enrollments_ids = [...new Set(enrolled)];
          let completions_ids = [...new Set(completed)];

          // find enrollment of class
          let enrollments = [];
          content.forEach((box, index) => {
            if (enrollments_ids.includes(box.id)) {
              let enrollment_events = enrolled_meta.filter(event => event.name == "box.enrolled" && event.context.box);
              enrollments.push({
                ...box,
                title: box.title,
                enrolled: enrollment_events[0] ? new Date(enrollment_events[0].created_at).toLocaleDateString() : "Enrolled event not present",
                completed: "Not yet!",
              });
              if (completions_ids.includes(box.id)) {
                let completion_events = completed_meta.filter(event => event.name == "box.completed" && event.context.box);
                enrollments[index].completed = completion_events[0] ? new Date(completion_events[0].created_at).toLocaleDateString() : "Not Yet!"
              }
            }
          });

          setEnrollments(enrollments);
        });

        // transform learning interactions
        config.learnir.client.interactions(AppState.profile.data.id).then(response => {
          let interactions = [];
          response.data.map(block => {
            // for each block, check for which
            let boxes = content.filter(box => box.sections.filter(sec => sec.id == block.id).length > 0);
            let box = boxes.length > 0 ? boxes[0].id : "";
            interactions.push({ ...block, box })
          });
          AppState.setInteractions(interactions);
        });
      });
    }
  }

  useEffect(() => {
    AppState.setShow(false);
    GeneratePageData();
  }, []);

  function ComponentView() {
    return (<Dialog.Root open={AppState.getView && AppState.getCompData} onOpenChange={(open) => AppState.setView(open)}>
      <Dialog.Portal>
        <Overlay>
          <Content className="dialog">
            <h3 size={300} className="mt-2 border-bottom pb-3 mb-2"> {AppState.getCompData?.title} </h3>
            {AppState.getCompData?.id && AppState.profile.data.id &&
              <learnir-exp-module
                component={AppState.getCompData.id}
                consumer={AppState.profile.data.id}
                box={AppState.getCompData.box}
                port_key={config.learnir.port_key}>
              </learnir-exp-module>
            }
          </Content>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
    )
  }

  return (
    <div className="container-struc">
      <Head>
        <title>{config.organization.name} - {config.portal.title}</title>
        <meta name="description" content={config.portal.description} />
        <link rel="icon" href={config.organization.logo} />
      </Head>

      <Header />

      {ComponentView()}

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
                        <Link href={`/${box.slug}`} target="_blank" rel="noreferrer" className="ml-2 text-brand" rol="button"><ArrowTopRightIcon className="text-brand" role={"button"} /></Link>
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

            <div className="row align-items-center">
              {AppState.getInteractions.map((box, index) => {
                return (
                  <div key={index} className="col-lg-12 col-md-12 col-sm-12 text-left align-items-top h-auto mt-2">
                    <div className="w-100 border rounded p-3">
                      <h5 className="text-">{box.title}</h5>
                      <p className="mb-0">Type: {box.component}</p>
                      <p className="mb-0 mt-2">Worked on: {new Date(box.updated ? box.updated : box.added).toLocaleDateString()}</p>
                      <p className="text-brand mb-0 mt-2" role="button" onClick={() => {
                        // openComponent Viewer
                        AppState.setCompData(box);
                        AppState.setView(true);
                      }}>View</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>

        </div>
      </main >

      <Footer />

    </div >
  )
}
