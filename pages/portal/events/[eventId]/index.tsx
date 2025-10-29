'use client';
import { notFound } from 'next/navigation';
import RouteProtectionSink from '../../../../modules/auth/components/RouteProtectionSink';
import EventTokenList from '../../../../modules/products/components/EventTokenList';
import Loading from '../../../../modules/common/components/Loading';
import useEventDetail from '../../../../modules/products/hooks/useEventDetail';
import { useRouter } from 'next/router';

const ProductPage = () => {
  const router = useRouter();
  const { product, loading } = useEventDetail({
    productId: decodeURIComponent(router.query?.eventId as string),
  });

  if (loading) return <Loading />;
  if (!product) {
    notFound();
  }

  return (
    <>
      <RouteProtectionSink role="admin" target={'/login'} />
      <EventTokenList product={product} />
    </>
  );
};

export default ProductPage;
