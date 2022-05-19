import React, { useState, useEffect } from 'react';

import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from "axios";

import Header from '../../components/header';
import Footer from '../../components/footer';

export default function OpenComponent() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            // get the open components data
            // if certification, render the certification component
            let endpoint = "https://api.learnir.co/v1";
            axios.get(`${endpoint}/integration/module/component/interaction/open/${id}`).then(response => {
                setData(response.data);
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            });
        }
    }, [id]);

    return (
        <div className="page">
            <Head>
                <title>Learnir - {data?.interaction["title"]}</title>
            </Head>

            <Header />

            <div className="container main-struc text-center">
                {
                    loading ?
                        <p>Loading component data...</p>
                        :
                        <div>
                            {
                                data ?
                                    <div className="mt-5">

                                        <h3 className="">{data.organization["name"]} acknowledges the following <br /> learner accomplishment</h3>
                                        <p className="mb-3"> Issued by {data.organization["name"]} on {new Date(data.interaction["added"]).toDateString()}</p>

                                        <div className="w-100" >
                                            <img src={data.interaction["certificate_image"]} className="certificate_image" height="400px" width="auto" />
                                        </div>
                                        <p className="mb-3 text-brand align-items-center"> This certificate exists as valid <svg className='mb-1' width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></p>

                                        <a rel="noreferrer" target="_blank" href={data.interaction["certificate"]} download>
                                            <button className="bg-brand border-0 pr-2 pl-2 text-white rounded font-sm">Download Certificate</button>
                                        </a>

                                    </div>
                                    :
                                    <p>Component data was not found, component verification failed. Check connection & for extra validation, contact support at team@learnir.co</p>
                            }
                        </div>
                }
            </div>

            <div className="container pt-5 pb-4">
                <Footer />
            </div>
        </div>
    )
}
