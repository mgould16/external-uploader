import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Form, Button } from 'react-bootstrap';

type Field = {
  external_id: string;
  required: boolean;
};

type Config = {
  folder: string;
  fields: Field[];
};

export default function UploaderPage() {
  const { query } = useRouter();
  const token = query.token as string;

  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/uploader-configs/${token}`);
        if (!res.ok) throw new Error('Invalid or expired uploader link');
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    alert('Upload logic goes here!');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading uploader...</p>
      </Container>
    );
  }

  if (error || !config) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Error: {error || 'Config not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1>Upload to: <code>{config.folder}</code></h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Asset</Form.Label>
          <Form.Control type="file" name="asset" required />
        </Form.Group>

        {config.fields.map((field) => (
          <Form.Group className="mb-3" key={field.external_id}>
            <Form.Label>
              {field.external_id} {field.required && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              name={field.external_id}
              required={field.required}
              placeholder={`Enter ${field.external_id}`}
            />
          </Form.Group>
        ))}

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Uploading...' : 'Upload'}
        </Button>
      </Form>
    </Container>
  );
}
