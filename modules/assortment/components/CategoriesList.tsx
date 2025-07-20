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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-0 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {tree?.navigationTitle}
      </h3>

      {tree?.children && (
        <div className="space-y-2">
          {Object.entries(tree?.children).map(([, { texts, _id }]) => (
            <Link
              key={_id}
              href={`${currentPath}/${texts.slug}`}
              className="block p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full flex-shrink-0" />
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
