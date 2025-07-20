import { useMutation, gql } from '@apollo/client';
import { USER_QUERY } from '../../auth/hooks/useUser';

const RemoveBookmarkMutation = gql`
  mutation RemoveBookmark($bookmarkId: ID!) {
    removeBookmark(bookmarkId: $bookmarkId) {
      _id
    }
  }
`;

const useRemoveBookmark = () => {
  const [removeBookmarkMutation] = useMutation(RemoveBookmarkMutation, {
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
