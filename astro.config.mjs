import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

const codespace = process.env.CODESPACE_NAME;
const forwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
const forwardedHost = codespace && forwardingDomain
  ? `${codespace}-4321.${forwardingDomain}`
  : undefined;

export default defineConfig({
  output: 'static',
  server: { host: '0.0.0.0', port: 4321 },
  vite: {
    plugins: [tailwind()],
    server: {
      strictPort: true,
      allowedHosts: forwardedHost ? [forwardedHost] : [],
    },
  },
});
