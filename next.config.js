const { register } = require('module');

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true, 
	skipWaiting: true
})

module.exports = withPWA({
	crossOrigin: 'anonymous',
	// eslint: {
	// 	// Warning: This allows production builds to successfully complete even if
	// 	// your project has ESLint errors.
	// 	ignoreDuringBuilds: true,
	// },
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
