'use client';

import styles from './GuideArticle.module.css';

interface GuideArticleProps {
  markdown: string;
}

/**
 * Renders markdown content as styled HTML.
 * Uses a simple regex-based parser for the mock data.
 * In production, you'd use a library like react-markdown.
 */
export function GuideArticle({ markdown }: GuideArticleProps) {
  // Simple markdown → HTML conversion
  const html = markdownToHtml(markdown);

  return (
    <article
      className={styles.article}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function markdownToHtml(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>');

  // Tables (basic)
  html = html.replace(/^\|(.+)\|$/gim, (match) => {
    const cells = match.split('|').filter((c) => c.trim());
    if (cells.every((c) => c.trim().match(/^[-:]+$/))) return ''; // separator row
    const tag = 'td';
    const row = cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join('');
    return `<tr>${row}</tr>`;
  });
  html = html.replace(/(<tr>.*<\/tr>\n?)+/gim, '<table>$&</table>');

  // Line breaks
  html = html.replace(/\n\n/gim, '</p><p>');
  html = html.replace(/\n/gim, '<br/>');

  // Wrap in paragraph
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><(h[1-6]|ul|ol|table|blockquote)/g, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|table|blockquote)><\/p>/g, '</$1>');

  return html;
}
