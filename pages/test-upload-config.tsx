import { useEffect } from 'react';

export default function TestUploaderConfig() {
  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/uploader-configs/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: 'dam-fashion',
          apiKey: '848884815566778',
          apiSecret: 'fGmskB4IgoWyhHcAiot2z_fVn0Q',
          folder: 'team-a',
          fields: [
            { external_id: 'project', required: true },
            { external_id: 'notes', required: false },
          ],
        }),
      });

      const data = await res.json();
      console.log('Uploader config response:', data);
      alert(`Generated ID: ${data.id || 'none'}`);
    };

    run();
  }, []);

  return <h1>Testing uploader config API...</h1>;
}
