import { useMutation } from '@apollo/client/react';
import { LOGIN_AS_GUEST_MUTATION } from './useLoginAsGuest';
import useUser from './useUser';
import type * as GQL from '../../apollo/generated';

// Logs anonymous visitors in as guests so they get a cart. Unlike
// useLoginAsGuest it does not reset the Apollo store: that unmounts the
// current page and aborts its pending refetches. Callers refetch the User
// query after their mutation instead (see refetchQueries below).
const useEnsureUser = () => {
  const { user } = useUser();
  const [loginAsGuestMutation] = useMutation<GQL.LoginAsGuestMutation, GQL.LoginAsGuestMutationVariables>(
    LOGIN_AS_GUEST_MUTATION,
  );

  const ensureUser = async () => {
    if (!user) await loginAsGuestMutation();
  };

  return {
    user,
    ensureUser,
    refetchQueries: user ? [] : ['User'],
  };
};

export default useEnsureUser;
