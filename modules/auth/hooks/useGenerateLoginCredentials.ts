import useCreateWebAuthnCredentialRequestOptions from './useCreateWebAuthnCredentialRequestOptions';
import { base64urlToBuffer, bufferToBase64url, serializeAuthentication } from '../utils/webauthn';

const useGenerateLoginCredentials = () => {
  const { createWebAuthnCredentialRequestOptions } = useCreateWebAuthnCredentialRequestOptions();

  const generateLoginCredentials = async ({ username }) => {
    const { data } = await createWebAuthnCredentialRequestOptions({ username });
    const options = data?.createWebAuthnCredentialRequestOptions;
    if (!options?.allowCredentials?.length) return null;

    const credential = (await navigator.credentials.get({
      publicKey: {
        ...options,
        challenge: base64urlToBuffer(options.challenge),
        allowCredentials: options.allowCredentials.map(({ id, ...rest }) => ({
          ...rest,
          id: base64urlToBuffer(id),
        })),
      },
    })) as PublicKeyCredential;

    const serialized = serializeAuthentication(credential);
    // Authenticators may omit userHandle when the credential was requested
    // explicitly; the engine identifies the user by it, and registration
    // stored the encoded username as the user id.
    serialized.response.userHandle ??= bufferToBase64url(new TextEncoder().encode(username).buffer);
    return { requestId: options.requestId, ...serialized };
  };

  return { generateLoginCredentials };
};

export default useGenerateLoginCredentials;
