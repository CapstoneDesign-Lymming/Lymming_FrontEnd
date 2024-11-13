import { useRef, useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const useImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const s3ImageUrl = useRef("");

  const s3Client = new S3Client({
    region: "ap-northeast-2",
    credentials: {
      accessKeyId: import.meta.env.VITE_SECRET_KEY,
      secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      console.log("⭐미리보기:", imageUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요");
      return;
    }
    try {
      const uploadParams = {
        Bucket: import.meta.env.VITE_IMG_S3,
        Key: `folder${selectedFile.name}`, // S3에 저장될 경로와 파일명
        Body: selectedFile,
        ContentType: selectedFile.type,
      };
      const command = new PutObjectCommand(uploadParams);
      const response = await s3Client.send(command);
      console.log("File upload successfully:", response);

      const uploadedUrl = `https://${
        import.meta.env.VITE_IMG_S3
      }.s3.ap-northeast-2.amazonaws.com/folder${encodeURIComponent(
        selectedFile.name
      )}`;
      s3ImageUrl.current = uploadedUrl;
      return s3ImageUrl.current;
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const postUplodFileUrl = (data: string | undefined) => {
    console.log("preImgUrl", data); //TODO: 백엔드로 전송하는 로직으로 변경
  };

  return {
    imageUrl,
    handleFileChange,
    handleUpload,
    postUplodFileUrl,
  };
};
export default useImageUpload;
