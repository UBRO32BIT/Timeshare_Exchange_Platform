export default function convertImageArray(images: any) {
    return images?.map((url : any) => ({
        original: url,
        thumbnail: url,
    }));
}