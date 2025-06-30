export default function QueueList({ title, list, onSelect, selectable }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow w-full">
      <h3 className="text-2xl font-semibold text-[#32418C] mb-2">{title}</h3>
      <ul className="space-y-2">
        {/* {list.length === 0 && (
          <li className="text-gray-400 text-center">No queue</li>
        )} */}
        {list.map((num) => (
          <li key={num}>
            {selectable ? (
              <button
                className="text-xl w-full text-left px-3 py-2 rounded-lg border border-[#32418C] text-[#32418C] hover:bg-[#32418C] hover:text-white transition"
                onClick={() => onSelect(num)}
              >
                {num}
              </button>
            ) : (
              <span className="text-xl block px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700">
                {num}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
