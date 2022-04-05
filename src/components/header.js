import React, { useState, useEffect, useContext, useRef } from 'react';

import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { FaceIcon, AvatarIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'

import { PortalStateContext } from '../context/state';
import { config } from '../context/state';

import * as Dialog from '@radix-ui/react-dialog';
import { styled } from '@stitches/react';

const learnir = require("learnir-javascript-sdk");
const learnirClient = new learnir.LearnirApi({ baseOptions: { headers: { "key": config.integrations.key } } });

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
    width: 420,
    background: 'white',
    padding: 30,
    borderRadius: 4,
});

const axios = require('axios');

export default function Header(props) {

    const PortalState = useContext(PortalStateContext);

    let [menu, setMenu] = useState(false);

    let links = [
        { label: "Home", path: "/" },
        { label: "Content", path: "/#content" },
    ];

    const [getAuthData, setAuthData] = useState({ email: '', code: '', name: "" })
    const [getLoading, setLoading] = useState(false);
    const [getCodeSent, setCodeSent] = useState(false);

    function TextInputEvent(e) {
        let name = e.target.name
        let value = e.target.value
        setAuthData({ ...getAuthData, [name]: value });
    }

    function AuthIn() {
        if (getAuthData.code) {
            // code is sent already, send code authenticate request
            axios.post(`${config.integrations.endpoint}/v1/interfaces/portal/authin/code`, getAuthData).then((response) => {
                localStorage.setItem("token", response.data.token);
                // add consumer to console
                learnirClient.consumer({ id: `${PortalState.profile().id}`, name: PortalState.profile().name, email: PortalState.profile().email }).then(response => {
                    console.log("consumer-create", response.data);
                }).catch(error => {
                    console.log("consumer-create-error", error);
                });
                // close the dialog
                // state will change automatically
                PortalState.setShow(false);
                setAuthData({ ...getAuthData, name: PortalState.profile().name });
                alert("Authenticated Successfully!");
            }).catch((error) => {
                console.log("AuthIn error data", error);
            });
        } else {
            // send in the code -email
            axios.post(`${config.integrations.endpoint}/v1/interfaces/portal/authin/email`, getAuthData).then((response) => {
                console.log("AuthIn response data", response.data);
                setCodeSent(true);
                alert("Your Authin code has been sent to your email.");
            }).catch((error) => {
                console.log("AuthIn error data", error);
                alert("Failed to send you the AuthIn code, check connection or contact support.");
            });
        }
    }

    function AuthUpdate() {
        if (PortalState.authenticated()) {
            // code is sent already, send code authenticate request
            axios.put(`${config.integrations.endpoint}/v1/interfaces/portal/account/${PortalState.profile()?.id}`, getAuthData).then((response) => {
                localStorage.setItem("token", response.data.token);
                // consumer name update
                learnirClient.consumer({ id: `${PortalState.profile().id}`, name: PortalState.profile().name }).then(response => {
                    console.log("consumer-update", response.data);
                }).catch(error => {
                    console.log("consumer-update-error", error);
                });
                // close the dialog
                // state will change automatically
                setAuthData({ ...getAuthData, name: PortalState.profile().name });
                PortalState.setShow(false);
                alert("Updated Successfully!");
            }).catch((error) => {
                alert("Failed to update account, please check info and contact support");
            });
        }
    }

    return (
        <div className="mb-5 p-2">
            <div className="border-bottom bg-white fixed-top">
                <div className="container p-2">
                    <div className="navbar p-0">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <Link href={"/"} >
                                <div className="text-left d-flex align-items-center">
                                    <img src={"/logo.png"} className="rounded" height="30px" width="30px" />
                                    <h6 className="pointed ms-3 mt-2">{config.company.name}</h6>
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

                            <Dialog.Root open={PortalState.getShow} onOpenChange={(open) => PortalState.setShow(open)}>
                                <Dialog.Trigger className="pt-0 pb-0 border-none border-0">
                                    {
                                        PortalState.authenticated() ?
                                            <div className="align-items-center">
                                                <h6 size={300} className="pointed cursor mt-2">
                                                    <AvatarIcon style={{ height: 15, width: "auto", fontWeight: 900, marginBottom: "3px" }} /> {PortalState.profile()?.name}
                                                </h6>
                                            </div>
                                            :
                                            <button className="bg-brand text-white" onClick={() => PortalState.setShow(true)}> AuthIn </button>
                                    }
                                </Dialog.Trigger>

                                <Dialog.Portal>
                                    <Overlay>
                                        <Content className="dialog">
                                            <h2 size={500} className="m" >Auth In</h2>
                                            <p size={300} className="mb-3" >{!getCodeSent ? 'This will tie activities to your profile.' : 'Code has been sent to your email.'}</p>

                                            {!PortalState.authenticated() ?
                                                <input
                                                    placeholder="Email"
                                                    label=""
                                                    name="email"
                                                    type="email"
                                                    className="w-100 p-2"
                                                    value={getAuthData.email}
                                                    onChange={TextInputEvent} />
                                                :
                                                <input
                                                    placeholder="Name"
                                                    label=""
                                                    name="name"
                                                    type="text"
                                                    className="w-100 p-2"
                                                    value={getAuthData.name}
                                                    onChange={TextInputEvent} />
                                            }

                                            {getCodeSent && !PortalState.authenticated() && <input
                                                placeholder="Code"
                                                label=""
                                                name="code"
                                                type="number"
                                                className="w-100 p-2 mt-2"
                                                value={getAuthData.code}
                                                onChange={TextInputEvent} />}

                                            {PortalState.authenticated() ?
                                                <div className="text-center p-3s">
                                                    <button className="bg-brand col-12 mt-2 p-2 text-white" onClick={AuthUpdate}>Update</button>
                                                    <button className="border-0 col-3 mx-auto mt-4 p-2 text-brand" onClick={() => {
                                                        localStorage.removeItem("token");
                                                        PortalState.setShow(false);
                                                    }}>Sign Out</button>
                                                </div>
                                                :
                                                <button className="bg-brand w-100 mt-2 p-2 text-white" onClick={AuthIn}>{!getCodeSent ? 'Send Login Code' : 'Complete AuthIn'}</button>
                                            }

                                        </Content>
                                    </Overlay>
                                </Dialog.Portal>
                            </Dialog.Root>

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
