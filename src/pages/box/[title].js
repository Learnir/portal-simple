import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { FaceIcon, ImageIcon, HamburgerMenuIcon, Cross1Icon, RotateCounterClockwiseIcon } from '@radix-ui/react-icons'

import ReactPlayer from 'react-player'

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

            {menu && <div className="container mt-5 border-bottom pb-2">
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


            <main className={`container main-struc mt-5 ps-1 pe-1`}>
                <div className="row mx-auto pt-5">
                    <div className="col-lg-8 col-md-12 col-sm-12">
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
                    <div className="col-4">
                        <div className="w-100 mb-3">
                            <h3 className="d-flex justify-content-between"> Sections </h3>
                        </div>
                        <div className="w-100 mt-3">
                            {box?.sections.map((step, index) => (
                                <div
                                    role="button"
                                    key={index}
                                    className={`mt-2 w-100 h-auto pointed text-start border p-1 rounded ps-3 pe-3 align-items-center ${section.id == step.id ? 'bg-brand text-whited':''}`}
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
