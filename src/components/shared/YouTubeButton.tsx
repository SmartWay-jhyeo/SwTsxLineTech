import Link from "next/link";

export function YouTubeButton() {
  return (
    <Link
      href="https://www.youtube.com/watch?v=6AjdGyD7vjk"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-28 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-40 group"
      aria-label="YouTube 보기"
    >
      <svg
        className="w-7 h-7 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    </Link>
  );
}
