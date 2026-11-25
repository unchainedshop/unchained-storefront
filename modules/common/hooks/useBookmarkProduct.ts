import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { USER_QUERY } from '../../auth/hooks/useUser';
import type * as GQL from '../../apollo/generated';

const AddBookmarkMutation = gql`
  mutation Bookmark($productId: ID!) {
    bookmark(productId: $productId) {
      _id
    }
  }
`;

const useBookmarkProduct = () => {
  const [bookmarkProductMutation] = useMutation<GQL.BookmarkMutation, GQL.BookmarkMutationVariables>(AddBookmarkMutation, {
    refetchQueries: [{ query: USER_QUERY }],
  });

  const bookmarkProduct = async ({ productId }) => {
    await bookmarkProductMutation({ variables: { productId } });
  };

  return {
    bookmarkProduct,
  };
};

export default useBookmarkProduct;
