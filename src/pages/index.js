import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'


export async function getStaticProps() {
  const learnir = require("learnir-javascript-sdk");
  const client = new learnir.LearnirApi({ baseOptions: { headers: { "key": "325649396932805193" } } });
  let response = await client.content();
  console.log("response sdk", response);
  return { props: { content: response.data } }
}


export default function Home({ content }) {

  let links = [
    { label: "Home", path: "/" },
    { label: "Content", path: "/#content" },
  ]

  return (
    <div className="">
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

            <div className="col-lg-6 col-md-12 col-sm-12 d-flex justify-content-end align-items-center" >
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
                  <button className="bg-red" onClick={() => {
                    localStorage.removeItem("token");
                  }}> AuthOut </button>
                  :
                  <button className="bg-brand text-white"> AuthIn </button>
              }

            </div>
          </div>
        </div>
      </div>

      <main className="container mt-5">

        <div className="hero row mx-auto pt-5 w-50">
          <div className="col-8 text-center mx-auto">
            <h2>Portal Simple</h2>
            <p>Welcome to your learning experience. A free and hands on collection of courses to help you build your learning experiences with Learnir.</p>
          </div>
          <div className="col-12 text-center">
            <button className="p-2 pe-3 ps-3">Explore Courses</button>
          </div>
        </div>

        <div className="content row mx-auto pt-5">
          {content.map((box, index) => {
            return (
              <div key={index} className="col-4 text-left mx-auto border p-3">
                <img src={box.image} className="mx auto rounded-top mb-2" height="auto" width="100%" />
                <h6 className="mt-3">{box.title}</h6>
                <p className="mt-2">{box.description}</p>
              </div>
            )
          })}
        </div>

      </main>

      <footer className="mt-5 mb-5 border-top">

        <div className="hero row mx-auto pt-5 w-50">
          <div className="col-8 text-center mx-auto">
            <p>&copy;	A Portal Simple learning experience</p>
          </div>
        </div>

      </footer>
    </div>
  )
}
