import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import ImageTool from "@editorjs/image"
import EditorjsList from "@editorjs/list"

export const PLUGINS = {
  header: Header,
  quote: Quote,
  list: {
      class: EditorjsList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      },
    },
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile(file) {
          const formData = new FormData()
          formData.append("image", file)
          const articleId = window.location.pathname.split("/")[3]
          return new Promise(async (resolve, reject) => {
            try{
              const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/img/save?articleId=${articleId}`, {
                method: "POST",
                body: formData,
              })
              const jsonData = await res.json()
              resolve(jsonData)
            }
            catch (err) {
              reject(err)
            }
            // resolve({
            //   success: 1,
            //   file: {
            //     url: "https://imgs.search.brave.com/5ZTfy6-i_EqNSOC28S4eoqXK9ERM-ldxeUAxNe9ELyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU3/MjA0MzM1L3Bob3Rv/L2RhaXJ5LWNvdy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/X09pQUFjT2lYRW92/ZzEtS3BlajBNZVpv/UnlQMUpUQmVKQXE2/V0dLQ1RDaz0",
            //   }
            // })
          })
        }
      }
    }
  }
}