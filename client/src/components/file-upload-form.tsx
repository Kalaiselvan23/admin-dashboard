import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, FileSpreadsheet, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Api from "@/lib/Api"
import {toast} from "sonner"

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setError(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    const validTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]

    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a CSV, XLS, or XLSX file")
      setFile(null)
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)

      const response = await Api.post("/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      toast("File uploaded successfully and Data has been distributed to agents" )
      setFile(null)
      setUploadProgress(100)
      toast.success("File uploaded Successfully")

      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    },
    onError: () => {
      setError("Failed to upload file. Please try again.")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    uploadMutation.mutate(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>Upload a CSV, XLS, or XLSX file to distribute data to your agents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="file-upload">File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xls,.xlsx"
                disabled={uploadMutation.isPending}
                className="flex-1"
              />
              <Button type="submit" disabled={!file || uploadMutation.isPending}>
                {uploadMutation.isPending ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FileSpreadsheet className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-xs">({(file.size / 1024).toFixed(2)} KB)</span>
              </div>
            )}
          </div>

          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="rounded-md bg-muted p-4">
            <h3 className="mb-2 font-medium">Instructions</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Upload a CSV, XLS, or XLSX file</li>
              <li>The file should contain columns for data to be distributed</li>
              <li>Maximum file size: 10MB</li>
              <li>After upload, data will be automatically distributed to agents</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
