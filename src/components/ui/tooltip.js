"use client"

export default function Tooltip({ text, children }) {
  return (
    <div className="relative inline-flex group">
      {children}
      <div
        className="pointer-events-none absolute -top-2 translate-y-[-100%] left-1/2 -translate-x-1/2 z-50 hidden whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-black/10 group-hover:block"
        role="tooltip"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 h-2 w-2 rotate-45 bg-gray-900"></span>
      </div>
    </div>
  )
}


