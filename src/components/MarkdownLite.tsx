import React from 'react';

interface MarkdownLiteProps {
  content: string;
  className?: string;
}

export const MarkdownLite: React.FC<MarkdownLiteProps> = ({ content, className = '' }) => {
  if (!content.trim()) {
    return (
      <p className="text-slate-400 italic text-sm">
        Nothing written yet. Switch to write mode to start typing.
      </p>
    );
  }

  // Parse markdown line by line
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 text-slate-700 dark:text-slate-300">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (text: string): React.ReactNode[] => {
    // Basic inline formatting: **bold**, *italic*, `code`, ~~strike~~
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|~~.*?~~)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-slate-900 dark:text-white">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic">
            {raw.slice(1, -1)}
          </em>
        );
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[13px] font-mono text-indigo-600 dark:text-indigo-400"
          >
            {raw.slice(1, -1)}
          </code>
        );
      } else if (raw.startsWith('~~') && raw.endsWith('~~')) {
        parts.push(
          <span key={match.index} className="line-through text-slate-400">
            {raw.slice(2, -2)}
          </span>
        );
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heading 1 (# ...)
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-xl font-bold mt-4 mb-2 text-slate-900 dark:text-white">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Heading 2 (## ...)
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-lg font-bold mt-3.5 mb-1.5 text-slate-900 dark:text-white">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    // Heading 3 (### ...)
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-base font-semibold mt-3 mb-1 text-slate-900 dark:text-white">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // Blockquote (> ...)
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-indigo-500 pl-3 py-1 my-2 bg-indigo-50/40 dark:bg-indigo-950/20 text-slate-600 dark:text-slate-300 italic rounded-r-md text-sm"
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // List item (- ... or * ...)
    if (line.match(/^[-*]\s+/)) {
      inList = true;
      listItems.push(
        <li key={i} className="text-sm">
          {renderInline(line.replace(/^[-*]\s+/, ''))}
        </li>
      );
      continue;
    }

    // Numbered list (1. ...)
    if (line.match(/^\d+\.\s+/)) {
      flushList();
      elements.push(
        <div key={i} className="flex gap-2 my-1 text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-400">{line.match(/^\d+\./)?.[0]}</span>
          <span>{renderInline(line.replace(/^\d+\.\s+/, ''))}</span>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      flushList();
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={i} className="my-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};
