require('dotenv').config(); // Load .env variables

const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID5,
  private_key_id: process.env.PRIVATE_KEY_ID5,
  private_key: process.env.PRIVATE_KEY5.replace(/\\n/g, '\n'), // <-- fixes formatting
  client_email: process.env.CLIENT_EMAIL5,
  client_id: process.env.CLIENT_ID5,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL5,
  universe_domain: "googleapis.com"
};

module.exports = serviceAccount;