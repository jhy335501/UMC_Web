import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLpListInfinite } from '../hooks/useGetLpListInfinite';
import { useDebounce } from '../hooks/useDebounce';
import LpCard from '../components/LpCard';
import type { LpOrder } from '../types/lp';
import { getHttpErrorMessage } from '../utils/error';
import { ErrorState, LoadingState } from '../components/AsyncState';

export default function LpListPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<LpOrder>('desc');
  const [searchInput, setSearchInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchInput, 300);
  const trimmedQuery = debouncedQuery.trim();
  const queryEnabled = debouncedQuery === '' || trimmedQuery.length > 0;

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpListInfinite({ order, search: trimmedQuery, enabled: queryEnabled });

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  // 하단 sentinel이 보이면 다음 페이지를 불러온다.
  // 중복 호출은 react-query의 hasNextPage / isFetchingNextPage 가드로 막는다.
  useEffect(() => {
    const target = bottomRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '160px 0px', threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-6">
      {/* 헤더 행 */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h1 className="text-xl font-bold text-white mr-auto">LP 목록</h1>
        <button
          onClick={() => setOrder('desc')}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors
            ${order === 'desc'
              ? 'bg-yellow-500 text-white border-yellow-500'
              : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder('asc')}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors
            ${order === 'asc'
              ? 'bg-yellow-500 text-white border-yellow-500'
              : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
        >
          오래된순
        </button>
      </div>

      {/* 검색 바 */}
      <div className="flex gap-2 mb-6">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="LP 제목 검색..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-yellow-500"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="px-4 py-2 rounded-full border border-gray-600 text-gray-400 text-sm hover:border-gray-400"
          >
            초기화
          </button>
        )}
      </div>

      {isError && (() => {
        const { message, status } = getHttpErrorMessage(error);
        return (
          <ErrorState
            message={message}
            action={status === 401 ? (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600"
              >
                로그인하러 가기
              </button>
            ) : (
              <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600"
              >
                다시 시도
              </button>
            )}
          />
        );
      })()}

      {isPending ? (
        <LoadingState variant="skeletonGrid" />
      ) : !isError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-4">
          <LoadingState variant="skeletonGrid" count={6} />
        </div>
      )}

      {/* 빈 목록 */}
      {!isPending && !isError && lps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-lg">
            {trimmedQuery ? `"${trimmedQuery}" 검색 결과가 없습니다.` : '등록된 LP가 없습니다.'}
          </p>
        </div>
      )}

      {!isPending && !isError && lps.length > 0 && (
        <p className="text-center text-gray-600 text-sm mt-6">
          {hasNextPage ? '스크롤하면 더 불러옵니다.' : '모든 LP를 불러왔습니다.'}
        </p>
      )}
      <div ref={bottomRef} className="h-8" />
    </div>
  );
}
