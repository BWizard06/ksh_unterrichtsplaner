'use client'
import { useState } from 'react';
import { marked } from 'marked';
import 'github-markdown-css';

const MarkdownInput = ({ id }) => {
  const [input, setInput] = useState('');

  const getMarkdownText = () => {
    const rawMarkup = marked(input);
    return {__html: rawMarkup};
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  return (
    <div>
      <textarea
        id={id}
        value={input}
        onChange={handleChange}
        placeholder="Geben Sie hier Ihren Markdown-Text ein..."
        style={{ width: '100%', height: '200px', marginBottom: '20px' }}
      />
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={getMarkdownText()}
        style={{ border: '1px solid #ccc', padding: '10px' }}
      />
    </div>
  );
};

export default MarkdownInput;