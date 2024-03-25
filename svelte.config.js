import adapter from '@sveltejs/adapter-static';

import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
			pages: 'public',
			assets: 'public',
			fallback: 'index.html',
		})
    }
};

export default config;