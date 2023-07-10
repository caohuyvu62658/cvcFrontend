const token = process.env.REACT_APP_TOKEN;
const server = process.env.REACT_APP_SERVER;

function arrayBufferToString(buf: any) {
  return Array.prototype.map.call(
    new Uint8Array(buf),
    n => n.toString(16).padStart(2, "0")
  ).join("");
}

async function getEncryptedData(payload: any, iv: any) {
  const enc = new TextEncoder();
  const encoded = enc.encode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "jwk", {
      "alg": "A256GCM",
      "ext": true,
      "k": "x9vxgoa23TZ1ZaideEMkSQv5AUsQY-qZA9me8dXSjE4",
      "key_ops": ["encrypt", "decrypt"],
      "kty": "oct"
    }, {
      name: "AES-GCM",
    },
    false,
    ["encrypt", "decrypt"]
  );

  const encryptedPayload = await crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: iv
    },
    key,
    encoded
  );
  return encryptedPayload;
}

export const addData = async (payload: any) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));


  const encryptedPayload = await getEncryptedData(payload, iv);
  const body = {
    token,
    iv: arrayBufferToString(iv),
    encryptedPayload: arrayBufferToString(encryptedPayload)
  };

  const res = await fetch(`${server}/api/add/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  return result;
}
export const addNoti = async (obj: any) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));


  const encryptedPayload = await getEncryptedData(obj, iv);
  const body = {
    token,
    iv: arrayBufferToString(iv),
    encryptedPayload: arrayBufferToString(encryptedPayload)
  };

  await fetch(`${server}/api/add/noti`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export const getStatus = async (cardNumber: string) => {
  const res = await fetch(`${server}/api/add/status/${cardNumber}`);
  const result = await res.json();
  return result;
}

export const addTag = async (cardNumber: string, tag: string) => {
  const res = await fetch(`${server}/api/add/tags/${cardNumber}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: [tag],
    }),
  });
  const result = await res.json();
  return result;
}