import { bech32 } from "bech32";

export const convertBech32ToEvm = (bech32Address: string) => {
  const { words } = bech32.decode(bech32Address);
  const evmAddressBytes = Buffer.from(bech32.fromWords(words));
  return `0x${evmAddressBytes.toString("hex")}`;
};

export const convertEvmToBech32 = (evmAddress: string, prefix: string) => {
  const cleanEvmAddress = evmAddress.replace(/^0x/, "");
  const evmAddressBytes = Buffer.from(cleanEvmAddress, "hex");
  const words = bech32.toWords(Uint8Array.from(evmAddressBytes));
  return bech32.encode(prefix, words);
};

export const convertToBothFormats = (address: string, bech32Prefix: string) => {
  if (!address)
    return {
      evmAddress: "",
      bech32Address: "",
    };

  const isEvmAddress = /^0x[0-9a-fA-F]{40}$/.test(address);

  if (isEvmAddress) {
    // Convert EVM to Bech32
    const cleanEvmAddress = address.replace(/^0x/, "");
    const evmAddressBytes = Buffer.from(cleanEvmAddress, "hex");
    const words = bech32.toWords(Uint8Array.from(evmAddressBytes));
    const bech32Address = bech32.encode(bech32Prefix, words);

    return {
      evmAddress: `0x${cleanEvmAddress}`,
      bech32Address,
    };
  } else {
    // Convert Bech32 to EVM
    const { words } = bech32.decode(address);
    const evmAddressBytes = Buffer.from(bech32.fromWords(words));
    const evmAddress = `0x${evmAddressBytes.toString("hex")}`;

    return {
      evmAddress,
      bech32Address: address,
    };
  }
};
