import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const Web3AddressFields = gql`
  fragment Web3AddressFields on User {
    _id
    web3Addresses {
      address
      nonce
      verified
    }
  }
`;

const UserWeb3AddressesQuery = gql`
  query UserWeb3Addresses {
    me {
      ...Web3AddressFields
    }
  }
  ${Web3AddressFields}
`;

const AddWeb3AddressMutation = gql`
  mutation AddWeb3Address($address: String!) {
    addWeb3Address(address: $address) {
      ...Web3AddressFields
    }
  }
  ${Web3AddressFields}
`;

const VerifyWeb3AddressMutation = gql`
  mutation VerifyWeb3Address($address: String!, $hash: String!) {
    verifyWeb3Address(address: $address, hash: $hash) {
      ...Web3AddressFields
    }
  }
  ${Web3AddressFields}
`;

const RemoveWeb3AddressMutation = gql`
  mutation RemoveWeb3Address($address: String!) {
    removeWeb3Address(address: $address) {
      ...Web3AddressFields
    }
  }
  ${Web3AddressFields}
`;

type EthereumProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<any> };
const getEthereum = (): EthereumProvider | null =>
  typeof window !== 'undefined' ? ((window as any).ethereum as EthereumProvider) || null : null;

const useWeb3Addresses = () => {
  const { data, loading } = useQuery<GQL.UserWeb3AddressesQuery, GQL.UserWeb3AddressesQueryVariables>(
    UserWeb3AddressesQuery,
  );
  const [addMutation] = useMutation<GQL.AddWeb3AddressMutation, GQL.AddWeb3AddressMutationVariables>(
    AddWeb3AddressMutation,
  );
  const [verifyMutation] = useMutation<GQL.VerifyWeb3AddressMutation, GQL.VerifyWeb3AddressMutationVariables>(
    VerifyWeb3AddressMutation,
  );
  const [removeMutation] = useMutation<GQL.RemoveWeb3AddressMutation, GQL.RemoveWeb3AddressMutationVariables>(
    RemoveWeb3AddressMutation,
  );

  const addresses = data?.me?.web3Addresses || [];

  // The engine issues a nonce per address; the wallet proves ownership by
  // signing it (personal_sign), which the engine checks with ecrecover.
  const verify = async (address: string, nonce?: string) => {
    const ethereum = getEthereum();
    if (!ethereum) throw new Error('No browser wallet found');
    const message = nonce || addresses.find((entry) => entry.address === address)?.nonce;
    const hash = await ethereum.request({ method: 'personal_sign', params: [message, address] });
    return verifyMutation({ variables: { address, hash } });
  };

  const add = async (address: string) => {
    const { data: added } = await addMutation({ variables: { address } });
    return added?.addWeb3Address?.web3Addresses?.find((entry) => entry.address.toLowerCase() === address.toLowerCase());
  };

  return {
    addresses,
    loading,
    hasWallet: Boolean(getEthereum()),
    add,
    verify,
    remove: (address: string) => removeMutation({ variables: { address } }),
    connectWallet: async () => {
      const [address] = await getEthereum().request({ method: 'eth_requestAccounts' });
      const entry = await add(address);
      if (entry && !entry.verified) await verify(entry.address, entry.nonce);
    },
  };
};

export default useWeb3Addresses;
