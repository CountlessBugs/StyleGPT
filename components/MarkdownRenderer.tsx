'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // 自定义标题样式
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-800 dark:text-white" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2 text-gray-800 dark:text-white" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1 text-gray-800 dark:text-white" {...props} />,
          
          // 自定义段落
          p: ({ node, ...props }) => <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed" {...props} />,
          
          // 自定义列表
          ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-3 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-3 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="ml-2" {...props} />,
          
          // 自定义代码块
          code: (props: any) => {
            const { node, inline, ...rest } = props;
            return inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400" {...rest} />
            ) : (
              <code className="block bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-3 overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200" {...rest} />
            );
          },
          
          // 自定义预格式化块
          pre: ({ node, ...props }) => <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-3 overflow-x-auto" {...props} />,
          
          // 自定义引用
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900/30 mb-3 text-gray-700 dark:text-gray-300 italic" {...props} />
          ),
          
          // 自定义表格
          table: ({ node, ...props }) => <table className="w-full border-collapse mb-3 border border-gray-300 dark:border-gray-600" {...props} />,
          thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-700" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          th: ({ node, ...props }) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-bold text-gray-800 dark:text-white" {...props} />,
          td: ({ node, ...props }) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />,
          
          // 自定义链接
          a: ({ node, ...props }) => <a className="text-purple-600 dark:text-purple-400 hover:underline" {...props} />,
          
          // 自定义强调
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-800 dark:text-white" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-700 dark:text-gray-300" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
