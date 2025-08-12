"use client";

import { useEdgeStore } from "@/lib/edgestore";

type BucketName = "publicFiles" | "category" | "subcategory" | "product" | "more";

export const useFileUploader = (setPogress: (progress: number) => void) => {
    const { edgestore } = useEdgeStore();

    const uploadFile = async (file: File, bucket: BucketName, replace?: boolean, oldFileUrl?: string, setMinProgress?: (progress: number) => void) => {
        if (!file) return;
        const uploadObj: any = {}
        if (replace && oldFileUrl) {
            uploadObj.options = { replaceTargetUrl: oldFileUrl };
        }
        uploadObj.file = file;
        uploadObj.onProgressChange = (progress: number) => {
            setPogress(progress);
            if (setMinProgress) { setMinProgress(progress) };
        };
        const res = await edgestore[bucket].upload(uploadObj);
        return res;
    };

    const uploadFiles = async (
        files: File[],
        bucket: BucketName,
        onProgress?: (fileIndex: number, progress: number) => void
    ) => {
        if (!files || files.length === 0) return;

        const results = await Promise.all(
            files.map((file, index) =>
                uploadFile(file, bucket, false, undefined, (progress: number) => {
                    if (onProgress) onProgress(index, progress);
                })
            )
        );

        return results;
    };



    return { uploadFile, uploadFiles };
};


export const useFileDestroyer = (setProgress: (progress: number) => void) => {
    const { edgestore } = useEdgeStore();
    const progressArr = [95, 83, 70, 50, 35, 10, 0];
    const sleep = (num: number) => new Promise(resolve => setTimeout(resolve, num));
    const destroyFile = async (url: string, bucket: BucketName) => {
        if (!url || !bucket) throw new Error("Missing URL or bucket name");
        try {
            for (const progress of progressArr) {
                setProgress(progress);
                await sleep(500);
            }
            const result = await edgestore[bucket].delete({
                url
            });
            return {
                ok: true,
                message: "File deleted successfully",
                data: result,
            }
        } catch (err) {
            return {
                ok: false,
                message: "Failed to delete file",
            };
        }
        finally {
            setProgress(0);
        }
    }
    return { destroyFile };
};


