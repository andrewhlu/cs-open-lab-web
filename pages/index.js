import Layout from "../components/Layout";
import { getSession } from '../utils/session';
import config from "../utils/config";
import Head from "next/head";

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);
  const debug = config.DEBUG === "TRUE";

  return {
    props: {
      query: context.query,
      session: session,
      debug: debug
    }
  }
}

function HomePage(props) {
  return (
    <>
      <Head>
        <title>CS Open Lab Concept</title>
        <meta property="og:title" content="CS Open Lab Concept" key="title" />
      </Head>
      <Layout session={props.session} alert={props.query?.error}>
        { props.debug ?
          <div>
            Here's what the server knows about you:
            <pre>{JSON.stringify(props.session, null, "\t")}</pre>
          </div>
        : <></> }
      </Layout>
    </>
  );
}

export default HomePage;
