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
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedFields, setSelectedFields] = useState<
    Record<string, { include: boolean; required: boolean }>
  >({});

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

  const handleGenerateUploader = async () => {
    if (!selectedFolder) {
      alert('Please select a folder.');
      return;
    }

    const selectedFieldList = Object.entries(selectedFields)
      .filter(([, value]) => value.include)
      .map(([external_id, value]) => ({
        external_id,
        required: value.required,
      }));

    const payload = {
      cloudName,
      apiKey,
      apiSecret,
      folder: selectedFolder,
      fields: selectedFieldList,
    };

    try {
      const res = await fetch('/api/uploader-configs/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.id) {
        throw new Error(data.error || 'Failed to create uploader config');
      }

      const link = `${window.location.origin}/upload/${data.id}`;
      console.log('✅ Uploader Config Created:', data);
      alert(`Uploader created! Share this link:\n\n${link}`);
    } catch (err) {
      const error = err as Error;
      console.error('Uploader config failed:', error.message);
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <Container className="py-5">
      <h1>Cloudinary Admin Setup!!!</h1>
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

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {folders.length > 0 && (
        <div className="mt-4">
          <h5>Select Upload Folder</h5>
          <Form.Select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="mb-3"
          >
            <option value="">-- Select a folder --</option>
            {folders.map((f) => (
              <option key={f.path} value={f.path}>
                {f.name}
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      {metadataFields.length > 0 && (
        <div className="mt-4">
          <h5>Select Structured Metadata Fields</h5>
          {metadataFields.map((field) => (
            <Form.Group key={field.external_id} className="mb-2">
              <Form.Check
                type="checkbox"
                id={`include-${field.external_id}`}
                label={`Include "${field.label}" (${field.type})`}
                checked={!!selectedFields[field.external_id]?.include}
                onChange={(e) => {
                  setSelectedFields((prev) => ({
                    ...prev,
                    [field.external_id]: {
                      ...prev[field.external_id],
                      include: e.target.checked,
                    },
                  }));
                }}
              />
              {selectedFields[field.external_id]?.include && (
                <Form.Check
                  type="checkbox"
                  id={`required-${field.external_id}`}
                  label="Required"
                  checked={!!selectedFields[field.external_id]?.required}
                  onChange={(e) => {
                    setSelectedFields((prev) => ({
                      ...prev,
                      [field.external_id]: {
                        ...prev[field.external_id],
                        required: e.target.checked,
                      },
                    }));
                  }}
                  className="ms-4"
                />
              )}
            </Form.Group>
          ))}
        </div>
      )}

      <Button className="mt-4" onClick={handleGenerateUploader}>
        Generate Uploader Config
      </Button>
    </Container>
  );
}
