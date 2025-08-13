//@ts-nocheck
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
   message: {
      role: string;
      content: string;
   };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
   return (
      <div
         className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            message.role === "user"
               ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
               : "bg-gray-100 border border-gray-200"
         }`}
      >
         <ReactMarkdown
            className="prose max-w-none dark:prose-invert"
            remarkPlugins={[remarkGfm]}
            components={{
               code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "";

                  if (!inline && language) {
                     return (
                        <div className="my-2">
                           <SyntaxHighlighter
                              language={language}
                              style={vscDarkPlus}
                              PreTag="div"
                              customStyle={{
                                 borderRadius: "0.5rem",
                                 margin: "0",
                              }}
                              {...props}
                           >
                              {String(children).replace(/\n$/, "")}
                           </SyntaxHighlighter>
                        </div>
                     );
                  }
                  return inline ? (
                     <code
                        className="bg-gray-800/10 rounded px-1 py-0.5"
                        {...props}
                     >
                        {children}
                     </code>
                  ) : (
                     <div className="bg-gray-800/5 rounded-lg p-3 overflow-x-auto">
                        <code {...props}>{children}</code>
                     </div>
                  );
               },
               // Style other markdown elements
               p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
               ),
               ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
               ),
               ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 space-y-1">
                     {children}
                  </ol>
               ),
               li: ({ children }) => <li className="mb-1">{children}</li>,
               h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2">{children}</h1>
               ),
               h2: ({ children }) => (
                  <h2 className="text-lg font-bold mb-2">{children}</h2>
               ),
               h3: ({ children }) => (
                  <h3 className="text-md font-bold mb-2">{children}</h3>
               ),
               a: ({ children, href }) => (
                  <a
                     href={href}
                     className="text-blue-600 hover:underline"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     {children}
                  </a>
               ),
               blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
                     {children}
                  </blockquote>
               ),
            }}
         >
            {message.content}
         </ReactMarkdown>
      </div>
   );
};

export default MessageBubble;
