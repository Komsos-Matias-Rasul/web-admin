"use client"

import { memo, useEffect, useRef } from "react"
import EditorJS from "@editorjs/editorjs"
import { PLUGINS } from "./EditorPlugins"



const Editor = ({ data, onChange, editorBlock}) => {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: PLUGINS,
        placeholder: 'Start writing your article here...',
        autofocus: true,
        async onChange(api, event) {
          const data = await api.saver.save()
          onChange(data)
        },
        logLevel: 'WARNING',
      })
      ref.current = editor
    }
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy()
      }
    }
  }, [])
  return (
    <div id={editorBlock} className="editor-typo min-w-full"/>
  )
}

export default memo(Editor)