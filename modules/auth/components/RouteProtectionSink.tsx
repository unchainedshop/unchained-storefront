import useRouteProtection from '../hooks/useRouteProtection';

const RouteProtectionSink = ({
  role,
  target,
}: {
  role?: string;
  target?: string;
}) => {
  useRouteProtection(role, target);
  return null;
};

export default RouteProtectionSink;
