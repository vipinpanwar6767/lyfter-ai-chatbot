import { Plus } from "lucide-react";

function NewChatButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center justify-center gap-2
        rounded-xl
        bg-gradient-to-r from-blue-500 to-cyan-500
        px-4 py-3
        font-semibold text-white
        shadow-lg shadow-cyan-500/10
        transition-all duration-200
        hover:from-blue-600 hover:to-cyan-600
        active:scale-[0.98]
        cursor-pointer
      "
    >
      <Plus size={20} />

      <span>New Chat</span>
    </button>
  );
}

export default NewChatButton;