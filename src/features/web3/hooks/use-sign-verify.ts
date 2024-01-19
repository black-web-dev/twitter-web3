import { getSession, signIn, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

export default function useSignVerifyWithCrypto() {
  const { data: session } = useSession();
  const { address } = useAccount();
  const { signMessageAsync, isLoading } = useSignMessage();
  const [isFetchingNonce, setIsFetchingNonce] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSignInWithCrypto = useCallback(
    async ({ redirect }: { redirect: boolean }) => {
      setError("");
      setIsFetchingNonce(true);

      try {
        // Send the public address to generate a nonce associates with our account
        const response = await fetch("/api/users/generateNonce", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session?.user.id || "",
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            evm_address: address,
          }),
        });
        const responseData: any = await response.json();

        // return in case of Invalid user
        if (response.status === 402) {
          setIsFetchingNonce(false);

          return setError(responseData);
        }

        // Sign the received nonce
        const message = new SiweMessage({
          domain: window.location.host,
          uri: window.location.origin,
          version: "1",
          address: `${address}`,
          nonce: responseData.nonce,
          chainId: 11029,
        });

        const signedNonce = await signMessageAsync({
          message: message.prepareMessage(),
        });

        // Use NextAuth to sign in with our address and the nonce
        await signIn("crypto", {
          message: JSON.stringify(message),
          evm_address: address,
          signedNonce,
          redirect,
          callbackUrl: "/home",
        });

        setIsFetchingNonce(false);
      } catch (error) {
        toast.error("Error with signing, please try again.");

        setIsFetchingNonce(false);
      } finally {
        getSession();
      }
    },
    [
      address,
      session?.user?.email,
      session?.user.id,
      session?.user?.name,
      signMessageAsync,
    ],
  );

  return {
    isFetchingNonce,
    isLoading,
    error,
    onSignInWithCrypto,
  };
}
