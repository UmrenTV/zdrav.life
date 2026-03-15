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
});

export default config;
