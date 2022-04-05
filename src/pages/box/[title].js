import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { FaceIcon, ImageIcon, HamburgerMenuIcon, Cross1Icon, RotateCounterClockwiseIcon } from '@radix-ui/react-icons'
import ReactPlayer from 'react-player'
import Header from '../../components/header'

const learnir = require("learnir-javascript-sdk");
const client = new learnir.LearnirApi({ baseOptions: { headers: { "key": "325649396932805193" } } });


export async function getStaticPaths() {
    let response = await client.content();

    return {
        paths: response.data.map((box) => {
            return { params: { title: `${box.slug}`, } }
        }),
        fallback: false,
    }
}

export async function getStaticProps() {
    let response = await client.content();
    console.log("response sdk", response);

    return { props: { content: response.data } }
}


export default function Box({ content }) {

    const router = useRouter();
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
                            <p className="d-flex justify-content-between fw-normal mb-3"> {section?.title} </p>
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


                        <div className="row mt-2 justify-content-start">
                            {
                                section?.files?.others.map((file, index) => {
                                    return (
                                        <div className="col-lg-2 col-md-12 col-sm-12" key={index}>
                                            <div className="pointed p-2 text-brand">
                                                <a target="_blank" href={file.url} download={file.name} >
                                                    <Paragraph size={300} className="text-truncate align-items-center text-">
                                                        <PaperclipIcon size={12} className="mr-2" />
                                                        {file.name}
                                                    </Paragraph>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="row mt-2 justify-content-start">
                            <div className="col-lg-12 col-md-12 col-sm-12 p-4">
                                <div className="portal-content" dangerouslySetInnerHTML={{ __html: section?.content }}>
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
                                    className={`mt-2 w-100 h-auto pointed text-start border p-1 rounded ps-3 pe-3 align-items-center ${section.id == step.id ? 'bg-brand text-whited' : ''}`}
                                    onClick={() => { setSection(step) }}>
                                    <h5 className="fw-normal text-truncate mt-2">{step.title}</h5>
                                </div>
                            ))}
                        </div>
                    </div>
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
