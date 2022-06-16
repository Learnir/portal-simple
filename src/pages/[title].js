import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Link2Icon, CheckCircledIcon } from '@radix-ui/react-icons'
import ReactPlayer from 'react-player'
import Ticker from 'react-ticker'

import { AppStateContext, config } from '../context/state';

import Header from '../components/header'
import Footer from '../components/footer'


export async function getStaticPaths() {
    let response = await config.learnir.client.content();
    return {
        paths: response.data.map((box) => {
            return { params: { title: `${box.slug}` } }
        }),
        fallback: false,
    }
}

export async function getStaticProps() {
    let response = await config.learnir.client.content();
    return { props: { content: response.data }, revalidate: 60 }
}

export default function Box({ content }) {

    const router = useRouter();
    const AppState = useContext(AppStateContext);
    let [box, setBox] = useState();
    let [section, setSection] = useState();
    let [enrolled, setEnrolled] = useState();
    let [loading, setLoading] = useState(true);
    let [sectionsCompleted, setSectionsCompleted] = useState([]);

    function InitBox() {
        let box = content.filter(choice => choice.slug == router.query.title)[0];
        if (box) {
            // set box data
            setBox(box);

            // set first section
            if (box.sections) {
                setSection(box.sections[0]);
                if (AppState.profile.data) {
                    // record learning events for the first section
                    config.learnir.client.record({
                        event: "section.visit",
                        consumer: AppState.profile.data.id,
                        context: {
                            box: box.id,
                            section: box.sections[0]?.id
                        }
                    });
                    config.learnir.client.record({
                        event: "section.complete",
                        consumer: AppState.profile.data.id,
                        context: {
                            box: box.id,
                            section: box.sections[0]?.id
                        }
                    }).then(() => {
                        setSectionsCompleted([...sectionsCompleted, box.sections[0]?.id]);
                    })
                }
            }

            // set events
            config.learnir.client.record({ event: "box.visit", consumer: AppState.profile.data?.id, context: { "box": box.id } });

            // get 
            if (AppState.profile.data?.id) {
                config.learnir.client.records(AppState.profile.data.id).then(response => {
                    // check if the consumer is enrolled in this box
                    let enrolled = response.data.events.filter(event => event.event_name == "box.enrolled" && event.event_context.box == box.id);
                    let sectioned = []
                    response.data.events.filter(event => {
                        if (event.event_name == "section.complete" && event.event_context.box == box.id) {
                            // push into the sectioned
                            sectioned.push(event.event_context.section);
                        }
                    });
                    setSectionsCompleted([...sectionsCompleted, ...sectioned]);
                    if (enrolled[0]) {
                        // show learning mode
                        setEnrolled(true);
                        setLoading(false);
                    } else {
                        // show enrollment mode
                        setEnrolled(false);
                        setLoading(false);
                    }
                }).catch(error => {
                    setEnrolled(false);
                    setLoading(false);
                })
            } else {
                setEnrolled(false);
                setLoading(false);
            }
        } else {
            setEnrolled(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        InitBox();
    }, []);

    useEffect(() => {
        let exp_element = document.querySelector('learnir-exp-module');
        if (section?.type == "component" && exp_element) {
            exp_element.addEventListener('callback', event => {
                console.log("exp-module-callback-recorded");

                // record events
                if (event.detail == "section.visit") {
                    config.learnir.client.record({
                        event: "section.visit",
                        consumer: AppState.profile.data.id,
                        context: {
                            box: box?.id,
                            section: section.id
                        }
                    });
                } else if (event.detail == "section.complete") {
                    config.learnir.client.record({
                        event: "section.complete",
                        consumer: AppState.profile.data.id,
                        context: {
                            box: box?.id,
                            section: section.id
                        }
                    }).then(() => {
                        setSectionsCompleted([...sectionsCompleted, section.id]);
                    })
                }
            })
        }
    }, [section]);

    return (
        <div className="container-struc">
            <Head>
                <title>{config.organization.name} - {box?.title}</title>
                <meta name="description" content={box?.description} />
                <link rel="icon" href={box?.image} />
            </Head>

            <Header />

            {!loading ?
                <main className={`container main-struc ps-1 pe-1`}>
                    {enrolled ?
                        <div className="row mx-auto pt-2 border rounded">
                            <div className="col-lg-8 col-md-12 col-sm-12 p-3 rounded learning-section bg-white">
                                <div className="row p-2">

                                    {section.type == "component" ?
                                        <learnir-exp-module
                                            component={section.id}
                                            consumer={AppState.profile.data.id}
                                            box={box.id}
                                            port_key={config.learnir.port_key}
                                        ></learnir-exp-module>
                                        :
                                        <h3 className="d-flex justify-content-between mb-3"> {section.title} </h3>
                                    }

                                    {section.files.video ?
                                        <ReactPlayer
                                            controls={true}
                                            url={section.files.video}
                                            className="w-100 h-auto rounded portal-video-box"
                                            config={{
                                                file: {
                                                    attributes: {
                                                        onContextMenu: e => e.preventDefault(),
                                                        controlsList: 'nodownload'
                                                    }
                                                }
                                            }}
                                            onStart={() => {
                                                // record when consumer clicks to watch video
                                                config.learnir.client.record({
                                                    event: "section.video.watch",
                                                    consumer: AppState.profile.data.id,
                                                    context: {
                                                        box: box?.id,
                                                        section: section.id
                                                    }
                                                });
                                            }}
                                            onEnded={() => {
                                                // record when consumer clicks to watch video
                                                config.learnir.client.record({
                                                    event: "section.video.complete",
                                                    consumer: AppState.profile.data.id,
                                                    context: {
                                                        box: box?.id,
                                                        section: section.id
                                                    }
                                                });
                                            }}
                                        />
                                        :
                                        <div className="w-100 mb-3">
                                        </div>
                                    }
                                </div>
                                <div className="row mt-3 justify-content-start p-2">
                                    {
                                        section.files.others.map((file, index) => {
                                            return (
                                                <div className="col-lg-4 col-md-12 col-sm-12" key={index}>
                                                    <a target="_blank" rel="noreferrer" href={file.url} download={file.name} className="text-decoration-none text-dark">
                                                        <h5 size={300} className="text-truncate align-items-center text-">
                                                            <Link2Icon /> {file.name}
                                                        </h5>
                                                    </a>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="row justify-content-start">
                                    <div className="col-lg-12 col-md-12 col-sm-12 p-0">
                                        <div className="portal-content p-1" dangerouslySetInnerHTML={{ __html: section.content }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 col-sm-12 pt-3 rounded sections-list bg-white">
                                <div className="w-100 mb-3">
                                    <h3 className="d-flex justify-content-between"> Sections </h3>
                                </div>
                                <div className="w-100 mt-3">
                                    {box?.sections.map((step, index) => (
                                        <div role="button" key={index}
                                            className={`mt-2 w-100 h-auto pointed text-start p-1 rounded ps-3 pe-3 align-items-center ${section.id == step.id ? 'bg-brand text-whited' : ''}`}
                                            onClick={() => {

                                                setSection(step);

                                                if (!step.type) {
                                                    config.learnir.client.record({
                                                        event: "section.visit",
                                                        consumer: AppState.profile.data.id,
                                                        context: {
                                                            box: box?.id,
                                                            section: step.id
                                                        }
                                                    });
                                                    config.learnir.client.record({
                                                        event: "section.complete",
                                                        consumer: AppState.profile.data.id,
                                                        context: {
                                                            box: box?.id,
                                                            section: step.id
                                                        }
                                                    }).then(() => {
                                                        setSectionsCompleted([...sectionsCompleted, step.id]);
                                                    })
                                                }
                                            }}>

                                            <h5 className="fw-normal text-truncate mt-2">
                                                {sectionsCompleted.includes(step.id) ? <CheckCircledIcon /> : ""} {step.title} {step.type == "component" && <span className="bg-brand badge badge-primary">{step.component}</span>}
                                            </h5>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        :
                        <div className="row mx-auto pt-2">
                            <div className="col-lg-7 col-md-12 col-sm-12">
                                <img src={box?.image} className="rounded mb-2" height="auto" width="100%" />
                                <p className=""> {box?.description} </p>
                                <button className="p-2 pe-3 ps-3 mr-2 border bg-brand text-white" onClick={() => {
                                    // check if authenticated
                                    if (AppState.profile.data?.id) {
                                        // record the box.enroll event
                                        config.learnir.client.record({
                                            event: "box.enrolled",
                                            consumer: AppState.profile.data.id,
                                            context: {
                                                box: box?.id
                                            }
                                        }).then(response => {
                                            console.log("enrolled", response);
                                            InitBox();
                                        }).catch(error => {
                                            alert("Error enrolling, contact support");
                                        })
                                    } else {
                                        AppState.setShow(true);
                                        alert("Please authenticate yourself to get started");
                                    }
                                }}>Start this Course</button>
                            </div>

                            <div className="col-lg-5 col-md-12 col-sm-12">
                                <div className="w-100">
                                    <h3 className="d-flex justify-content-between"> {box?.title} </h3>
                                </div>
                                <div className="row mt-3">

                                    {box?.sections.filter(section => box.categories.filter(category => category.sections.includes(section.id))[0] ? false : true).map((step, index) => (
                                        <div key={index} className="col-12 rounded">
                                            <p className="fw-normal">{step.title}</p>
                                        </div>
                                    ))}

                                    {box?.categories?.map((category, index) => (
                                        <div key={index} className="col-12 mt-3 rounded">
                                            <h3 className="d-flex justify-content-between"> {category.title} </h3>

                                            <div className="border rounded">
                                                {category.sections && category.sections.length > 0 ? box.sections.filter(section => category.sections.includes(section.id)).map((section, sectionIndex) => (
                                                    <div className="p-2" key={sectionIndex}>
                                                        <p className="m-0">{section.title}</p>
                                                    </div>))
                                                    :
                                                    <p>Category has no sectons</p>
                                                }
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    }
                </main>
                :
                <main className="container main-struc ps-1 pe-1">

                    <div className="row mx-auto pt-5">
                        <div className="col-lg-4 col-md-12 col-sm-12 text-center mx-auto">
                            <div className="lds-ripple mx-auto"><div></div><div></div></div>
                            <p className="mt-2 mx-auto">Loading...</p>
                        </div>
                    </div>
                </main>
            }

            <Footer />
        </div >
    )
}
