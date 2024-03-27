import Link from 'next/link';

const collectionNames = ['news', 'researches', 'members'];

const Page = async () => {
  return (
    <div className="grid grid-cols-3 gap-3 p-5">
      {collectionNames.map((colName) => (
        <Link
          className={`card aspect-square flex items-center justify-center bg-gray-400 hover:bg-gray-600`}
          key={colName}
          href={`/admin/${colName}`}
        >
          <div className="text-xl text-white">
            {colName.charAt(0).toUpperCase()}
            {colName.slice(1)}を編集
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Page;
