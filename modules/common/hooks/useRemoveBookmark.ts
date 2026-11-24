import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { USER_QUERY } from '../../auth/hooks/useUser';
import type * as GQL from '../../apollo/generated';

const RemoveBookmarkMutation = gql`
  mutation RemoveBookmark($bookmarkId: ID!) {
    removeBookmark(bookmarkId: $bookmarkId) {
      _id
    }
  }
`;

const useRemoveBookmark = () => {
  const [removeBookmarkMutation] = useMutation<GQL.RemoveBookmarkMutation, GQL.RemoveBookmarkMutationVariables>(RemoveBookmarkMutation, {
    refetchQueries: [{ query: USER_QUERY }],
  });

  const removeBookmark = async ({ bookmarkId }) => {
    await removeBookmarkMutation({ variables: { bookmarkId } });
  };

  return {
    removeBookmark,
  };
};

export default useRemoveBookmark;
