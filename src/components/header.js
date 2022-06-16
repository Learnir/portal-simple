import React, { useState, useEffect, useContext, useRef } from 'react';

import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { FaceIcon, AvatarIcon, HamburgerMenuIcon, Cross1Icon, ChevronLeftIcon } from '@radix-ui/react-icons'

import { AppStateContext, config } from '../context/state';

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
    width: "400px",
    background: 'white',
    padding: 30,
    borderRadius: 4,
});

const axios = require('axios');

export default function Header(props) {

    const AppState = useContext(AppStateContext);
    const router = useRouter();

    let [menu, setMenu] = useState(false);
    const [getAuthData, setAuthData] = useState({ email: '', code: '', name: "" })
    const [getLoading, setLoading] = useState(false);
    const [getCodeSent, setCodeSent] = useState(false);

    let links = [
        { label: "Home", path: "/" },
        { label: "Courses", path: "/#content" },
        // { label: "Support", path: "/#content" },
    ];


    function TextInputEvent(e) {
        let name = e.target.name
        let value = e.target.value
        setAuthData({ ...getAuthData, [name]: value });
    }

    function AuthIn() {
        if (getAuthData.code) {
            // code is sent already, send code authenticate request
            axios.post(`${config.learnir.endpoint}/v1/interfaces/portal/authin/code`, getAuthData, {
                headers: {
                    key: config.learnir.port_key
                }
            }).then((response) => {
                localStorage.setItem("token", response.data.token);
                // add consumer to console
                config.learnir.client.consumer({ id: AppState.profile.data.id, name: AppState.profile.data.name, email: AppState.profile.data.email }).then(response => {
                    console.log("consumer-create", response.data);
                }).catch(error => {
                    console.log("consumer-create-error", error);
                });

                // close the dialog
                // state will change automatically
                AppState.setShow(false);
                setAuthData({ ...getAuthData, name: AppState.profile.data?.name });
                alert("Authenticated Successfully!");
            }).catch((error) => {
                console.log("AuthIn error data", error);
            });
        } else {
            // send in the code -email
            axios.post(`${config.learnir.endpoint}/v1/interfaces/portal/authin/email`, getAuthData).then((response) => {
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
        if (AppState.authenticated()) {
            // code is sent already, send code authenticate request
            axios.put(`${config.learnir.endpoint}/v1/interfaces/portal/account/${AppState.profile.data?.id}`, getAuthData).then((response) => {
                localStorage.setItem("token", response.data.token);
                // consumer name update
                config.learnir.client.consumer({ id: `${AppState.profile.data.id}`, name: AppState.profile.data.name }).then(response => {
                    console.log("consumer-update", response.data);
                }).catch(error => {
                    console.log("consumer-update-error", error);
                });
                // close the dialog
                // state will change automatically
                setAuthData({ ...getAuthData, name: AppState.profile.data.name });
                AppState.setShow(false);
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
                                    <img src={config.organization.logo} className="rounded" height="30px" width="30px" />
                                    <h6 className="pointed ms-3 mt-2">{config.organization.name}</h6>
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

                            <span className="me-5 align-items-center">
                                <a href={`mailto:${config.organization.email}`}  className="pointed cursor mt-2 text-dark text-decoration-none"><h6 className="pointed cursor mt-2 text-dark text-decoration-none">Support</h6></a>
                            </span>

                            <Dialog.Root open={AppState.getShow} onOpenChange={(open) => AppState.setShow(open)}>
                                <Dialog.Trigger className="pt-0 pb-0 border-none border-0">
                                    {
                                        AppState.authenticated() ?
                                            <div className="align-items-center">
                                                <h6 size={300} className="pointed cursor mt-2">
                                                    <AvatarIcon style={{ height: 15, width: "auto", fontWeight: 900, marginBottom: "3px" }} /> {AppState.profile.data?.name}
                                                </h6>
                                            </div>
                                            :
                                            <button className="bg-brand text-white" onClick={() => AppState.setShow(true)}> AuthIn </button>
                                    }
                                </Dialog.Trigger>

                                <Dialog.Portal>
                                    <Overlay>
                                        <Content className="dialog">

                                            {AppState.authenticated() &&
                                                <p size={300} className="m" role="button" onClick={() => {
                                                    localStorage.removeItem("token");
                                                    AppState.setShow(false);
                                                    router.push("/");
                                                }}>
                                                    <ChevronLeftIcon className='mb-1' /> Sign out
                                                </p>
                                            }

                                            <h2 size={300} className="mt-2"> {AppState.authenticated() ? AppState.profile.data.name : "Auth In"}</h2>
                                            <p size={300} className="mb-3" >{!getCodeSent ? 'This will help you keep your learning histories etc.' : 'Code has been sent to your email.'}</p>

                                            {!AppState.authenticated() ?
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

                                            {getCodeSent && !AppState.authenticated() && <input
                                                placeholder="Code"
                                                label=""
                                                name="code"
                                                type="number"
                                                className="w-100 p-2 mt-2"
                                                value={getAuthData.code}
                                                onChange={TextInputEvent} />}

                                            {AppState.authenticated() ?
                                                <div className="text-center p-3s">
                                                    <button className="bg-brand col-12 mt-2 p-2 text-white" onClick={AuthUpdate}>Update</button>

                                                    <Link href="/account">
                                                        <button className="border-0 col-12 mx-auto mt-4 p-2 text-brand">View Profile Page</button>
                                                    </Link>
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
