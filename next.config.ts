import type { NextConfig } from "next";

/* -----------------------------------------------------------------------------
   IMPORTANT: this list MUST mirror siteConfig.pipeline.allowedImageHosts in
   src/site.config.ts. The cron uses that allowlist when DECIDING which RSS
   image URL to write into articles.json. Next.js Image uses THIS list when
   actually rendering at runtime. Keep them in sync.

   Next.js 16 enforces a 50-entry cap on remotePatterns. Keep this list
   under that ceiling.
   ----------------------------------------------------------------------------- */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // --- Unsplash (fallback covers) -------------------------------------
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },

      // --- EdSurge --------------------------------------------------------
      { protocol: "https", hostname: "**.edsurge.com" },
      { protocol: "https", hostname: "edsurge.imgix.net" },
      { protocol: "https", hostname: "**.imgix.net" },

      // --- Hechinger Report (WordPress) -----------------------------------
      { protocol: "https", hostname: "hechingerreport.org" },
      { protocol: "https", hostname: "**.hechingerreport.org" },

      // --- Times Higher Education -----------------------------------------
      { protocol: "https", hostname: "**.timeshighereducation.com" },
      { protocol: "https", hostname: "**.tesglobal.com" },

      // --- Inside Higher Ed -----------------------------------------------
      { protocol: "https", hostname: "**.insidehighered.com" },

      // --- Brookings ------------------------------------------------------
      { protocol: "https", hostname: "**.brookings.edu" },

      // --- MIT Technology Review ------------------------------------------
      { protocol: "https", hostname: "**.technologyreview.com" },
      { protocol: "https", hostname: "wp.technologyreview.com" },

      // --- Forbes ---------------------------------------------------------
      { protocol: "https", hostname: "**.forbes.com" },
      { protocol: "https", hostname: "imageio.forbes.com" },
      { protocol: "https", hostname: "**.forbesimg.com" },

      // --- WordPress-VIP CDN (used by many education publishers) ----------
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.wordpress.com" },
      { protocol: "https", hostname: "**.wpengine.com" },

      // --- Common publisher CDNs ------------------------------------------
      { protocol: "https", hostname: "**.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "**.substackcdn.com" },
      { protocol: "https", hostname: "substackcdn.com" },
      { protocol: "https", hostname: "**.substack.com" },
      { protocol: "https", hostname: "**.ghost.io" },
      { protocol: "https", hostname: "**.ghostcdn.io" },
      { protocol: "https", hostname: "**.cdn.ghost.io" },
      { protocol: "https", hostname: "**.netlify.app" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.vercel-storage.com" },

      // --- Generic CDN providers ------------------------------------------
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.akamaized.net" },
      { protocol: "https", hostname: "**.akamaihd.net" },
      { protocol: "https", hostname: "**.fastly.net" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.twimg.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" }
    ]
  }
};

export default nextConfig;
