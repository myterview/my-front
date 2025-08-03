import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import { ClassValue, neato } from "neato";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export function MDViewer({
  children,
  className,
}: {
  children: string;
  className?: ClassValue;
}) {
  return (
    <div className={neato("markdown-body", className)}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
