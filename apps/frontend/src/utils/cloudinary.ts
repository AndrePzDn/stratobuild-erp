export const uploadFile = async (
  data: File,
  project?: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", data);
  formData.append("upload_preset", "stratobuild");
  if (project) {
    formData.append("folder", `stratobuild/projects/${project}/certifications`);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dnfdovmde/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    console.log(response);
    const result = await response.json();

    if (response.ok) {
      return result.secure_url;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};
