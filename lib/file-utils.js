// Reads a File into a base64 data URL so it can be stored directly in Redux
// state (and therefore localStorage) without needing a real upload backend.
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
