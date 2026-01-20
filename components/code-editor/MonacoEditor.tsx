'use client';

import { Editor } from '@monaco-editor/react';

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  theme?: 'vs-dark' | 'light';
  height?: string;
}

export default function MonacoEditor({
  language,
  value,
  onChange,
  theme = 'vs-dark',
  height = '400px'
}: MonacoEditorProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
