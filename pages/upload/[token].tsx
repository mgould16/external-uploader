import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';

export default function UploadPage() {
  const { token } = useRouter().query;

  return (
    <Container className="py-5">
      <h1>External Upload Interface</h1>
      <p>Uploader page loaded for token: <strong>{token}</strong></p>
    </Container>
  );
}