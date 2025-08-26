import { format } from 'date-fns';
import Image from 'next/image'

const Card = ({ article }) => {
  const formattedDate = format(article.publishedAt, 'MMMM dd, yyyy h:mm a');
  
  return (
    <div className="border overflow-hidden border-teal-400 z-0 rounded-3xl bg-white h-fit shadow-[5px_5px_0px_0px_rgba(45,212,191)] transform transition-transform duration-200 ease-in-out group hover:scale-[1.016]">
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
        {article.imageUrls.length > 0 && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
            <Image
              src={article.imageUrls[0]}
              alt={article.title || "News Image"}
              placeholder="blur"
              quality={100}
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPUvbK/HgAFNwJBbElZhQAAAABJRU5ErkJggg=="
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-b-3xl object-cover"
            />
          </div>
        )}

        <div className="p-4">
          <div className="text-pretty text-left text-2xl lg:text-3xl font-extrabold group-hover:underline">
            {article.title}
          </div>
          <div className="text-xs pt-2 font-thin">
            {article.source} | {formattedDate}
          </div>

          <hr className="border-t border-neutral-600 my-1" />

          <div className="line-clamp-4 text-justify pt-3 h-fit font-medium text-sm">
            {article.contentSnippet}
          </div>
        </div>
      </a>
    </div>
  );
};

export default Card;