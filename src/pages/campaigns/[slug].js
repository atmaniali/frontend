import Image from "next/image";
import Header from "next/head";
import { useState } from "react";
import styles from "../../styles/Detail.module.css";
import Link from "next/link";
import dateFormat from "dateformat";

export default function Detail({ response }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  console.log(email);
  const createSubscriber = (event) => {
    event.preventDefault();
    console.log("body :>>", JSON.stringify({ email, campaign: response.id }));
    const options = {
      method: "POST",
      // mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        // 'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        email,
        campaign: response.id,
      }),
    };
    fetch("http://127.0.0.1:8000/api/campaigns/subscriper/create/", options)
      .then((res) => res.json())
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log("err :>>", err);
        setError(JSON.stringify(err.message));
      });
  };
  return (
    <div className={styles.body}>
      <Header>
        <title>{response.title} | details</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Header>

      {/* background style */}
      <div className={styles.wrapper}>
        <div className={styles.main}></div>
      </div>
      <div className={styles.containers}>
        <div>
          <Image
            src={"https://res.cloudinary.com/ali-test-django/" + response.image}
            alt="logo"
            width={120}
            height={120}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <div>
              <h1>{response.title}</h1>
              <h2>{response.slug}</h2>
            </div>
            <div>
              <p>{response.description}</p>
              <p>
                <small>{dateFormat(new Date(response.created_at), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small> 
                <br/>
              </p>
            </div>
          </div>
          <div className={styles.right}>
            <form className={styles.formSet}>
              <input
                type="email"
                placeholder="Entre a mail: exmp123@exmp.com"
                name="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className={styles.formInput}
              />
              <input
                type="submit"
                name="submit"
                value="Subscribe"
                onClick={createSubscriber}
                className={styles.subscribe}
              />
            </form>
          </div>
        </div>
      </div>

      {/* compaign details */}

      {/* footer style */}
      <footer className={styles.footer}>
        <Link href="/">
          <a>
            <h1>All Campaign</h1>
          </a>
        </Link>
      </footer>
    </div>
  );
}

export async function getStaticPaths() {
  const response = await fetch(`${process.env.BASE_URL}all/`).then((response) =>
    response.json()
  );
  const allSlugs = response.map((slug) => ({ params: { slug: slug.slug } }));

  return {
    paths: allSlugs,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  console.log("params :>>", params);
  const response = await fetch(`${process.env.BASE_URL}details/${params.slug}`)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err.message);
    });
  return {
    props: { response },
    revalidate: 60,
  };
}
