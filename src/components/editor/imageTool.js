export default class SimpleImage {
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  constructor({ data }) {
    this.data = data;
    this.wrapper = undefined;
    this.relativeLocation = undefined;
  }
  
  render() {
    this.wrapper = document.createElement('div');
    
    this.wrapper.classList.add('text-dark-primary/75');
    if (this.data && this.data.file){
      this._createImage(this.data.file.url)
      return this.wrapper;
    }
    const input = document.createElement('input');
    
    this.wrapper.appendChild(input);
    input.id = "content-img-input"
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (file) {
        try{
          const articleId = window.location.pathname.split("/admin/editor/")[1] 
          let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleId)}/images`,
            {
              method: "POST",
              body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
              })
            })
          let jsonData = await res.json()
          if (!res.ok) throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
          
          const { url, location } = jsonData.data
          res = await fetch(url, {
            headers: {
              "Content-Type": file.type
            },
            method: 'PUT',
            body: file,
          })
          if (!res.ok) throw new Error(`${res.status}`)
          this._createImage(location)
        } catch (err){
          console.error(err)
        }
      }
    });
    input.click()
    return this.wrapper;
  }

  save(blockContent){
    const img = blockContent.querySelector('img')
    return {
      file:{
        url: img ? img.id : ""
      }
    }
  }

  _createImage(url) {
    const image = document.createElement('img');
    const caption = document.createElement('input');
    const imgInput = document.getElementById("content-img-input")
    
    image.id = url
    image.src = process.env.NEXT_PUBLIC_GCLOUD_PREFIX + url;
    caption.placeholder = 'Caption...';
    this.wrapper.appendChild(image);
    this.wrapper.appendChild(caption);
    if(imgInput) this.wrapper.removeChild(imgInput)
  }

  validate(savedData) {
    if (!savedData.file.url.trim()) {
      return false;
    }

    return true;
  }
}