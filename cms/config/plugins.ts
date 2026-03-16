import type { Core } from "@strapi/strapi";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  mcp: {
    enabled: true,
    config: {
      session: {
        type: "memory",
        max: 20,
        ttlMs: 600000,
        updateAgeOnGet: true,
      },
      allowedIPs: ["127.0.0.1", "::1"],
    },
  },
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME", ""),
        api_key: env("CLOUDINARY_KEY", ""),
        api_secret: env("CLOUDINARY_SECRET", ""),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

export default config;
