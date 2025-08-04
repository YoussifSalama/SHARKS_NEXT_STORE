"use client";

import { cn } from '@/lib/utils';
import { Trash2Icon, XIcon } from 'lucide-react';
import * as React from 'react';
import { type DropzoneOptions } from 'react-dropzone';
import { Dropzone } from './dropzone';
import { useUploader } from './uploader-provider';
import { Button } from '@/components/ui/button';
import { Progressbar2 } from '@/app/sharks-dashboard-2025/features/Progressbar';

export interface ImageListProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  setActiveImageIndex?: (index: number) => void;
}

const ImageList = React.forwardRef<HTMLDivElement, ImageListProps>(
  ({ className, disabled: initialDisabled, setActiveImageIndex, ...props }, ref) => {
    const { fileStates, removeFile, cancelUpload, coverIndex, setCoverIndex } = useUploader();

    const tempUrls = React.useMemo(() => {
      const urls: Record<string, string> = {};
      fileStates.forEach((fileState) => {
        if (fileState.file) {
          urls[fileState.key] = URL.createObjectURL(fileState.file);
        }
      });
      return urls;
    }, [fileStates]);

    React.useEffect(() => {
      return () => {
        Object.values(tempUrls).forEach((url) => {
          URL.revokeObjectURL(url);
        });
      };
    }, [tempUrls]);

    React.useEffect(() => {
      if (setActiveImageIndex) setActiveImageIndex(coverIndex);
    }, [coverIndex, setActiveImageIndex]);

    if (!fileStates.length) return null;

    return (
      <div
        ref={ref}
        className={cn('mt-4 grid grid-cols-6 max-lg:grid-cols-4 max-md:grid-cols-4 gap-4', className)}
        {...props}
      >
        {fileStates.map((fileState, index) => {
          const displayUrl = tempUrls[fileState.key] ?? fileState.url;
          const isCover = index === coverIndex;

          return (
            <button
              key={fileState.key}
              type="button"
              className={cn(
                'relative aspect-square h-full w-full rounded-md border-0 bg-muted p-0 shadow-md overflow-hidden',
                isCover && 'ring-2 ring-gray-300 shadow-md'
              )}
              onClick={() => {
                if (!initialDisabled) setCoverIndex(index);
              }}
            >
              {displayUrl ? (
                <img
                  className="h-full w-full rounded-md object-cover"
                  src={displayUrl}
                  alt={fileState.file.name}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="text-xs text-muted-foreground">No Preview</span>
                </div>
              )}

              {fileState.status === 'UPLOADING' && (
                <Progressbar2 progress={fileState.progress} upload={true} />
              )}

              {displayUrl && !initialDisabled && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105 absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileState.status === 'UPLOADING') {
                      cancelUpload(fileState.key);
                    } else {
                      removeFile(fileState.key);
                    }
                  }}
                >
                  {fileState.status === 'UPLOADING' ? (
                    <XIcon className="block h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Trash2Icon className="block h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              )}

              {isCover && (
                <span
                  className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105 absolute top-2 left-2 z-10
               inline-block px-2 py-0.5 text-xs font-semibold select-none cursor-default"
                >
                  Cover
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

ImageList.displayName = 'ImageList';

export interface ImageDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled' | 'onDrop'>;
  inputRef?: React.Ref<HTMLInputElement>;
}

const ImageDropzone = React.forwardRef<HTMLDivElement, ImageDropzoneProps>(
  ({ dropzoneOptions, className, disabled, inputRef, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        <Dropzone
          ref={inputRef}
          dropzoneOptions={{
            accept: { 'image/*': [] },
            ...dropzoneOptions,
          }}
          disabled={disabled}
          dropMessageActive="Drop images here..."
          dropMessageDefault="drag & drop images here, or click to select"
        />
      </div>
    );
  },
);
ImageDropzone.displayName = 'ImageDropzone';

export interface ImageUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  dropzoneClassName?: string;
  imageListClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  setActiveImageIndex?: (index: number) => void;
}

const ImageUploader = React.forwardRef<HTMLDivElement, ImageUploaderProps>(
  (
    {
      maxFiles,
      maxSize,
      disabled,
      className,
      dropzoneClassName,
      imageListClassName,
      inputRef,
      setActiveImageIndex,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('w-full space-y-4 mt-2', className)} {...props}>
        <ImageDropzone
          ref={inputRef}
          dropzoneOptions={{
            maxFiles,
            maxSize,
          }}
          disabled={disabled}
          className={cn(dropzoneClassName, 'bg-transparent border-0 ')}
        />
        <ImageList
          className={imageListClassName}
          disabled={disabled}
          setActiveImageIndex={setActiveImageIndex}
        />
      </div>
    );
  },
);
ImageUploader.displayName = 'ImageUploader';

export { ImageList, ImageDropzone, ImageUploader };
