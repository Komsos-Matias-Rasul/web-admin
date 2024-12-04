import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import ImageTool from "@editorjs/image"

export const PLUGINS = {
  header: Header,
  quote: Quote,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile(file) {
          return new Promise((resolve, reject) => {
            resolve({
              success: 1,
              file: {
                url: "https://imgs.search.brave.com/5ZTfy6-i_EqNSOC28S4eoqXK9ERM-ldxeUAxNe9ELyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU3/MjA0MzM1L3Bob3Rv/L2RhaXJ5LWNvdy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/X09pQUFjT2lYRW92/ZzEtS3BlajBNZVpv/UnlQMUpUQmVKQXE2/V0dLQ1RDaz0",
              }
            })
          })
        }
      }
    }
  }
}