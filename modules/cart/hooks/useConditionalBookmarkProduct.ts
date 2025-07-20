import useLoginAsGuestMutation from '../../auth/hooks/useLoginAsGuest';
import useUser from '../../auth/hooks/useUser';
import useBookmarkProduct from '../../common/hooks/useBookmarkProduct';

const useConditionalBookmarkProduct = () => {
  const { loginAsGuest } = useLoginAsGuestMutation();
  const { bookmarkProduct } = useBookmarkProduct();
  const { user } = useUser();

  const conditionalBookmarkProduct = async ({ productId }) => {
    if (!user?._id) {
      await loginAsGuest();
    }
    await bookmarkProduct({ productId });
  };

  return {
    conditionalBookmarkProduct,
  };
};

export default useConditionalBookmarkProduct;
