const crypto = require('crypto');

const hashIp = (ip) => {
  const salt = process.env.IP_SALT || 'default-ip-salt';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
};

module.exports = hashIp;
