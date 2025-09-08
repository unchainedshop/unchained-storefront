import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { USER_QUERY } from '../../auth/hooks/useUser';

const RemoveBookmarkMutation = gql`
  mutation RemoveBookmark($bookmarkId: ID!) {
    removeBookmark(bookmarkId: $bookmarkId) {
      _id
    }
  }
`;

const useRemoveBookmark = () => {
  const [removeBookmarkMutation] = useMutation<any>(RemoveBookmarkMutation, {
    refetchQueries: [{ query: USER_QUERY }],
    awaitRefetchQueries: true,
  });

  const removeBookmark = async ({ bookmarkId }) => {
    await removeBookmarkMutation({ variables: { bookmarkId } });
  };

  return {
    removeBookmark,
  };
};

export default useRemoveBookmark;
