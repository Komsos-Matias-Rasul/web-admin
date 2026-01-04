import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import EditorjsList from "@editorjs/list"
import SimpleImage from "./editor/imageTool"

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
  image: SimpleImage
}