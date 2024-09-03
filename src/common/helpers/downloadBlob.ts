export const downloadBlob = (blob: Blob, name: string) => {
  const href = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = href;
  link.setAttribute("download", name); // or any other extension
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
