import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useGetLpDetail } from '../hooks/useGetLpDetail';
import { useGetLpComments } from '../hooks/useGetLpComments';
import AuthModal from '../components/AuthModal';
import { getHttpErrorMessage } from '../utils/error';
import { getRelativeTime } from '../utils/time';
import { ErrorState, LoadingState } from '../components/AsyncState';
import type { Comment, CommentOrder } from '../types/lp';

function LpCommentItem({ comment }: { comment: Comment }) {
  return (
    <li className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900/70 p-4">
      <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0">
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          comment.author.name[0]?.toUpperCase() ?? '?'
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">{comment.author.name}</span>
          <span className="text-xs text-gray-500 shrink-0">{getRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </li>
  );
}

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const [commentOrder, setCommentOrder] = useState<CommentOrder>('desc');
  const [commentDraft, setCommentDraft] = useState('');
  const commentBottomRef = useRef<HTMLDivElement>(null);
  const lpId = Number(lpid);

  const { data: lp, isPending, isError, error, refetch } = useGetLpDetail(
    accessToken && Number.isFinite(lpId) ? lpId : undefined
  );
  const {
    data: commentData,
    isPending: isCommentsPending,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpComments(accessToken && Number.isFinite(lpId) ? lpId : undefined, commentOrder);
  const comments = commentData?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const target = commentBottomRef.current;
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

  if (!accessToken) {
    return (
      <AuthModal
        onConfirm={() => navigate('/login', { state: { from: `/lp/${lpid}` } })}
        onCancel={() => navigate('/')}
      />
    );
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !lp) {
    const { message, status } = getHttpErrorMessage(error);
    return (
      <ErrorState
        message={message}
        description={status === 404 ? '삭제되었거나 잘못된 주소일 수 있습니다.' : undefined}
        action={status !== 401 && (
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600"
          >
            다시 시도
          </button>
        )}
        secondaryAction={<button
          onClick={() => navigate('/')}
          className="px-5 py-2 border border-gray-600 text-gray-300 rounded-full text-sm hover:bg-gray-800"
        >
          목록으로 돌아가기
        </button>}
      />
    );
  }

  const isOwner = user?.id === lp.authorId;

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-5">
      {/* 저자 + 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
            {lp.author?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-white text-sm font-medium">{lp.author?.name ?? '알 수 없음'}</span>
        </div>
        <span className="text-gray-500 text-sm">{getRelativeTime(lp.createdAt)}</span>
      </div>

      {/* 제목 + 수정/삭제 */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-white">{lp.title}</h1>
        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="수정"
            >
              {/* pencil icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              className="text-red-500 hover:text-red-400 transition-colors"
              aria-label="삭제"
            >
              {/* trash icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 원형 LP 썸네일 */}
      <div className="flex justify-center my-2">
        <div className="w-64 h-64 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 shadow-xl">
          {lp.thumbnail ? (
            <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">🎵</span>
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{lp.content}</p>

      {/* 태그 */}
      {lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-800 text-yellow-400 text-xs rounded-full border border-gray-700"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 좋아요 + 돌아가기 */}
      <div className="flex items-center justify-between pt-2">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 text-white text-sm hover:bg-gray-800 transition-colors">
          <span>♥</span>
          <span>{lp.likes.length}</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-400 text-sm hover:text-white transition-colors"
        >
          돌아가기
        </button>
      </div>

      <section className="mt-4 border-t border-gray-800 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-white mr-auto">댓글</h2>
          <button
            onClick={() => setCommentOrder('desc')}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors
              ${commentOrder === 'desc'
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            최신순
          </button>
          <button
            onClick={() => setCommentOrder('asc')}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors
              ${commentOrder === 'asc'
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            오래된순
          </button>
        </div>

        <form className="mb-5 flex flex-col gap-2" onSubmit={(event) => event.preventDefault()}>
          <div className="flex gap-2">
            <input
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder="댓글을 입력해주세요."
              className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-yellow-500"
            />
            <button
              type="submit"
              disabled={commentDraft.trim().length === 0}
              className="px-4 py-3 rounded-lg bg-yellow-500 text-sm font-semibold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              작성
            </button>
          </div>
          <p className="text-xs text-gray-500">댓글 작성 기능은 UI만 구현되어 있습니다.</p>
        </form>

        {isCommentsError && (() => {
          const { message } = getHttpErrorMessage(commentsError);
          return (
            <ErrorState
              message={message}
              action={
                <button
                  onClick={() => refetchComments()}
                  className="px-5 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600"
                >
                  댓글 다시 시도
                </button>
              }
            />
          );
        })()}

        {isCommentsPending ? (
          <LoadingState variant="commentList" />
        ) : !isCommentsError && comments.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {comments.map((comment) => (
              <LpCommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
        ) : !isCommentsError ? (
          <p className="py-10 text-center text-sm text-gray-500">아직 댓글이 없습니다.</p>
        ) : null}

        {isFetchingNextPage && (
          <div className="mt-4">
            <LoadingState variant="commentList" count={2} />
          </div>
        )}

        {!isCommentsPending && !isCommentsError && comments.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-600">
            {hasNextPage ? '스크롤하면 댓글을 더 불러옵니다.' : '모든 댓글을 불러왔습니다.'}
          </p>
        )}
        <div ref={commentBottomRef} className="h-8" />
      </section>
    </div>
  );
}
