import { getDB } from "@/lib/db"
import WriteArticle from "@/components/WriteArticle"
import { ArchiveArticleButton, DeleteArticleButton } from "@/components/articleManager/ArticleButtons"
import { ImageInput } from "@/components/ThumbnailUploader";
import { SettingsModal } from "@/components/articleManager/ArticleModals";

const EditArticlePage = async ({ params }) => {
  const db = getDB()
  const param = await params
  let categories = {
    rows: []
  }
  let writers = {
    rows: [],
    writer_name: []
  }
  let dataContent, dataThumbnail, dataTitle, dataWriter, dataCategory, dataID
  try {
    categories = await db.query("SELECT * FROM categories WHERE edition_id = (select edition_id FROM articles a WHERE a.id = $1 ) OR categories.id=1 ORDER BY id", [Number(param.articleId)])
    writers = await db.query("SELECT * FROM writers ORDER BY id")
    const _res = await db.query(`
      SELECT title, writer_id ,headline_img, content_json, category_id FROM articles
      WHERE articles.id = $1`, [Number(param.articleId)])
    if (_res.rows.length > 0) {
      dataID = Number(param.articleId)
      dataContent = JSON.parse(_res.rows[0].content_json)
      dataThumbnail = _res.rows[0].headline_img
      dataTitle = _res.rows[0].title || ""
      dataWriter = String(_res.rows[0].writer_id)
      dataCategory = String(_res.rows[0].category_id)
    }
  } catch (err) {
    console.error(err)
  }

  return (
    <main>
      <div className="flex w-full items-end gap-4">
        <div className="w-3/5 shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-lg border space-y-2">
            <SettingsModal
              dataID={dataID}
              categories={categories?.rows.map((category) => category) ?? []}
              writers={writers?.rows.map((writer) => writer) ?? []}
              dataTitle={dataTitle}
              dataWriter={dataWriter}
              dataCategory={dataCategory}
            />
            <h1 className="text-lg font-semibold">Basic Information</h1>
            <div className="flex">
              <label className="w-1/3 shrink-0">Title</label>
              <p><span className="select-none">: </span>{dataTitle}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Writer</label>
              <p><span className="select-none">: </span>{writers.rows.filter((item) => item.id === Number(dataWriter))[0].writer_name}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Category</label>
              <p><span className="select-none">: </span>{categories.rows.filter((item) => item.id === Number(dataCategory))[0].label}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Status</label>
              <p><span className="select-none">: </span>PUBLISHED | DRAFT | ARCHIVED</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ImageInput img={dataThumbnail} />
        </div>
      </div>
      <WriteArticle
        dataID={dataID}
        categories={categories.rows}
        dataContent={dataContent}
        dataThumbnail={dataThumbnail}
        dataTitle={dataTitle}
        dataWriter={dataWriter}
        dataCategory={dataCategory}
      />
      <div className="flex flex-col gap-2">
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Archive</h3>
          <p>This action will tag the article as archived so it will no longer shows up in the draft neither on public. You can change this later.</p>
          <div className="flex justify-end items-center">
            <ArchiveArticleButton articleId={Number(param.articleId)} />
          </div>
        </div>
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Permanently Delete</h3>
          <p>This action will permanently delete the article. This action is irreversible.</p>
          <div className="flex justify-end items-center">
            <DeleteArticleButton articleId={Number(param.articleId)} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default EditArticlePage