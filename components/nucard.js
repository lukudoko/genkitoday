
 import { format } from 'date-fns';


const Card = ({ article }) => {

    const formattedDate = format(article.publishedAt, 'MMMM dd, yyyy h:mm a');
    return (
      <div className="border rounded-lg p-4 shadow-lg bg-white">
        {article.imageUrls.length > 0 && (
          <img src={article.imageUrls[0]} alt={article.title} className="w-full h-48 object-cover rounded-t-lg" />
        )}
        <h3 className="mt-4 text-xl font-semibold">{article.title}</h3>
        <p className="text-gray-500">{article.source}</p>
        <p className="text-sm text-gray-700">{formattedDate}</p>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline mt-2 inline-block">
          Read More
        </a>
      </div>
    );
  };
  
  export default Card;
  