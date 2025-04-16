import Head from "next/head";
import { Container, Button } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cloudinary DAM External Uploader</title>
        <meta name="description" content="Admin + External Upload Tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="py-5">
        <h1 className="mb-4">🚀 Cloudinary DAM External Uploader!</h1>
        <p>This app allows DAM admins to create secure upload interfaces for external contributors.</p>
        <div className="d-flex gap-2 mt-4">
          <Button variant="primary" href="/admin">
            Go to Admin Setup
          </Button>
          <Button variant="outline-secondary" href="/upload/test123">
            Simulate External Upload
          </Button>
        </div>
      </Container>
    </>
  );
}
