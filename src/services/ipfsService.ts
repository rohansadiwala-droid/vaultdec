import axios from 'axios';

const RAW_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMGNmNzZkMC1mNTk3LTQzODEtYjAxMi00MTUxNjYyODI4YmEiLCJlbWFpbCI6InJvaGFuc2FkaXdhbGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijk0ZmY5MmU2NzMzMTc3YzNhZjllIiwic2NvcGVkS2V5U2VjcmV0IjoiNWNjNWIwZDMwYWUyNjZkNWNlZDc3NGEwNDdhZmY4NWY5MDQ1MzU0ODI5MDkxOGJmOTExMTBhNjkwM2JhZDQ3ZCIsImV4cCI6MTgwODg5Njg5NX0.rIF6uytN6n7_dAZqWKEnXl-YRLr0ZARDYOv-I6X6mYg";
const PINATA_JWT = RAW_JWT.trim();

/**
 * Uploads a file to Pinata (IPFS)
 */
export async function uploadToIPFS(file: File) {
  if (!PINATA_JWT || PINATA_JWT === "YOUR_PINATA_JWT_HERE" || PINATA_JWT === "") {
    throw new Error('IPFS Config Missing: Please add your Pinata JWT to the Secrets panel.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('IPFS Auth Failed (401/403): Ensure you copied the full "JWT" (the long string) from Pinata.cloud, not the API Key.');
    }
    throw error;
  }
}

export function getIPFSUrl(cid: string) {
  // Using a public gateway for fetching
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
