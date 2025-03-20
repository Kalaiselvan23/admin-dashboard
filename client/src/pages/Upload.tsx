import { FileUploadForm } from "@/components/file-upload-form"

export default function Upload() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload CSV</h1>
        <p className="text-muted-foreground">Upload and distribute data to your agents</p>
      </div>

      <FileUploadForm />
    </div>
  )
}
