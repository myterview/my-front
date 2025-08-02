import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export function MDViewer({ children }: { children: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
