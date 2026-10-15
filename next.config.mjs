/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/aboutus",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/our-team",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/all-events",
        destination: "/events",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

