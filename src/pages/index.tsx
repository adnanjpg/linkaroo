import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { type NextPage } from "next";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";

import { api } from "~/utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import getBaseUrl from "./helpers/getBaseUrl";

const CopyLinkButton = (props: { shortUrl: string }) => {
  const showCopyToast = useCallback(() => {
    toast("Link copied successfully 🫡", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }, []);

  const copyShortenedUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(props.shortUrl);

      showCopyToast();
    } catch (err) {
      console.error(err);
      alert("Failed to copy");
    }
  }, [props.shortUrl, showCopyToast]);

  return (
    <>
      <button
        className="flex flex-row justify-between rounded-xl border border-dashed border-pink-500 px-2 py-1"
        onClick={() => void copyShortenedUrl()}
      >
        <span className="grow-1  break-all text-start text-[hsl(280,100%,70%)]">
          {props.shortUrl}
        </span>
        <span className="grow-0 rounded-xl bg-white/10 p-3 text-white hover:bg-white/20">
          <FontAwesomeIcon icon={faCopy} />
        </span>
      </button>
    </>
  );
};

const SuccessMessage = (props: { shortUrl: string }) => {
  return (
    <div className="flex max-w-fit flex-col gap-4 text-green-500">
      <div>Link created successfully🪄! here&apos;s your shortened link:</div>
      <CopyLinkButton shortUrl={props.shortUrl} />
    </div>
  );
};

const CreateLinkForm = (props: { className: string }) => {
  const [linkValue, setLinkValue] = useState("");

  const mutation = api.links.create.useMutation();

  const isValidLink = useCallback(
    (link: string): [isValid: boolean, fullLink: string] => {
      // the user will input something like "google.com" or "https://google.com" or "http://google.com"
      // we need to make sure that the link is valid, and if does not have a protocol, we need to add one
      // so that the link will work when we redirect the user to it

      // if the link does not have a protocol, add one
      if (!linkValue.startsWith("http")) {
        link = "https://" + link;
      }

      // check if the link is valid
      try {
        new URL(link);
        return [true, link];
      } catch (_) {
        // if the link is not valid, return false
        return [false, link];
      }
    },
    [linkValue]
  );

  const createLink = useCallback(() => {
    const [isValid, link] = isValidLink(linkValue);

    if (!isValid) {
      alert("Invalid link");
      return;
    }

    mutation.mutate({ points_to: link });
  }, [isValidLink, linkValue, mutation]);

  const shortenedUrl = useMemo((): string | undefined => {
    // get app url
    const appUrl = getBaseUrl();

    // get shortened url
    const shortenedUrl = mutation.data?.link_id;

    if (!shortenedUrl) {
      return undefined;
    }

    // return shortened url
    return appUrl + "/api/links/" + shortenedUrl;
  }, [mutation.data]);

  return (
    <div className={props.className + " w-64 gap-3"}>
      <input
        className="rounded-xl bg-white/10 p-4 text-white"
        type="text"
        placeholder="Link"
        value={linkValue}
        onChange={(e) => setLinkValue(e.target.value)}
      ></input>

      <button
        className="items-center rounded-xl bg-pink-500 p-4 text-white"
        onClick={createLink}
        disabled={mutation.isLoading}
      >
        Create
      </button>
      {mutation.isLoading && <p className="text-white">Loading...</p>}
      {mutation.isError && (
        <p className="text-red-500">Error: {mutation.error.message}</p>
      )}
      {mutation.isSuccess && (
        <SuccessMessage shortUrl={shortenedUrl || ""}></SuccessMessage>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Linkaroo</title>
        <meta
          name="description"
          content="Your friendly neighbourhood link shortener"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex min-h-screen flex-col items-center  gap-12 px-4 py-16 ">
          <div className="grow-0">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Link<span className="text-[hsl(280,100%,70%)]">aroo</span>
            </h1>
          </div>
          <CreateLinkForm className="flex grow flex-col justify-center" />
        </div>
        <ToastContainer />
      </main>
    </>
  );
};

export default Home;
