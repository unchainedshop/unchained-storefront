import { useRouter } from 'next/router';
import useUser from './useUser';
import { useEffect } from 'react';

const useRouteProtection = (type: String | null, target = '/') => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    const redirect = type
      ? !user?.roles?.find((r) => r.includes(type)) &&
        !user?.roles?.includes('admin')
      : !user || user?.isGuest;
    if (redirect) {
      router.push(target);
    }
  }, [user, loading, router, type, target]);
};

export default useRouteProtection;
