/**
 * the list A - Z
 */
export const createLettersList = Array.from(new Array(26), (ele, i) => {
  return String.fromCharCode(65 + i)
})
