import useCreateWebAuthnCredentialCreationOptions from './useCreateWebAuthnCredentialCreationOptions';
import { base64urlToBuffer, serializeRegistration } from '../utils/webauthn';

const useGenerateWebAuthCredentials = () => {
  const { createWebAuthnCredentialCreationOptions } = useCreateWebAuthnCredentialCreationOptions();

  const generateWebAuthCredentials = async ({ username }) => {
    const { data } = await createWebAuthnCredentialCreationOptions({ username });
    const options = data.createWebAuthnCredentialCreationOptions;

    const credential = (await navigator.credentials.create({
      publicKey: {
        ...options,
        challenge: base64urlToBuffer(options.challenge),
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: username,
        },
      },
    })) as PublicKeyCredential;

    return serializeRegistration(credential);
  };

  return { generateWebAuthCredentials };
};

export default useGenerateWebAuthCredentials;
