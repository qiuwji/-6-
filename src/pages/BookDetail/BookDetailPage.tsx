import { useState, useEffect } from "react";
import BookOverview from "./component/BookOverview";
import BookDetailTabs from "./component/BookDetailTabs";
import { useParams } from "react-router-dom";

interface BookDetailPageProps {
  bookId?: number;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ bookId }) => {
  const params = useParams<{ id: string }>();
  const actualBookId = bookId || (params?.id ? parseInt(params.id) : 1);
  
  const [bookData, setBookData] = useState({
    id: actualBookId,
    bookName: "JavaScript高级程序设计（第4版）",
    book_cover: "https://img.zxhsd.com/book/cover/2023/01/15/123456.jpg",
    author: "马特·弗里斯比",
    publisher: "人民邮电出版社",
    ISBN: "9787115596012",
    price: 128.00,
    discount_rate: 0.75,
    comment_count: 2568,
    total_score: 11556,
    stock: 342,
    publish_time: "2023-06-01",
    category: "计算机/编程/JavaScript",
    isFavorited: false,
  });

  useEffect(() => {
    const fetchBookData = async (id: number) => {
      const mockBooks = {
        1: {
          id: 1,
          bookName: "JavaScript高级程序设计（第4版）",
          book_cover: "https://img.zxhsd.com/book/cover/2023/01/15/123456.jpg",
          author: "马特·弗里斯比",
          publisher: "人民邮电出版社",
          ISBN: "9787115596012",
          price: 128.00,
          discount_rate: 0.75,
          comment_count: 2568,
          total_score: 11556,
          stock: 342,
          publish_time: "2023-06-01",
          category: "计算机/编程/JavaScript",
          isFavorited: false,
        },
        2: {
          id: 2,
          bookName: "React设计原理",
          book_cover: "https://img.zxhsd.com/book/cover/2023/02/15/234567.jpg",
          author: "卡颂",
          publisher: "机械工业出版社",
          ISBN: "9787111678928",
          price: 89.00,
          discount_rate: 0.85,
          comment_count: 1245,
          total_score: 5602,
          stock: 156,
          publish_time: "2023-03-15",
          category: "计算机/前端开发/React",
          isFavorited: true,
        },
        3: {
          id: 3,
          bookName: "深入理解TypeScript",
          book_cover: "https://img.zxhsd.com/book/cover/2023/03/20/345678.jpg",
          author: "Basarat Ali Syed",
          publisher: "电子工业出版社",
          ISBN: "9787121416978",
          price: 99.00,
          discount_rate: 0.9,
          comment_count: 892,
          total_score: 4014,
          stock: 210,
          publish_time: "2023-04-10",
          category: "计算机/编程/TypeScript",
          isFavorited: false,
        }
      };

      const book = mockBooks[id as keyof typeof mockBooks] || mockBooks[1];
      setBookData(book);
    };

    fetchBookData(actualBookId);
  }, [actualBookId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 这里也可以统一控制间距，但我已经将宽度控制移到了BookOverview内部 */}
      <div className="py-6 space-y-6">
        <BookOverview
          bookName={bookData.bookName}
          book_cover={bookData.book_cover}
          author={bookData.author}
          publisher={bookData.publisher}
          ISBN={bookData.ISBN}
          price={bookData.price}
          discount_rate={bookData.discount_rate}
          comment_count={bookData.comment_count}
          total_score={bookData.total_score}
          stock={bookData.stock}
          publish_time={bookData.publish_time}
          category={bookData.category}
          isFavorited={bookData.isFavorited}
        />
        
        <BookDetailTabs bookId={actualBookId} />
      </div>
    </div>
  );
};

export default BookDetailPage;