import axios from 'axios';
import { URLSearchParams } from 'url';

const DISCORD_API = 'https://discord.com/api/v10';

export const getDiscordAuthUrl = () => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  
  console.log('Discord Auth URL being generated with:');
  console.log('  Client ID:', clientId);
  console.log('  Redirect URI (raw):', process.env.DISCORD_REDIRECT_URI);
  console.log('  Redirect URI (encoded):', redirectUri);
  
  return `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;
};

export const exchangeCodeForToken = async (code) => {
  try {
    // Discord expects form-encoded data, not JSON
    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID);
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);

    console.log('=== Exchanging Authorization Code for Token ===');
    console.log('Sending to Discord with redirect_uri:', process.env.DISCORD_REDIRECT_URI);

    const response = await axios.post(`${DISCORD_API}/oauth2/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('✅ Token exchange successful!');
    return response.data;
  } catch (error) {
    console.error('❌ Error exchanging code for token:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Discord Error Response:', JSON.stringify(error.response?.data, null, 2));
    console.error('Full Error:', error.message);
    throw error;
  }
};

export const getDiscordUser = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('✅ Discord user fetched:', response.data.username);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Discord user:');
    console.error('Status:', error.response?.status);
    console.error('Discord Error Response:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};
