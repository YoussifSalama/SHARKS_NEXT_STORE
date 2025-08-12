export function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = function () {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(objectUrl);
        };

        img.onerror = function () {
            resolve(null);
        };

        img.src = objectUrl;
    });
}


