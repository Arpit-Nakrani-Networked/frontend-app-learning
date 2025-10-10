let env: 'lab' | 'qa' | 'prod' = 'qa'; // default QA

if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  if (host.includes('lab')) { env = 'lab'; } else if (host.includes('qa')) { env = 'qa'; } else { env = 'prod'; }
}

const FRONTEND_URLS = {
  lab: 'https://app.lab.networked.co',
  qa: 'https://app.qa.networked.co',
  prod: 'https://app.networked.co',
};

const BACKEND_URLS = {
  lab: 'https://backend.lab.networked.co',
  qa: 'https://backend.qa.networked.co',
  prod: 'https://backend.networked.co',
};

export const NETWORKED_FRONTEND_URL = FRONTEND_URLS[env];
export const NETWORKED_BACKEND_URL = BACKEND_URLS[env];
