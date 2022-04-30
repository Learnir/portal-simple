import React, { useState, useEffect, useContext, useRef } from 'react';

import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { AppStateContext, config } from '../context/state';

export default function Footer(props) {
    const AppState = useContext(AppStateContext);

    return (
        <footer className="pt-2 pb-2 mt-5 container footer-struc">
            <div className="hero row mx-auto pt-4 border-top">
                <div className="col-8 text-center mx-auto">
                    <p>&copy; A {config.organization.name} experience</p>
                </div>
            </div>
        </footer>
    )
}
