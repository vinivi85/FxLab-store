"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProductImageCell({
  productId,
  productSlug,
  imageUrl,
  onUploaded,
}: {
  productId: string;
  productSlug: string;
  imageUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${productSlug}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    const { error: dbError } = await supabase
      .from("products")
      .update({ image_urls: [publicUrl] })
      .eq("id", productId);

    setUploading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    onUploaded(publicUrl);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg border border-navy-800/10 object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-silver-100 text-[9px] text-navy-800/40">
          none
        </div>
      )}
      <div>
        <label className="cursor-pointer rounded-full border border-navy-800/20 px-2.5 py-1 text-xs font-medium text-navy-800 hover:bg-navy-100">
          {uploading ? "Uploading…" : imageUrl ? "Replace" : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        {error && <p className="mt-1 max-w-[140px] text-[10px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
