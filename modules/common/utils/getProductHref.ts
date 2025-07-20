const getProductHref = (slug?: string) => (slug ? `/product/${slug}` : '#');

export default getProductHref;
