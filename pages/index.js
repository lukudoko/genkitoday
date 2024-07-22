import { useEffect, useState } from 'react';
import { format } from 'date-fns';


export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/fetchNews');
        const data = await response.json();
        setNews(data.news || []);  // Ensure `data.news` is an array
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }
    }

    fetchData();
  }, []);

  return (
    <>
    <div className='bg-stone-100 min-h-dvh'>
     <div className='fixed top-0 flex items-center justify-center w-full h-fit backdrop-blur-md bg-teal-400/70'>
     <h1 className='text-5xl p-4 text-white font-yellow'>Genki Today!</h1>
     </div>
      {news.length === 0 ? (
        <p>No news found</p>
      ) : (
        <div id="post" class="flex justify-center">
        <div id="stuff" className='flex flex-col items-center justify-center gap-4 prose pt-24'>

          {news.map((item, index) => {
            const pubDate = new Date(item.isoDate || item.pubDate);
            const formattedDate = format(pubDate, 'yyyy-MM-dd HH:mm:ss');  // Format the date as needed

            return (
              <div id="newsitem" className='w-11/12 md:w-full px-4 py-2 rounded-xl bg-white' key={index}>
                <div id="head" className='py-2'>
                <a class="no-underline hover:underline" href={item.link} target="_blank" >
                <div className='font-sans tracking-tight text-pretty leading-normal text-4xl font-extrabold'>{item.title} </div>
                </a>
                </div>
                <div className='font-sans'>
                <small className='font-light'>{item.source} - Sentiment Score: {item.sentimentScore}, {item.sentimentLabel}</small>
                
                <p class="line-clamp-3">{item.contentSnippet}</p>
                <p><strong>Published at:</strong> {formattedDate}</p>  {/* Display formatted date */}
             </div>
                </div>
            );
          })}
  
        </div>
        </div>
      )}
    </div>
    </>
  );
}
