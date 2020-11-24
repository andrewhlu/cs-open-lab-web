import Layout from "../components/Layout";
import { getSession } from '../utils/session';

export async function getServerSideProps(context) {
  const session = await getSession(context.req, context.res);

  return {
    props: {
      query: context.query,
      session: session
    }
  }
}

function HomePage(props) {
  return (
    <>
      <Layout session={props.session} alert={props.query?.error}>
        <div>
          Here's what the server knows about you:
          <pre>{JSON.stringify(props.session, null, "\t")}</pre>
        </div>
      </Layout>
    </>
  );
}

export default HomePage;
