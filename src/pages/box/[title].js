import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Link2Icon } from '@radix-ui/react-icons'
import ReactPlayer from 'react-player'

import { PortalStateContext } from '../../context/state';

import Header from '../../components/header'
import Footer from '../../components/footer'

const learnir = require("learnir-javascript-sdk");
const learnirClient = new learnir.LearnirApi({ baseOptions: { headers: { "key": "325649396932805193" } } });

export async function getStaticPaths() {
    let response = await learnirClient.content();
    return {
        paths: response.data.map((box) => {
            return { params: { title: `${box.slug}`, } }
        }),
        fallback: false,
    }
}

export async function getStaticProps() {
    let response = await learnirClient.content();
    console.log("response sdk", response);
    return { props: { content: response.data } }
}

export default function Box({ content }) {

    const router = useRouter();
    const PortalState = useContext(PortalStateContext);

    let [menu, setMenu] = useState(false);
    let [box, setBox] = useState();
    let [section, setSection] = useState();

    let links = [
        { label: "Home", path: "/" },
        { label: "Content", path: "/#content" },
    ];

    useEffect(() => {
        let box = content.filter(choice => choice.slug == router.query.title)[0];
        if (box) {
            setBox(box);
            if (box.sections) {
                setSection(box.sections[0]);
            }
        }
    }, [])


    return (
        <div className="container-struc">
            <Head>
                <title>Portal - Online learning experience</title>
                <meta name="description" content="Join us on our learning portal as we take you through beginner to mastery of our products" />
                <link rel="icon" href="/logo.png" />
            </Head>

            <Header />

            <main className={`container main-struc ps-1 pe-1`}>
                <div className="row mx-auto pt-4">
                    <div className="col-lg-8 col-md-12 col-sm-12">
                        <div className="row">
                            <h3 className="d-flex justify-content-between mb-3"> {section?.title} </h3>
                            {
                                section?.files.video ?
                                    <ReactPlayer
                                        controls={true}
                                        url={section?.files?.video}
                                        className="w-100 h-auto rounded portal-video-box"
                                        config={{
                                            file: {
                                                attributes: {
                                                    onContextMenu: e => e.preventDefault(),
                                                    controlsList: 'nodownload'
                                                }
                                            }
                                        }}
                                    />
                                    :
                                    <div className="w-100 mb-3">
                                    </div>
                            }
                        </div>
                        <div className="row mt-3 justify-content-start">
                            {
                                section?.files?.others.map((file, index) => {
                                    return (
                                        <div className="col-lg-4 col-md-12 col-sm-12" key={index}>
                                            <a target="_blank" rel="referrer" href={file.url} download={file.name} className="text-decoration-none text-dark">
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
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="portal-content p-1" dangerouslySetInnerHTML={{ __html: section?.content }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="w-100 mb-3">
                            <h3 className="d-flex justify-content-between"> Sections </h3>
                        </div>
                        <div className="w-100 mt-3">
                            {box?.sections.map((step, index) => (
                                <div
                                    role="button"
                                    key={index}
                                    className={`mt-2 w-100 h-auto pointed text-start p-1 rounded ps-3 pe-3 align-items-center ${section.id == step.id ? 'bg-brand text-whited' : ''}`}
                                    onClick={() => { setSection(step); learnirClient.record({ event: "section-change" }); }}>
                                    <h5 className="fw-normal text-truncate mt-2">{step.title}</h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

        </div >
    )
}
