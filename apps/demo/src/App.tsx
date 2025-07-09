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
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Upload Document
      </h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CloudUploadIcon className="w-12 h-12 text-gray-400" />
        <p className="mt-4 text-gray-600">Drag & drop your file here</p>
        <p className="text-gray-500">or</p>
        <button
          type="button"
          disabled={disabled}
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
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
  <div className="w-full mt-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">Preview</h2>
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
      {previewUrl ? (
        file?.type.startsWith("image/") ? (
          <img
            src={previewUrl}
            alt="Document Preview"
            className="object-contain h-full w-full"
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
          <ImageIcon className="w-16 h-16 mx-auto" />
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
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
      />
      {confidence === "high" && (
        <CheckCircleIcon className="absolute right-3 top-8 w-6 h-6 text-green-500" />
      )}
      {confidence === "low" && (
        <ExclamationTriangleIcon className="absolute right-3 top-8 w-6 h-6 text-yellow-500" />
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
    [previewUrl]
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
          "Failed to extract information. The AI couldn't process the document."
        );
      }
    } catch (e) {
      setError(
        "An API error occurred. Please check your API key and try again."
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
    (field) => field.confidence !== "none"
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
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col items-center py-10 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">DocExtract AI</h1>
      </header>
      <main className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
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
              <div className="text-red-500 text-sm mt-2 mb-4">{error}</div>
            )}
            <div className="space-y-3 mt-4">
              <button
                onClick={handleExtract}
                disabled={!file || isProcessing}
                className="w-full flex items-center justify-center p-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <>
                    <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <DocumentScanIcon className="h-5 w-5 mr-2" />
                    Extract Information
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={!isDataExtracted || isProcessing}
                className="w-full flex items-center justify-center p-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                {isEditing ? "Lock Fields" : "Edit Manually"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isDataExtracted || isProcessing}
                className="w-full flex items-center justify-center p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                <SendIcon className="h-5 w-5 mr-2" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
