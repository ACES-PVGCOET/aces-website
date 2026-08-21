import { FormDetail, FormListItem, FormSubmitPayload } from "../types/forms";

const getBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
  );
};

export async function getAllForms(): Promise<FormListItem[]> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/forms`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data.forms || json.data || [];
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch forms from API (${url}):`, error);
    throw error;
  }
}

export async function getFormById(formId: string): Promise<FormDetail> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/forms/${encodeURIComponent(formId)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }

    throw new Error(json.error?.message || "Failed to load form details");
  } catch (error) {
    console.error(`Failed to fetch form ID ${formId} from API:`, error);
    throw error;
  }
}

export async function checkResponseExists(formId: string, email: string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/forms/${encodeURIComponent(formId)}/responses/check?email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return false;

    const json = await res.json();
    return Boolean(json.data?.exists);
  } catch (error) {
    console.warn(`Failed to check response existence for email ${email}:`, error);
    return false;
  }
}

export async function submitFormResponse(
  formId: string,
  payload: FormSubmitPayload
): Promise<{ response_id: string }> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/forms/${encodeURIComponent(formId)}/responses`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || "Failed to submit form response");
  }

  return json.data;
}

export async function uploadFormFile(file: File): Promise<{ url: string; public_id?: string }> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/forms/upload`;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || "Failed to upload file");
  }

  return json.data;
}
