setDoc(id, forceRefresh = false) {
  // 如果是同一文档且不强制刷新，直接返回
  const cleanId = id.replace(/\.md$/, '');
  if (!forceRefresh && this.activeDocId === cleanId) return;

  if (!id) return;
  this.activeDocId = cleanId;
  this.searchOpen && this.closeSearch();
  this.docLoading = true;

  // 动态加载Markdown文件
      const loadMarkdown = async () => {
        try {
          // 优先使用内嵌的文档内容（由docs-inline.js提供）
          const docsContent = window.__scDocs || {};
          const content = docsContent[cleanId];
          
          if (content) {
            return content;
          }
          // 如果没有内嵌内容，再从服务器加载
          const docsPath = document.body?.dataset?.docs || '../docs';
          const timestamp = forceRefresh ? `?t=${Date.now()}` : '';
          const url = `${docsPath}/${cleanId}.md${timestamp}`;
          
          const response = await fetch(url);
          if (!response.ok) throw new Error(`文件不存在: ${url}`);
          return await response.text();
        } catch (e) {
          console.error('加载Markdown失败:', e);
          return `# 内容加载失败\n\n无法加载文档 "${cleanId}". 错误: ${e.message}`;
        }
      };