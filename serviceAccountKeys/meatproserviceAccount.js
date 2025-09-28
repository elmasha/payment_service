require('dotenv').config(); // Load .env variables

const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID3,
  private_key_id: process.env.PRIVATE_KEY_ID3,
  private_key: process.env.PRIVATE_KEY3.replace(/\\n/g, '\n'), // <-- fixes formatting
  client_email: process.env.CLIENT_EMAIL3,
  client_id: process.env.CLIENT_ID3,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL3,
  universe_domain: "googleapis.com"
};

module.exports = serviceAccount;