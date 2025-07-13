import React, { useState, useCallback } from "react";
import {
  CloudUploadIcon,
  ImageIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentScanIcon,
  PencilIcon,
  SendIcon,
  SpinnerIcon,
} from "./components/icons";
import { extractInfoFromDoc } from "./services/geminiService";
import type { ExtractedData, ExtractedDataKey } from "./types";

const initialExtractedData: ExtractedData = {
  fullName: { value: "", confidence: "none" },
  age: { value: "", confidence: "none" },
  nationality: { value: "", confidence: "none" },
  job: { value: "", confidence: "none" },
};

const FileUploader: React.FC<{
  onFileSelect: (file: File) => void;
  disabled: boolean;
}> = ({ onFileSelect, disabled }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <h2 className="mb-2 text-lg font-semibold text-gray-700">
        Upload Document
      </h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:bg-gray-50"
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CloudUploadIcon className="h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">Drag & drop your file here</p>
        <p className="text-gray-500">or</p>
        <button
          type="button"
          disabled={disabled}
          className="mt-2 rounded-md bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
        >
          Upload Document
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={disabled}
        />
        <p className="mt-4 text-sm text-gray-400">Supports: JPG, PNG, PDF</p>
      </div>
    </div>
  );
};

const Preview: React.FC<{ file: File | null; previewUrl: string | null }> = ({
  file,
  previewUrl,
}) => (
  <div className="mt-6 w-full">
    <h2 className="mb-2 text-lg font-semibold text-gray-700">Preview</h2>
    <div className="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
      {previewUrl ? (
        file?.type.startsWith("image/") ? (
          <img
            src={previewUrl}
            alt="Document Preview"
            className="h-full w-full object-contain"
          />
        ) : (
          <iframe
            src={previewUrl}
            className="h-full w-full"
            title="Document Preview"
          />
        )
      ) : (
        <div className="text-center text-gray-400">
          <ImageIcon className="mx-auto h-16 w-16" />
          <p className="mt-2">No document uploaded</p>
        </div>
      )}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string;
  value: string;
  confidence: "high" | "low" | "none";
  isEditing: boolean;
  onChange: (value: string) => void;
}> = ({ label, value, confidence, isEditing, onChange }) => {
  return (
    <div className="relative mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-2 transition-colors disabled:bg-gray-200 disabled:text-gray-500"
      />
      {confidence === "high" && (
        <CheckCircleIcon className="absolute top-8 right-3 h-6 w-6 text-green-500" />
      )}
      {confidence === "low" && (
        <ExclamationTriangleIcon className="absolute top-8 right-3 h-6 w-6 text-yellow-500" />
      )}
    </div>
  );
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] =
    useState<ExtractedData>(initialExtractedData);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setFile(selectedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setExtractedData(initialExtractedData);
      setIsEditing(false);
      setError(null);
    },
    [previewUrl],
  );

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setExtractedData(initialExtractedData);
    try {
      const data = await extractInfoFromDoc(file);
      if (data) {
        setExtractedData(data);
      } else {
        setError(
          "Failed to extract information. The AI couldn't process the document.",
        );
      }
    } catch (e) {
      setError(
        "An API error occurred. Please check your API key and try again.",
      );
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDataChange = (field: ExtractedDataKey, value: string) => {
    setExtractedData((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const isDataExtracted = Object.values(extractedData).some(
    (field) => field.confidence !== "none",
  );

  const handleSubmit = () => {
    alert("Submitting data:\n" + JSON.stringify(extractedData, null, 2));
    // Reset state after submission
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setExtractedData(initialExtractedData);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          DocExtract AI (Demo)
        </h1>
      </header>
      <main className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col">
            <FileUploader
              onFileSelect={handleFileSelect}
              disabled={isProcessing}
            />
            <Preview file={file} previewUrl={previewUrl} />
          </div>
          {/* Right Column */}
          <div className="flex flex-col">
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              Extracted Information
            </h2>
            <div className="flex-grow">
              <FormField
                label="Full Name"
                value={extractedData.fullName.value}
                confidence={extractedData.fullName.confidence}
                isEditing={isEditing}
                onChange={(val) => handleDataChange("fullName", val)}
              />
              <FormField
                label="Age"
                value={extractedData.age.value}
                confidence={extractedData.age.confidence}
                isEditing={isEditing}
                onChange={(val) => handleDataChange("age", val)}
              />
              <FormField
                label="Nationality"
                value={extractedData.nationality.value}
                confidence={extractedData.nationality.confidence}
                isEditing={isEditing}
                onChange={(val) => handleDataChange("nationality", val)}
              />
              <FormField
                label="Job"
                value={extractedData.job.value}
                confidence={extractedData.job.confidence}
                isEditing={isEditing}
                onChange={(val) => handleDataChange("job", val)}
              />
            </div>
            {error && (
              <div className="mt-2 mb-4 text-sm text-red-500">{error}</div>
            )}
            <div className="mt-4 space-y-3">
              <button
                onClick={handleExtract}
                disabled={!file || isProcessing}
                className="flex w-full items-center justify-center rounded-lg bg-cyan-500 p-3 font-semibold text-white transition-all hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isProcessing ? (
                  <>
                    <SpinnerIcon className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <DocumentScanIcon className="mr-2 h-5 w-5" />
                    Extract Information
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={!isDataExtracted || isProcessing}
                className="flex w-full items-center justify-center rounded-lg bg-slate-200 p-3 font-semibold text-slate-700 transition-all hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <PencilIcon className="mr-2 h-5 w-5" />
                {isEditing ? "Lock Fields" : "Edit Manually"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isDataExtracted || isProcessing}
                className="flex w-full items-center justify-center rounded-lg bg-green-500 p-3 font-semibold text-white transition-all hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <SendIcon className="mr-2 h-5 w-5" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
