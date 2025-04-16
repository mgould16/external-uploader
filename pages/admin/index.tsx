import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

interface Folder {
  name: string;
  path: string;
}

interface MetadataField {
  external_id: string;
  label: string;
  type: string;
}

export default function AdminDashboard() {
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [error, setError] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/validate-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setFolders([]);
      setMetadataFields([]);
    } else {
      setFolders(data.folders || []);
      setMetadataFields(data.metadataFields || []);
    }
  };

  return (
    <Container className="py-5">
      <h1>Cloudinary Admin Setup!</h1>
      <p>Enter your Cloudinary credentials to begin configuration.</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cloud Name</Form.Label>
          <Form.Control
            value={cloudName}
            onChange={(e) => setCloudName(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>API Key</Form.Label>
          <Form.Control
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>API Secret</Form.Label>
          <Form.Control
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Validate & Load Folders + Metadata
        </Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {folders.length > 0 && (
        <div className="mt-4">
          <h5>Available Folders</h5>
          <ul>
            {folders.map((f) => (
              <li key={f.path}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      {metadataFields.length > 0 && (
        <div className="mt-5">
          <h5>Structured Metadata Fields</h5>
          <ul>
            {metadataFields.map((field) => (
              <li key={field.external_id}>
                <strong>{field.label}</strong> ({field.type}) – <code>{field.external_id}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
