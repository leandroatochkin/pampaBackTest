export async function appendTradeOperation(drive, fileId, operationText) {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );

  let existing = '';
  for await (const chunk of response.data) {
    existing += chunk.toString();
  }

  const updated = existing + '\n' + operationText;

  await drive.files.update({
    fileId,
    media: {
      mimeType: 'text/plain',
      body: updated
    }
  });
}
