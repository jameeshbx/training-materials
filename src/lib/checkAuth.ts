export function isLoggedIn() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("usertoken="));

  return !!token; 
}
