'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/Icon';

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function WysiwygEditor({
  value,
  onChange,
  placeholder = 'Write your rich article body here...',
  minHeight = '380px',
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value || '');
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Modals for rich insertions
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Sync incoming value to contentEditable if value changed from outside
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setSourceCode(value || '');
  }, [value, isSourceMode]);

  // Save selection before opening insertion dialogs
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelection) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelection);
    }
  };

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  }, [onChange]);

  const exec = (command: string, val: string | undefined = undefined) => {
    if (isSourceMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    emitChange();
  };

  // Format heading
  const handleFormatBlock = (tag: string) => {
    if (isSourceMode) return;
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    emitChange();
  };

  // Insert Inline Code
  const handleInsertInlineCode = () => {
    if (isSourceMode) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selectedText = range.toString() || 'code';
    const codeEl = document.createElement('code');
    codeEl.className = 'dcs-inline-code';
    codeEl.textContent = selectedText;
    range.deleteContents();
    range.insertNode(codeEl);
    range.selectNode(codeEl);
    emitChange();
  };

  // Insert Code Block
  const handleInsertCodeBlock = () => {
    if (isSourceMode) return;
    editorRef.current?.focus();
    const pre = document.createElement('pre');
    pre.className = 'dcs-code-block';
    const code = document.createElement('code');
    code.textContent = '// Enter your code snippet or terminal command here\n';
    pre.appendChild(code);
    insertNodeAtCursor(pre);
  };

  // Helper to insert a DOM node at cursor
  const insertNodeAtCursor = (node: Node) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.appendChild(node);
    } else {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      // Place cursor after inserted element
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    emitChange();
  };

  // Insert Link
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    setLinkText(sel ? sel.toString() : '');
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    const a = document.createElement('a');
    a.href = linkUrl.trim();
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'dcs-article-link';
    a.textContent = linkText.trim() || linkUrl.trim();
    insertNodeAtCursor(a);
    setLinkModalOpen(false);
  };

  // Insert Image (Direct or Cloudinary upload)
  const openImageModal = () => {
    saveSelection();
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setImageModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dcs_pakistan/blog_body');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImageUrl(data.url);
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image to server');
    } finally {
      setUploadingImage(false);
      if (imageUploadRef.current) imageUploadRef.current.value = '';
    }
  };

  const handleApplyImage = () => {
    if (!imageUrl.trim()) return;
    restoreSelection();

    const figure = document.createElement('figure');
    figure.className = 'dcs-article-img-wrap';

    const img = document.createElement('img');
    img.src = imageUrl.trim();
    img.alt = imageAlt.trim() || 'Article illustration';
    img.loading = 'lazy';
    figure.appendChild(img);

    if (imageCaption.trim()) {
      const cap = document.createElement('figcaption');
      cap.className = 'dcs-article-img-caption';
      cap.textContent = imageCaption.trim();
      figure.appendChild(cap);
    }

    insertNodeAtCursor(figure);
    setImageModalOpen(false);
  };

  // Insert Video Embed
  const openVideoModal = () => {
    saveSelection();
    setVideoUrl('');
    setVideoModalOpen(true);
  };

  const handleApplyVideo = () => {
    if (!videoUrl.trim()) return;
    restoreSelection();

    let embedSrc = videoUrl.trim();
    // YouTube short or watch link to embed
    if (embedSrc.includes('youtube.com/watch?v=')) {
      const id = embedSrc.split('v=')[1]?.split('&')[0];
      embedSrc = `https://www.youtube.com/embed/${id}`;
    } else if (embedSrc.includes('youtu.be/')) {
      const id = embedSrc.split('youtu.be/')[1]?.split('?')[0];
      embedSrc = `https://www.youtube.com/embed/${id}`;
    } else if (embedSrc.includes('vimeo.com/')) {
      const id = embedSrc.split('vimeo.com/')[1]?.split('?')[0];
      embedSrc = `https://player.vimeo.com/video/${id}`;
    }

    const wrap = document.createElement('div');
    wrap.className = 'dcs-video-embed-wrap';

    const iframe = document.createElement('iframe');
    iframe.src = embedSrc;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);

    insertNodeAtCursor(wrap);
    setVideoModalOpen(false);
  };

  // Insert Table
  const openTableModal = () => {
    saveSelection();
    setTableModalOpen(true);
  };

  const handleApplyTable = () => {
    restoreSelection();
    const table = document.createElement('table');
    table.className = 'dcs-article-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (let c = 0; c < tableCols; c++) {
      const th = document.createElement('th');
      th.textContent = `Header ${c + 1}`;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let r = 0; r < tableRows - 1; r++) {
      const row = document.createElement('tr');
      for (let c = 0; c < tableCols; c++) {
        const td = document.createElement('td');
        td.textContent = `Cell ${r + 1},${c + 1}`;
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    insertNodeAtCursor(table);
    setTableModalOpen(false);
  };

  // Switch between WYSIWYG & HTML Source Mode
  const toggleSourceMode = () => {
    if (!isSourceMode) {
      if (editorRef.current) {
        setSourceCode(editorRef.current.innerHTML);
      }
      setIsSourceMode(true);
    } else {
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
      }
      onChange(sourceCode);
      setIsSourceMode(false);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setSourceCode(code);
    onChange(code);
  };

  // Word count & Char count
  const rawText = (isSourceMode ? sourceCode : value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const charCount = rawText.length;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="wysiwyg-wrapper">
      {/* Top Format Toolbar */}
      <div className="wysiwyg-toolbar">
        {/* Headings Dropdown */}
        <div className="toolbar-group">
          <select
            className="wysiwyg-select"
            disabled={isSourceMode}
            onChange={(e) => {
              handleFormatBlock(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            title="Heading Level"
          >
            <option value="" disabled>
              Heading...
            </option>
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
          </select>
        </div>

        {/* Text Styles */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('bold')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('italic')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('underline')}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('strikeThrough')}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        {/* Alignment */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('justifyLeft')}
            title="Align Left"
          >
            <span style={{ fontSize: '13px' }}>⬅</span>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('justifyCenter')}
            title="Align Center"
          >
            <span style={{ fontSize: '13px' }}>⬌</span>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('justifyRight')}
            title="Align Right"
          >
            <span style={{ fontSize: '13px' }}>➡</span>
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('insertUnorderedList')}
            title="Bullet List"
          >
            &bull; List
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('insertOrderedList')}
            title="Numbered List"
          >
            1. List
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => handleFormatBlock('blockquote')}
            title="Blockquote"
          >
            &ldquo; Quote
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={handleInsertInlineCode}
            title="Inline Code"
          >
            &lt;code&gt;
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={handleInsertCodeBlock}
            title="Code Block"
          >
            {'{ }'} Block
          </button>
        </div>

        {/* Media & Embeds */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={openLinkModal}
            title="Insert Link"
          >
            🔗 Link
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={openImageModal}
            title="Insert Image (Upload or URL)"
          >
            🖼️ Image
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={openVideoModal}
            title="Embed Video (YouTube / Vimeo)"
          >
            🎬 Video
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={openTableModal}
            title="Insert Table"
          >
            ▦ Table
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('insertHorizontalRule')}
            title="Horizontal Divider"
          >
            &mdash; HR
          </button>
        </div>

        {/* History & Mode Toggle */}
        <div className="toolbar-group" style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('undo')}
            title="Undo (Ctrl+Z)"
          >
            ↺
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('redo')}
            title="Redo (Ctrl+Y)"
          >
            ↻
          </button>
          <button
            type="button"
            className="toolbar-btn"
            disabled={isSourceMode}
            onClick={() => exec('removeFormat')}
            title="Clear Formatting"
          >
            🧹
          </button>
          <button
            type="button"
            className={`toolbar-btn ${isSourceMode ? 'is-active' : ''}`}
            onClick={toggleSourceMode}
            title="Toggle Raw HTML Source View"
            style={{ fontWeight: 700 }}
          >
            {isSourceMode ? '👁️ Visual Mode' : '&lt;/&gt; HTML Source'}
          </button>
        </div>
      </div>

      {/* Main Editing Area */}
      {isSourceMode ? (
        <textarea
          className="wysiwyg-source-area"
          style={{ minHeight }}
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="Edit raw HTML source code here..."
        />
      ) : (
        <div
          ref={editorRef}
          className="wysiwyg-editor-area"
          contentEditable
          suppressContentEditableWarning
          style={{ minHeight }}
          onInput={emitChange}
          onBlur={emitChange}
          data-placeholder={placeholder}
        />
      )}

      {/* Editor Status Bar */}
      <div className="wysiwyg-status-bar">
        <div>
          <span>{wordCount} words</span> &bull; <span>{charCount} characters</span> &bull;{' '}
          <span style={{ color: 'var(--accent-cyan)' }}>Est. ~{estimatedReadingTime} min read</span>
        </div>
        <div>
          {isSourceMode ? (
            <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>Source Mode Active</span>
          ) : (
            <span style={{ color: '#10b981', fontSize: '0.75rem' }}>WYSIWYG Active</span>
          )}
        </div>
      </div>

      {/* ================= MODAL: INSERT LINK ================= */}
      {linkModalOpen && (
        <div className="wysiwyg-modal-overlay">
          <div className="wysiwyg-modal-box">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Insert Hyperlink</h4>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Display Text
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Threat Intelligence Advisory"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Target URL *
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/report"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                onClick={() => setLinkModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '5px 14px', fontSize: '0.82rem' }}
                onClick={handleApplyLink}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSERT IMAGE ================= */}
      {imageModalOpen && (
        <div className="wysiwyg-modal-overlay">
          <div className="wysiwyg-modal-box" style={{ maxWidth: '520px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Insert Content Image</h4>

            {/* Direct Upload Option */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: '1px dashed var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              <input
                ref={imageUploadRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <button
                type="button"
                className="btn btn-outline"
                disabled={uploadingImage}
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderColor: 'var(--accent-cyan)' }}
                onClick={() => imageUploadRef.current?.click()}
              >
                {uploadingImage ? 'Uploading Image to Cloudinary...' : '📁 Upload Local Image to Cloudinary'}
              </button>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>
                PNG, JPG, WebP, GIF supported
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Or Direct Image URL *
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Alt Text (for SEO & Accessibility)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Brief description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Image Caption (Optional display caption)
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Figure 1: Attack vector diagram"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
            </div>

            {imageUrl && (
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                  background: '#070b14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!imageUrl.trim() || uploadingImage}
                style={{ padding: '5px 14px', fontSize: '0.82rem' }}
                onClick={handleApplyImage}
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSERT VIDEO ================= */}
      {videoModalOpen && (
        <div className="wysiwyg-modal-overlay">
          <div className="wysiwyg-modal-box">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Embed Video</h4>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                YouTube or Vimeo URL *
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                autoFocus
              />
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Will automatically render as a responsive 16:9 HD video container.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                onClick={() => setVideoModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!videoUrl.trim()}
                style={{ padding: '5px 14px', fontSize: '0.82rem' }}
                onClick={handleApplyVideo}
              >
                Embed Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSERT TABLE ================= */}
      {tableModalOpen && (
        <div className="wysiwyg-modal-overlay">
          <div className="wysiwyg-modal-box">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-cyan)' }}>Insert Structured Table</h4>
            <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Rows (including Header)
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  className="form-control"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Columns
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="form-control"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                onClick={() => setTableModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '5px 14px', fontSize: '0.82rem' }}
                onClick={handleApplyTable}
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
