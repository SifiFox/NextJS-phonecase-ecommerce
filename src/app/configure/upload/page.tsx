"use client"
import {cn} from "@/lib/utils";
import {useState, useTransition} from "react";
import Dropzone, {FileRejection} from "react-dropzone";
import {Image, Loader2, MousePointerSquareDashed} from 'lucide-react'
import {Progress} from "@/components/ui/progress";
import {useUploadThing} from "@/lib/uploadthing";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";

const Page = () => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const router = useRouter()
    const { toast } = useToast()

    const {startUpload, isUploading} = useUploadThing("imageUploader", {
        onClientUploadComplete: ([data]) => {
            const configId = data.serverData.configId
            startTransition(() => {
                router.push(`/configure/design?id=${configId}`)
            })
        },
        onUploadProgress(p) {
            setUploadProgress(p)
        }
    })
    const onDropRejected = (rejectedFiles: FileRejection[]) => {
        const [file] = rejectedFiles
        setIsDragOver(false)
        toast({
            title: `${file.file.type} is not supported`,
            description: 'Please use PNG, JPG or JPEG file',
            variant: 'destructive'
        })
    }
    const onDropAccepted = (acceptedFiles: File[]) => {
        startUpload(acceptedFiles, {configId: undefined})

        setIsDragOver(false)
    }

    const [isPending, startTransition] = useTransition()

    return (

        <div
            className={cn("relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center", {
                "ring-blue-900/25 bg-blue-900/10": isDragOver
            })}>
            <div className="relative flex flex-1 flex-col items-center justify-center w-full">
                <div className="relative flex flex-1 flex-col items-center justify-center w-full">
                    <Dropzone
                        onDropRejected={onDropRejected}
                        onDropAccepted={onDropAccepted}
                        accept={{
                            "image/png": [".png"],
                            "image/jpg": [".jpg"],
                            "image/jpeg": [".jpeg"],
                        }}
                        onDragEnter={() => setIsDragOver(true)}
                        onDragLeave={() => setIsDragOver(false)}
                    >
                        {({getRootProps, getInputProps}) => (
                            <div
                                className="h-full w-full flex-1 flex flex-col items-center justify-center cursor-pointer"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()}/>
                                {isDragOver && <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2"/>}
                                {!isDragOver && isUploading || isPending
                                    ? <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2"/>
                                    : <Image className="h-6 w-6 text-zinc-500 mb-2"/>
                                }
                                <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                                    {isUploading && <div className="flex flex-col items-center">
                                        <p>Uploading...</p>
                                        <Progress className="mt-2 w-40 h-2 bg-gray-300" value={uploadProgress}/>
                                    </div>}
                                    {isUploading && isPending && <div className="flex flex-col items-center">
                                        <p>Redirectins, please wait...</p>
                                    </div>}
                                    {isUploading && isPending && isDragOver
                                        ? <p>
                                            <span className="font-semibold">Drop file</span>
                                            to upload
                                        </p>
                                        : <p>
                                            <span className="font-semibold">Click to upload</span> {` `}
                                            or drag and drop
                                        </p>
                                    }
                                </div>
                                {!isPending && <p className="text-xs text-zinc-500">PNG, JPG, JPEGs</p>}
                            </div>
                        )}
                    </Dropzone>
                </div>
            </div>
        </div>
    )
}

export default Page