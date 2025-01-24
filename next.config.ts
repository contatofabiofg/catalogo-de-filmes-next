import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    domains: ['br.web.img2.acsta.net','br.web.img3.acsta.net', 'cdn.britannica.com', 'cinema10.com.br','assets.cinebelasartes.com.br', 'm.media-amazon.com'],
  },
};

export default nextConfig;
