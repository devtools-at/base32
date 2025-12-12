/**
 * Base32 Encoder/Decoder
 * Encode and decode Base32 strings
 *
 * Online tool: https://devtools.at/tools/base32
 *
 * @packageDocumentation
 */

function encodeBase32(input: string, useHex: boolean = false): string {
  const alphabet = useHex ? BASE32HEX_ALPHABET : BASE32_ALPHABET;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  let bits = "";
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, "0");
  }

  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, "0");
    const value = parseInt(chunk, 2);
    result += alphabet[value];
  }

  // Add padding
  while (result.length % 8 !== 0) {
    result += "=";
  }

  return result;
}

function decodeBase32(input: string, useHex: boolean = false): string {
  const alphabet = useHex ? BASE32HEX_ALPHABET : BASE32_ALPHABET;

  // Remove whitespace and convert to uppercase
  const cleanInput = input.replace(/\s/g, "").toUpperCase();

  // Remove padding
  const withoutPadding = cleanInput.replace(/=+$/, "");

  // Validate characters
  const validChars = new Set(alphabet.split(""));
  for (const char of withoutPadding) {
    if (!validChars.has(char)) {
      throw new Error(`Invalid Base32 character: ${char}`);
    }
  }

  // Convert to bits
  let bits = "";
  for (const char of withoutPadding) {
    const value = alphabet.indexOf(char);
    bits += value.toString(2).padStart(5, "0");
  }

  // Remove padding bits
  const extraBits = bits.length % 8;
  if (extraBits !== 0) {
    bits = bits.slice(0, -extraBits);
  }

  // Convert bits to bytes
  const bytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  }

  const decoder = new TextDecoder("utf-8", { fatal: true });
  return decoder.decode(bytes);
}

// Export for convenience
export default { encode, decode };
