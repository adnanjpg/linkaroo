import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
config.autoAddCss = false;

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
