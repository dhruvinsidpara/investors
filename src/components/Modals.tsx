"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { Button, Field, Modal, inputClass, useToast } from "./ui";

function FileDrop({ file, onFile, accept }: { file: File | null; onFile: (f: File | null) => void; accept?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        onFile(e.dataTransfer.files[0] ?? null);
      }}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
        drag ? "border-primary bg-primary-soft" : "border-[#D5DBF5] bg-[#FAFBFF] hover:border-primary",
      )}
    >
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      {file ? (
        <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-2 shadow-sm" onClick={(e) => e.stopPropagation()}>
          <FileSpreadsheet size={20} className="text-primary" />
          <span className="max-w-[220px] truncate text-sm">{file.name}</span>
          <button onClick={() => onFile(null)} aria-label="Remove file">
            <X size={16} className="text-muted" />
          </button>
        </div>
      ) : (
        <>
          <UploadCloud size={32} className="text-primary" />
          <p className="text-sm text-ink">
            Drag & drop file here or <span className="font-semibold text-primary">browse</span>
          </p>
          <p className="text-xs text-muted">Supported formats: {accept ?? "any"}</p>
        </>
      )}
    </div>
  );
}

export function UploadDataModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [type, setType] = useState("Investments");
  const [file, setFile] = useState<File | null>(null);

  const downloadTemplate = () => {
    const headers =
      type === "Investments"
        ? "Investment ID,Investment Name,Entity Name,Date,Investment,Cap Rate"
        : "Investment ID,Investment Name,Entity Name,Date,Distribution Received,Type";
    const blob = new Blob([headers + "\n"], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type.toLowerCase()}-template.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload data">
      <div className="space-y-4">
        <Field label="Data type">
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            <option>Investments</option>
            <option>Distributions</option>
            <option>Others</option>
          </select>
        </Field>
        <FileDrop file={file} onFile={setFile} accept=".csv,.xlsx,.xls" />
        <button onClick={downloadTemplate} className="text-sm font-medium text-primary hover:underline">
          Download {type.toLowerCase()} template
        </button>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!file}
            onClick={() => {
              toast(`"${file?.name}" uploaded for review`);
              setFile(null);
              onClose();
            }}
          >
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ReportErrorModal({ open, onClose, subject }: { open: boolean; onClose: () => void; subject?: string }) {
  const toast = useToast();
  const [reason, setReason] = useState("Incorrect amount");
  const [details, setDetails] = useState("");
  return (
    <Modal open={open} onClose={onClose} title="Report error">
      <div className="space-y-4">
        {subject && (
          <p className="rounded-lg bg-panel px-3 py-2 text-sm text-ink-2">
            Reporting on <span className="font-semibold text-ink">{subject}</span>
          </p>
        )}
        <Field label="Reason">
          <select value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass}>
            <option>Incorrect amount</option>
            <option>Incorrect date</option>
            <option>Wrong entity</option>
            <option>Missing document</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Details">
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="Describe the issue…" className={inputClass} />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!details.trim()}
            onClick={() => {
              toast("Error reported successfully");
              setDetails("");
              onClose();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AddProofModal({ open, onClose, subject }: { open: boolean; onClose: () => void; subject?: string }) {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [ref, setRef] = useState("");
  return (
    <Modal open={open} onClose={onClose} title="Upload distribution proof">
      <div className="space-y-4">
        {subject && (
          <p className="rounded-lg bg-panel px-3 py-2 text-sm text-ink-2">
            Distribution <span className="font-semibold text-ink">{subject}</span>
          </p>
        )}
        <Field label="Transaction reference">
          <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. WIRE-2021-00018" className={inputClass} />
        </Field>
        <FileDrop file={file} onFile={setFile} accept=".pdf,.png,.jpg" />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!file}
            onClick={() => {
              toast("Proof uploaded successfully");
              setFile(null);
              setRef("");
              onClose();
            }}
          >
            Upload proof
          </Button>
        </div>
      </div>
    </Modal>
  );
}
