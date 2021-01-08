import Layout from "../components/Layout";
import config from "../utils/config";
import { fetchText } from '../utils/fetch';
import { getSession } from '../utils/session';
import Head from "next/head";
import absoluteUrl from 'next-absolute-url';

export async function getServerSideProps(context) {
  const debug = config.DEBUG === "TRUE";
  const { origin } = absoluteUrl(context.req, 'localhost:3000');

  const session = await getSession(context.req, context.res);
  const rules = await fetchText(`${origin}/rules.md`);

  return {
    props: {
      query: context.query,
      session: session,
      debug: debug,
      rules: rules,
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
      <Layout session={props.session} alert={props.query?.error} rules={props.rules}>
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
