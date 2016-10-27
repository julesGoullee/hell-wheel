export default {
  'ENV': process.env.NODE_ENV || 'development',
  'API_ADDR': `//${process.env.API_ADDR}`,
  'API_PORT': process.env.PORT || 3000,
  'LINK_ADDR': process.env.LINK_ADDR || document.location.host,
};
