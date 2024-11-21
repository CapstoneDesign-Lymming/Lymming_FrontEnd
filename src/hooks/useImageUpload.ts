import { useRef, useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import useSelectedFileStore from "../store/useSelectedFileStore";

const useImageUpload = () => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const s3ImageUrl = useRef("");

  const s3Client = new S3Client({
    region: "ap-northeast-2",
    credentials: {
      accessKeyId: import.meta.env.VITE_SECRET_KEY,
      secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
    },
  });
  const { globalSelectedFile, setGlobalSelectedFile } = useSelectedFileStore();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // setSelectedFile(file);
      setGlobalSelectedFile(file); //전역적으로 사용
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!globalSelectedFile) {
      // alert("파일을 선택해주세요");
      return;
    }
    try {
      const uploadParams = {
        Bucket: import.meta.env.VITE_IMG_S3,
        Key: `folder${globalSelectedFile.name}`, // S3에 저장될 경로와 파일명
        Body: globalSelectedFile,
        ContentType: globalSelectedFile.type,
      };
      const command = new PutObjectCommand(uploadParams);
      const response = await s3Client.send(command);
      console.log("File upload successfully:", response);

      const uploadedUrl = `https://${
        import.meta.env.VITE_IMG_S3
      }.s3.ap-northeast-2.amazonaws.com/folder${encodeURIComponent(
        globalSelectedFile.name
      )}`;
      s3ImageUrl.current = uploadedUrl;
      console.log("🎁🎁🎁", s3ImageUrl.current);
      return s3ImageUrl.current;
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  return {
    imageUrl,
    handleFileChange,
    handleUpload,
  };
};
export default useImageUpload;
