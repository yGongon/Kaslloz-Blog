// ... existing code ...
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    // Inicia com os dados base comuns a todos os posts
    const postData: any = { 
        title, 
        category, 
        content, 
        imageUrl, 
        tags: tagsArray,
    };

    // Adiciona campos específicos da categoria
    if (category === Category.Builds) {
      postData.weaponType = weaponType;
      postData.youtubeId = extractYouTubeId(youtubeUrl);
    } else if (category === Category.PatchNotes) {
      postData.version = version;
    }
    // A categoria 'OperatorGuides' não precisa de campos extras neste modal

    if (postToEdit) {
      // Mantém as contagens de votos originais ao atualizar
      const fullPostData = {
          ...postToEdit,
          ...postData
      };
      updatePost(fullPostData);
    } else {
      addPost(postData);
    }
    onClose();
  };
  
  const handleGenerateIdea = useCallback(async () => {
// ... existing code ...
