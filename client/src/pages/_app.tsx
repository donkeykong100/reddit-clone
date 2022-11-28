import "../styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { AuthProvider } from "../context/auth";

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  axios.defaults.withCredentials = true;
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
