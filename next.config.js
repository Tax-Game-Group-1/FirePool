/** @type {import('next').NextConfig} */
// import withPWA from 'next-pwa'
const withPWA = require('next-pwa')({
	dest: 'public',
})

module.exports = withPWA({
	crossOrigin: 'anonymous',
	skipWaiting: false,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	  },
	reactStrictMode: true,
});

// export default nextConfig;
