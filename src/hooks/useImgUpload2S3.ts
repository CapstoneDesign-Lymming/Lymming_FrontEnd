import AWS from "aws-sdk";
import { useState } from "react";

const useImgUpload2S3 = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null); //FIXME: 추가됨
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadFileUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      console.log("⭐미리보기:", imageUrl);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요");
      return;
    }
    console.log(selectedFile);
    AWS.config.update({
      accessKeyId: import.meta.env.VITE_SECRET_KEY,
      secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
      region: "ap-northeast-2",
    });

    const s3 = new AWS.S3();
    console.log(selectedFile);
    const uploadParams = {
      Bucket: import.meta.env.VITE_IMG_S3,
      Key: `folder${selectedFile.name}`, // S3에 저장될 경로와 파일명
      Body: selectedFile,
    };
    s3.upload(
      uploadParams,
      (err: unknown, data: { ETag: unknown; Location: unknown }) => {
        if (err) {
          console.error("Error uploading file:", err);
        } else {
          console.log("File uploaded successfully. ETag:", data.ETag);
          const uploadedFileUrl = data.Location as string;
          console.log(uploadedFileUrl);
          setUploadFileUrl(uploadedFileUrl);
          //TODO: uploadedFileUrl은 s3에 저장된 이미지의 url로 백엔드에게 전달해주기
        }
      }
    );
  };

  return { imageUrl, handleFileChange, handleUpload, uploadedFileUrl };
};
export default useImgUpload2S3;
