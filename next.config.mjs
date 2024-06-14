/** @type {import('next').NextConfig} */
const nextConfig = {
  //deepl中转翻译不支持静态输出
  //output: "export",

  async redirects() {
    return [
      {
        source: "/sublabel-translator",
        destination: "/subtitle-translator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
