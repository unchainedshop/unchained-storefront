import Link from 'next/link';

type categoryItem = {
  navigationTitle: string;
  children: [{ texts: any; _id: string }];
};

const CategoriesList = ({
  assortment,
  currentPath = '',
}: {
  assortment: categoryItem[];
  currentPath: string;
}) => {
  const [tree]: categoryItem[] =
    Object.entries(assortment).map(([, assort]) => assort) || [];
  return (
    <div className="bg-surface rounded-xl border border-border dark:border-0 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {tree?.navigationTitle}
      </h3>

      {tree?.children && (
        <div className="space-y-2">
          {Object.entries(tree?.children).map(([, { texts, _id }]) => (
            <Link
              key={_id}
              href={`${currentPath}/${texts.slug}`}
              className="block p-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-muted-strong rounded-full flex-shrink-0" />
                <span className="font-medium">{texts?.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
