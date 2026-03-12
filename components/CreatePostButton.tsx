// components/CreatePostButton.tsx
interface CreatePostButtonProps {
  onClick: () => void;
}

export default function CreatePostButton({ onClick }: CreatePostButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full card-md mb-8 flex items-center gap-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-warm-400 group"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warm-100 group-hover:bg-warm-200 transition-colors">
        <span className="text-2xl">✨</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-gray-900">Share your thoughts</p>
        <p className="text-sm text-gray-500">What's on your mind?</p>
      </div>
      <span className="text-2xl text-warm-400">→</span>
    </button>
  );
}
