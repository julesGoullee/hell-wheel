export default {
  'ENV': process.env.NODE_ENV,
  'API_HOST': `//${process.env.API_HOST}`,
  'LINK_HOST': process.env.LINK_HOST || document.location.host,
};
