import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import dateFormat from "dateformat";
import {useRouter} from 'next/router'

export default function Home({ resp, data }) {

  const router = useRouter();

  const handleClick = ({slug}) => {
    console.log("slug :>>", slug)
    router.push("/campaigns/"+slug)
  }
  return (
    <div>
      <Head>
        <title>Campaign | Home</title>
        <meta />
      </Head>
      <div className={styles.main}>
      {data.map((campaign) => (
        <div key={campaign.id} className={styles.container} onClick={() => handleClick(campaign)}>
          <div className={styles.image}>
            <Image
              src={
                "https://res.cloudinary.com/ali-test-django/" + campaign.image
              }
              width={120}
              height={120}
              alt="image logo"
              className={styles.img}
            />
          </div>
          <div className={styles.title}>
            <h1>{campaign.title}</h1>
            <Link href={"campaigns/" + campaign.slug}>
              <a>
                <h2>{campaign.slug}</h2>
              </a>
            </Link>
          </div>
          <div className={styles.paragraph}>
            <p>{campaign.description}</p>
            <p>
              <small>{dateFormat(new Date(campaign.created_at), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small> 
            </p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch(`${process.env.BASE_URL}all/`);
  const data = await response.json();
  console.log("first", process.env.BASE_URL);

  return {
    props: { data, resp: "succes" },
    revalidate: 60,
  };
}
