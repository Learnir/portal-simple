import React, { useState, useEffect, useContext, useRef } from 'react';

import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { FaceIcon, ImageIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'

import { PortalStateContext } from '../context/state';

export default function Header(props) {

    const PortalState = useContext(PortalStateContext);
    let [menu, setMenu] = useState(false);

    let links = [
        { label: "Home", path: "/" },
        { label: "Content", path: "/#content" },
    ];

    return (
        <div className="mb-5 p-2">
            <div className="border-bottom bg-white fixed-top">
                <div className="container p-2">
                    <div className="navbar p-0">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <Link href={"/"} >
                                <div className="text-left d-flex align-items-center">
                                    <img src={"/logo.png"} className="rounded" height="30px" width="30px" />
                                    <h6 className="pointed ms-3 mt-2">{PortalState.config.company.name}</h6>
                                </div>
                            </Link>
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
                                    <Link href={route.path}><h6 className="pointed cursor mt-2"><a>{route.label}</a></h6></Link>
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
        </div>
    )
}
